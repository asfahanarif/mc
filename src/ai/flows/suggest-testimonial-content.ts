
'use server';
/**
 * @fileOverview A flow for generating testimonial content using an LLM.
 *
 * - getTestimonialContentSuggestion - A function that suggests content for a testimonial.
 * - GetTestimonialContentSuggestionInput - The input type for the function.
 * - GetTestimonialContentSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTestimonialContentSuggestionInputSchema = z.object({
  authorName: z.string().describe("The author's name."),
});
export type GetTestimonialContentSuggestionInput = z.infer<typeof GetTestimonialContentSuggestionInputSchema>;

const GetTestimonialContentSuggestionOutputSchema = z.object({
  suggestedContent: z.string().describe('The LLM-generated suggested testimonial content.'),
});
export type GetTestimonialContentSuggestionOutput = z.infer<typeof GetTestimonialContentSuggestionOutputSchema>;

export async function getTestimonialContentSuggestion(input: GetTestimonialContentSuggestionInput): Promise<GetTestimonialContentSuggestionOutput> {
  return getTestimonialContentSuggestionFlow(input);
}

const contentSuggestionPrompt = ai.definePrompt({
  name: 'testimonialContentSuggestionPrompt',
  input: {schema: GetTestimonialContentSuggestionInputSchema},
  output: {schema: GetTestimonialContentSuggestionOutputSchema},
  prompt: `You are an assistant for an Islamic organization's website. Generate a short, positive, and authentic-sounding testimonial from a member.

  Author's Name: {{{authorName}}}

  Please provide a suggested testimonial content (around 20-30 words) expressing appreciation for the community, events, or resources.`,
});

const getTestimonialContentSuggestionFlow = ai.defineFlow(
  {
    name: 'getTestimonialContentSuggestionFlow',
    inputSchema: GetTestimonialContentSuggestionInputSchema,
    outputSchema: GetTestimonialContentSuggestionOutputSchema,
  },
  async input => {
    const {output} = await contentSuggestionPrompt(input);
    return output!;
  }
);
