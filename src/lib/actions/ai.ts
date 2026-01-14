
'use server';
/**
 * @fileOverview Server actions for AI-powered suggestions.
 * This file contains server-side functions that invoke Genkit flows
 * to provide AI-generated content for various parts of the application.
 * These actions are designed to be called from client components.
 */

import {
  getEventDescriptionSuggestion as getEventDescriptionSuggestionFlow,
  type GetEventDescriptionSuggestionInput,
  type GetEventDescriptionSuggestionOutput,
} from '@/ai/flows/suggest-event-description';

import {
  getTeamMemberBioSuggestion as getTeamMemberBioSuggestionFlow,
  type GetTeamMemberBioSuggestionInput,
  type GetTeamMemberBioSuggestionOutput,
} from '@/ai/flows/suggest-team-member-bio';

import {
  getTestimonialContentSuggestion as getTestimonialContentSuggestionFlow,
  type GetTestimonialContentSuggestionInput,
  type GetTestimonialContentSuggestionOutput,
} from '@/ai/flows/suggest-testimonial-content';

import {
  getAnswerSuggestion as getAnswerSuggestionFlow,
  type GetAnswerSuggestionInput,
  type GetAnswerSuggestionOutput,
} from '@/ai/flows/admin-assisted-q-and-a';

/**
 * Gets an AI-generated event description suggestion.
 * @param input - The input containing the event title.
 * @returns The suggested event description.
 */
export async function getEventDescriptionSuggestion(
  input: GetEventDescriptionSuggestionInput
): Promise<GetEventDescriptionSuggestionOutput> {
  return await getEventDescriptionSuggestionFlow(input);
}

/**
 * Gets an AI-generated team member bio suggestion.
 * @param input - The input containing the team member's name and title.
 * @returns The suggested biography.
 */
export async function getTeamMemberBioSuggestion(
  input: GetTeamMemberBioSuggestionInput
): Promise<GetTeamMemberBioSuggestionOutput> {
  return await getTeamMemberBioSuggestionFlow(input);
}

/**
 * Gets an AI-generated testimonial content suggestion.
 * @param input - The input containing the author's name.
 * @returns The suggested testimonial content.
 */
export async function getTestimonialContentSuggestion(
  input: GetTestimonialContentSuggestionInput
): Promise<GetTestimonialContentSuggestionOutput> {
  return await getTestimonialContentSuggestionFlow(input);
}

/**
 * Gets an AI-generated answer suggestion for a forum question.
 * @param input - The input containing the user's question.
 * @returns The suggested answer.
 */
export async function getAnswerSuggestion(
  input: GetAnswerSuggestionInput
): Promise<GetAnswerSuggestionOutput> {
  return await getAnswerSuggestionFlow(input);
}

    