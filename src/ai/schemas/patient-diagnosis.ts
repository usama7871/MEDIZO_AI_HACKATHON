import { z } from 'genkit';

// Input and Output Schemas
export const PatientDiagnosisInputSchema = z.object({
  scenarioDescription: z.string().describe('The full patient scenario description.'),
  learningObjectives: z.array(z.string()).describe('Learning objectives for the simulation.'),
  comorbidities: z.string().optional().describe('Patient\'s comorbidities.'),
  uploadedMedicalRecords: z.string().optional().describe('Content of any uploaded medical records.'),
  doctor: z.object({
    name: z.string().describe('The name of the attending doctor.'),
    specialty: z.string().describe('The specialty of the attending doctor.'),
  }).describe('The doctor handling the case.'),
});
export type PatientDiagnosisInput = z.infer<typeof PatientDiagnosisInputSchema>;

export const PatientDiagnosisOutputSchema = z.object({
  initialAssessment: z.string().describe('The initial assessment of the patient.'),
  recommendedAction: z.string().describe('The recommended immediate action or consultation.'),
  specialistConsult: z.string().optional().describe('The specialty to consult (e.g., Cardiology, Neurology).'),
  specialistReport: z.string().optional().describe('The detailed report from the specialist consultation.'),
});
export type PatientDiagnosisOutput = z.infer<typeof PatientDiagnosisOutputSchema>;
