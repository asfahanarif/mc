
'use server';
/**
 * @fileOverview A flow for generating team member bios using an LLM.
 *
 * - getTeamMemberBioSuggestion - A function that suggests a bio for a team member.
 * - GetTeamMemberBioSuggestionInput - The input type for the function.
 * - GetTeamMemberBioSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTeamMemberBioSuggestionInputSchema = z.object({
  name: z.string().describe("The team member's name."),
  title: z.string().describe("The team member's title or role."),
});
export type GetTeamMemberBioSuggestionInput = z.infer<typeof GetTeamMemberBioSuggestionInputSchema>;

const GetTeamMemberBioSuggestionOutputSchema = z.object({
  suggestedBio: z.string().describe('The LLM-generated suggested biography.'),
});
export type GetTeamMemberBioSuggestionOutput = z.infer<typeof GetTeamMemberBioSuggestionOutputSchema>;

export async function getTeamMemberBioSuggestion(input: GetTeamMemberBioSuggestionInput): Promise<GetTeamMemberBioSuggestionOutput> {
  return getTeamMemberBioSuggestionFlow(input);
}

const bioSuggestionPrompt = ai.definePrompt({
  name: 'teamMemberBioSuggestionPrompt',
  input: {schema: GetTeamMemberBioSuggestionInputSchema},
  output: {schema: GetTeamMemberBioSuggestionOutputSchema},
  prompt: `You are an assistant for an Islamic organization. Generate a short, professional, and positive bio for a team member.

  Name: {{{name}}}
  Title: {{{title}}}

  Please provide a suggested bio (around 20-30 words).`,
});

const getTeamMemberBioSuggestionFlow = ai.defineFlow(
  {
    name: 'getTeamMemberBioSuggestionFlow',
    inputSchema: GetTeamMemberBioSuggestionInputSchema,
    outputSchema: GetTeamMemberBioSuggestionOutputSchema,
  },
  async input => {
    const {output} = await bioSuggestionPrompt(input);
    return output!;
  }
);
