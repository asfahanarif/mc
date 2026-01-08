'use server';
/**
 * @fileOverview A flow for assisting admins in answering user questions using an LLM.
 *
 * - getAnswerSuggestion - A function that takes a user question and provides an answer suggestion.
 * - GetAnswerSuggestionInput - The input type for the getAnswerSuggestion function.
 * - GetAnswerSuggestionOutput - The return type for the getAnswerSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAnswerSuggestionInputSchema = z.object({
  question: z.string().describe('The user question to be answered.'),
});
export type GetAnswerSuggestionInput = z.infer<typeof GetAnswerSuggestionInputSchema>;

const GetAnswerSuggestionOutputSchema = z.object({
  suggestedAnswer: z.string().describe('The LLM-generated suggested answer to the question.'),
});
export type GetAnswerSuggestionOutput = z.infer<typeof GetAnswerSuggestionOutputSchema>;

export async function getAnswerSuggestion(input: GetAnswerSuggestionInput): Promise<GetAnswerSuggestionOutput> {
  return getAnswerSuggestionFlow(input);
}

const answerSuggestionPrompt = ai.definePrompt({
  name: 'answerSuggestionPrompt',
  input: {schema: GetAnswerSuggestionInputSchema},
  output: {schema: GetAnswerSuggestionOutputSchema},
  prompt: `You are an assistant helping admins answer user questions.

  Please provide a helpful and relevant answer to the following question:

  Question: {{{question}}}

  Answer:`,
});

const getAnswerSuggestionFlow = ai.defineFlow(
  {
    name: 'getAnswerSuggestionFlow',
    inputSchema: GetAnswerSuggestionInputSchema,
    outputSchema: GetAnswerSuggestionOutputSchema,
  },
  async input => {
    const {output} = await answerSuggestionPrompt(input);
    return output!;
  }
);
