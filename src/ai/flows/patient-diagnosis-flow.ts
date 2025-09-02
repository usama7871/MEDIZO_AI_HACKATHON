'use server';

/**
 * @fileOverview This file defines a multi-agent Genkit flow for diagnosing a patient.
 * It acts as a master agent that delegates to specialist agents based on the patient's condition.
 *
 * It includes:
 * - `diagnosePatient`: The main async function that orchestrates the diagnostic process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PatientDiagnosisInput, PatientDiagnosisOutput } from '@/ai/schemas/patient-diagnosis';
import { PatientDiagnosisInputSchema, PatientDiagnosisOutputSchema } from '@/ai/schemas/patient-diagnosis';


// Specialist Prompts (Agents)
const createSpecialistPrompt = (specialty: string) => ai.definePrompt({
  name: `${specialty.toLowerCase()}SpecialistPrompt`,
  input: { schema: PatientDiagnosisInputSchema },
  output: { schema: z.object({ report: z.string().describe(`Detailed report from a ${specialty} perspective.`) }) },
  prompt: `You are a world-class ${specialty} consultant. You have been asked to review a patient case.
  Analyze the provided scenario, learning objectives, and medical records.
  Provide a detailed report with your findings, differential diagnosis, and recommended next steps from a ${specialty} point of view.

  Patient Scenario: {{{scenarioDescription}}}
  Learning Objectives: {{#each learningObjectives}}- {{{this}}}\n{{/each}}
  Comorbidities: {{{comorbidities}}}
  Uploaded Records: {{{uploadedMedicalRecords}}}
  Referring Doctor: Dr. {{{doctor.name}}} ({{{doctor.specialty}}})
  
  Your ${specialty} report:`,
});

const cardiologyPrompt = createSpecialistPrompt('Cardiology');
const neurologyPrompt = createSpecialistPrompt('Neurology');
const pediatricsPrompt = createSpecialistPrompt('Pediatrics');
const generalMedicinePrompt = createSpecialistPrompt('General Medicine');


// Master Agent (Dispatcher) Prompt
const masterAgentPrompt = ai.definePrompt({
  name: 'masterAgentPrompt',
  input: { schema: PatientDiagnosisInputSchema },
  output: { schema: PatientDiagnosisOutputSchema },
  prompt: `You are a lead Emergency Room physician AI. Your job is to perform an initial assessment and then route the case to the correct specialist for a consultation.

  Patient case details:
  - Scenario: {{{scenarioDescription}}}
  - Comorbidities: {{{comorbidities}}}
  - Learning Objectives: {{#each learningObjectives}}- {{{this}}}\n{{/each}}
  - Uploaded Records: {{{uploadedMedicalRecords}}}
  - Attending Physician: Dr. {{{doctor.name}}} ({{{doctor.specialty}}})

  1. Provide a brief initial assessment.
  2. Based on the primary condition described in the scenario, determine the best specialist to consult (Cardiology, Neurology, Pediatrics, General Medicine).
  3. Formulate the recommended action, which should be to "Consult [Specialty]".
  `,
});

// The Main Flow
export async function diagnosePatient(input: PatientDiagnosisInput): Promise<PatientDiagnosisOutput> {
  return diagnosePatientFlow(input);
}

const diagnosePatientFlow = ai.defineFlow(
  {
    name: 'diagnosePatientFlow',
    inputSchema: PatientDiagnosisInputSchema,
    outputSchema: PatientDiagnosisOutputSchema,
  },
  async (input) => {
    // 1. Master agent makes an initial assessment and decides which specialist to call.
    const masterResponse = await masterAgentPrompt(input);
    const initialOutput = masterResponse.output!;

    let specialistReport = 'No specialist consulted.';
    let specialistToConsult = initialOutput.specialistConsult;

    // If the master agent doesn't recommend a specific specialist, default to the attending doctor's specialty or General Medicine.
    if (!specialistToConsult) {
      specialistToConsult = input.doctor.specialty || 'General Medicine';
    }


    // 2. Based on the master agent's decision, call the appropriate specialist agent.
    switch (specialistToConsult?.toLowerCase()) {
      case 'cardiology':
        const cardioResponse = await cardiologyPrompt(input);
        specialistReport = cardioResponse.output!.report;
        break;
      case 'neurology':
        const neuroResponse = await neurologyPrompt(input);
        specialistReport = neuroResponse.output!.report;
        break;
      case 'pediatrics':
        const pedsResponse = await pediatricsPrompt(input);
        specialistReport = pedsResponse.output!.report;
        break;
      default:
        const generalResponse = await generalMedicinePrompt(input);
        specialistReport = generalResponse.output!.report;
        initialOutput.specialistConsult = 'General Medicine'; // Default assignment
        break;
    }

    // 3. Combine the initial assessment with the specialist's report for the final output.
    return {
      ...initialOutput,
      specialistConsult: specialistToConsult,
      specialistReport,
    };
  }
);
