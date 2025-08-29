'use server';

/**
 * @fileOverview Analyzes a student's question and determines the best way to respond.
 *
 * - analyzeStudentQuestion - A function that handles the analysis of student questions and determines how to best respond.
 * - AnalyzeStudentQuestionInput - The input type for the analyzeStudentQuestion function.
 * - AnalyzeStudentQuestionOutput - The return type for the analyzeStudentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentQuestionInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
  patientHistory: z.string().describe('The patient\'s medical history.'),
  currentVitals: z.string().describe('The patient\'s current vital signs.'),
});
export type AnalyzeStudentQuestionInput = z.infer<typeof AnalyzeStudentQuestionInputSchema>;

const AnalyzeStudentQuestionOutputSchema = z.object({
  responseStrategy: z.string().describe('The best strategy for responding to the question (e.g., provide information, ask clarifying questions, etc.).'),
  suggestedResponse: z.string().describe('A suggested response to the student\'s question.'),
});
export type AnalyzeStudentQuestionOutput = z.infer<typeof AnalyzeStudentQuestionOutputSchema>;

export async function analyzeStudentQuestion(input: AnalyzeStudentQuestionInput): Promise<AnalyzeStudentQuestionOutput> {
  return analyzeStudentQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentQuestionPrompt',
  input: {schema: AnalyzeStudentQuestionInputSchema},
  output: {schema: AnalyzeStudentQuestionOutputSchema},
  prompt: `You are a medical simulation expert, helping to train medical students. A student has asked a question about a virtual patient. Your goal is to determine the best way to respond to the question, considering the patient\'s history and current condition. 

Patient History: {{{patientHistory}}}

Current Vitals: {{{currentVitals}}}

Student Question: {{{question}}}

Consider the student\'s question and determine the most appropriate response strategy. This might involve providing direct information, asking clarifying questions to guide the student\'s thinking, or prompting the student to consider specific aspects of the patient\'s condition.

Based on your chosen strategy, provide a suggested response to the student\'s question.

Response Strategy: {{responseStrategy}}
Suggested Response: {{suggestedResponse}}`,
});

const analyzeStudentQuestionFlow = ai.defineFlow(
  {
    name: 'analyzeStudentQuestionFlow',
    inputSchema: AnalyzeStudentQuestionInputSchema,
    outputSchema: AnalyzeStudentQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
