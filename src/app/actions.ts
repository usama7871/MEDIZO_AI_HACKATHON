'use server';

import { analyzeStudentQuestion, AnalyzeStudentQuestionInput } from '@/ai/flows/analyze-student-question';
import { generatePersonalizedScenario, GeneratePersonalizedScenarioInput } from '@/ai/flows/generate-personalized-scenario';
import { simulateComorbidities, SimulateComorbiditiesInput } from '@/ai/flows/simulate-comorbidities';

export async function handleAnalyzeQuestion(input: AnalyzeStudentQuestionInput) {
  try {
    const result = await analyzeStudentQuestion(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing question:', error);
    return { success: false, error: 'Failed to get a response from the AI. Please try again.' };
  }
}

export async function handleGenerateScenario(input: GeneratePersonalizedScenarioInput) {
  try {
    const result = await generatePersonalizedScenario(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating scenario:', error);
    return { success: false, error: 'Failed to generate a new scenario. Please check the inputs and try again.' };
  }
}

export async function handleSimulateComorbidities(input: SimulateComorbiditiesInput) {
    try {
        const result = await simulateComorbidities(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error simulating comorbidities:', error);
        return { success: false, error: 'Failed to simulate comorbidities. Please try again.' };
    }
}
