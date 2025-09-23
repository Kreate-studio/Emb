'use server';

/**
 * @fileOverview AI-powered Discord bot integration for the website.
 *
 * - discordBotIntegration - A function that processes user queries and provides responses.
 * - DiscordBotIntegrationInput - The input type for the discordBotIntegration function.
 * - DiscordBotIntegrationOutput - The return type for the discordBotIntegration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscordBotIntegrationInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type DiscordBotIntegrationInput = z.infer<typeof DiscordBotIntegrationInputSchema>;

const DiscordBotIntegrationOutputSchema = z.object({
  response: z.string().describe('The response to the user query.'),
});
export type DiscordBotIntegrationOutput = z.infer<typeof DiscordBotIntegrationOutputSchema>;

export async function discordBotIntegration(input: DiscordBotIntegrationInput): Promise<DiscordBotIntegrationOutput> {
  return discordBotIntegrationFlow(input);
}

const discordBotIntegrationPrompt = ai.definePrompt({
  name: 'discordBotIntegrationPrompt',
  input: {schema: DiscordBotIntegrationInputSchema},
  output: {schema: DiscordBotIntegrationOutputSchema},
  prompt: `You are an AI-powered Discord bot integrated into the D’Last Sanctuary (DLS) website.

  Your purpose is to answer user questions about the site, guide users to relevant sections, and provide lore snippets.
  You have extensive control and access over almost any topic, but only use that access when reasoning allows it to improve the answer or guide the user's experience.

  Here is the user's query: {{{query}}}

  Please provide a helpful and informative response.  Keep the response concise and to the point, but make sure it addresses the prompt completely.
  Format the response using markdown.
`,
});

const discordBotIntegrationFlow = ai.defineFlow(
  {
    name: 'discordBotIntegrationFlow',
    inputSchema: DiscordBotIntegrationInputSchema,
    outputSchema: DiscordBotIntegrationOutputSchema,
  },
  async input => {
    const {output} = await discordBotIntegrationPrompt(input);
    return output!;
  }
);
