'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized patient scenarios for medical training.
 *
 * It includes:
 * - `generatePersonalizedScenario`: An async function that orchestrates the generation of personalized scenarios.
 * - `GeneratePersonalizedScenarioInput`: The input type for the generatePersonalizedScenario function.
 * - `GeneratePersonalizedScenarioOutput`: The output type for the generatePersonalizedScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedScenarioInputSchema = z.object({
  studentId: z.string().describe('The ID of the medical student.'),
  specialty: z.string().describe('The medical specialty of the student.'),
  performanceData: z.string().describe('The past performance of the student in previous simulations, should include metrics such as time to diagnosis and interventions chosen'),
  datasetId: z.string().describe('The ID of the anonymized patient dataset to use for scenario generation.'),
});
export type GeneratePersonalizedScenarioInput = z.infer<
  typeof GeneratePersonalizedScenarioInputSchema
>;

const GeneratePersonalizedScenarioOutputSchema = z.object({
  scenarioDescription: z.string().describe('A detailed description of the generated patient scenario.'),
  learningObjectives: z.array(z.string()).describe('The key learning objectives for the generated scenario.'),
  comorbidities: z.string().optional().describe('Comorbidities that the patient may have.'),
});
export type GeneratePersonalizedScenarioOutput = z.infer<
  typeof GeneratePersonalizedScenarioOutputSchema
>;

export async function generatePersonalizedScenario(
  input: GeneratePersonalizedScenarioInput
): Promise<GeneratePersonalizedScenarioOutput> {
  return generatePersonalizedScenarioFlow(input);
}

const analyzePastSimulationsTool = ai.defineTool({
  name: 'analyzePastSimulations',
  description: 'Analyzes past simulation outcomes to identify similar training cases and scenarios with the best learning outcome for a given student.',
  inputSchema: z.object({
    studentId: z.string().describe('The ID of the medical student.'),
    performanceData: z.string().describe('Past performance data of the student, including metrics like time to diagnosis and interventions chosen.'),
    datasetId: z.string().describe('The ID of the anonymized patient dataset.'),
  }),
  outputSchema: z.object({
    similarScenarioIds: z
      .array(z.string())
      .describe(
        'A list of IDs of similar scenarios with good learning outcomes.'
      ),
  }),
}, async (input) => {
  // TODO: implement a call to the backend to fetch similar scenario Ids.
  return {similarScenarioIds: []}; // Replace with actual implementation
});


const prompt = ai.definePrompt({
  name: 'generatePersonalizedScenarioPrompt',
  input: {schema: GeneratePersonalizedScenarioInputSchema},
  output: {schema: GeneratePersonalizedScenarioOutputSchema},
  tools: [analyzePastSimulationsTool],
  prompt: `You are an AI-powered patient scenario generator for medical training. 

  You will generate a personalized patient scenario based on the student's profile, past performance, and available patient datasets. 

  Use the analyzePastSimulations tool to identify similar scenarios with good learning outcomes.

  Student ID: {{{studentId}}}
  Specialty: {{{specialty}}}
  Performance Data: {{{performanceData}}}
  Dataset ID: {{{datasetId}}}

  Based on this information, create a realistic and challenging patient scenario with specific learning objectives.

  Make sure to include a detailed scenario description and a list of key learning objectives for the scenario.
  The scenario should be tailored to the student's specialty and address areas where they need improvement, as indicated by their performance data. 

  Return the scenario in the following JSON format:
  {
    "scenarioDescription": "...",
    "learningObjectives": ["...", "..."],
    "comorbidities": "..."
  }
  `,
});

const generatePersonalizedScenarioFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedScenarioFlow',
    inputSchema: GeneratePersonalizedScenarioInputSchema,
    outputSchema: GeneratePersonalizedScenarioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
