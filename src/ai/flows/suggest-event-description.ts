
'use server';
/**
 * @fileOverview A flow for generating event descriptions using an LLM.
 *
 * - getEventDescriptionSuggestion - A function that takes event details and suggests a description.
 * - GetEventDescriptionSuggestionInput - The input type for the function.
 * - GetEventDescriptionSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEventDescriptionSuggestionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
});
export type GetEventDescriptionSuggestionInput = z.infer<typeof GetEventDescriptionSuggestionInputSchema>;

const GetEventDescriptionSuggestionOutputSchema = z.object({
  suggestedDescription: z.string().describe('The LLM-generated suggested event description.'),
});
export type GetEventDescriptionSuggestionOutput = z.infer<typeof GetEventDescriptionSuggestionOutputSchema>;

export async function getEventDescriptionSuggestion(input: GetEventDescriptionSuggestionInput): Promise<GetEventDescriptionSuggestionOutput> {
  return getEventDescriptionSuggestionFlow(input);
}

const descriptionSuggestionPrompt = ai.definePrompt({
  name: 'eventDescriptionSuggestionPrompt',
  input: {schema: GetEventDescriptionSuggestionInputSchema},
  output: {schema: GetEventDescriptionSuggestionOutputSchema},
  prompt: `You are an assistant for an Islamic organization. Your task is to generate a compelling and concise event description.

  Event Title: {{{title}}}

  Please provide a suggested description that is engaging and relevant to a Muslim audience.`,
});

const getEventDescriptionSuggestionFlow = ai.defineFlow(
  {
    name: 'getEventDescriptionSuggestionFlow',
    inputSchema: GetEventDescriptionSuggestionInputSchema,
    outputSchema: GetEventDescriptionSuggestionOutputSchema,
  },
  async input => {
    const {output} = await descriptionSuggestionPrompt(input);
    return output!;
  }
);
