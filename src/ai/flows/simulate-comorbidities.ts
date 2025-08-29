'use server';

/**
 * @fileOverview Simulates the presence of comorbidities in a patient simulation.
 *
 * - simulateComorbidities - A function that determines whether to present comorbidities based on the patient's primary condition.
 * - SimulateComorbiditiesInput - The input type for the simulateComorbidities function.
 * - SimulateComorbiditiesOutput - The return type for the simulateComorbidities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateComorbiditiesInputSchema = z.object({
  primaryCondition: z
    .string()
    .describe('The primary medical condition the patient is being simulated for.'),
  patientHistory: z.string().optional().describe('The patient\'s medical history, if available.'),
});
export type SimulateComorbiditiesInput = z.infer<typeof SimulateComorbiditiesInputSchema>;

const SimulateComorbiditiesOutputSchema = z.object({
  presentComorbidities: z
    .boolean()
    .describe(
      'Whether or not to present comorbidities in the patient simulation based on the primary condition and patient history.'
    ),
  comorbiditiesReasoning: z
    .string()
    .describe('The reasoning behind the decision to present or not present comorbidities.'),
});
export type SimulateComorbiditiesOutput = z.infer<typeof SimulateComorbiditiesOutputSchema>;

export async function simulateComorbidities(input: SimulateComorbiditiesInput): Promise<SimulateComorbiditiesOutput> {
  return simulateComorbiditiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateComorbiditiesPrompt',
  input: {schema: SimulateComorbiditiesInputSchema},
  output: {schema: SimulateComorbiditiesOutputSchema},
  prompt: `You are a medical AI assistant helping to create realistic patient simulations for medical students.

You are given a patient\'s primary medical condition and optionally their medical history.

Based on this information, you must determine whether or not it would be realistic to present comorbidities in the simulation. Comorbidities are additional conditions or diseases that the patient might have alongside the primary condition.

Consider factors such as the prevalence of comorbidities with the given primary condition, the patient\'s age, and any relevant information in the patient history (if provided).

Return a boolean value for 
whether comorbidities should be presented, and provide a brief explanation for your reasoning in the \`comorbiditiesReasoning\` field.

Primary Condition: {{{primaryCondition}}}
Patient History: {{{patientHistory}}}

Present Comorbidities:`,
});

const simulateComorbiditiesFlow = ai.defineFlow(
  {
    name: 'simulateComorbiditiesFlow',
    inputSchema: SimulateComorbiditiesInputSchema,
    outputSchema: SimulateComorbiditiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
