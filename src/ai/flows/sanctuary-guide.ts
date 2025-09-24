'use server';

/**
 * @fileOverview AI-powered guide for the D'Last Sanctuary website.
 *
 * - askSanctuaryGuide - A function that processes user queries and provides responses.
 * - SanctuaryGuideInput - The input type for the askSanctuaryGuide function.
 * - SanctuaryGuideOutput - The return type for the askSanctuaryGuide function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const SanctuaryGuideInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type SanctuaryGuideInput = z.infer<typeof SanctuaryGuideInputSchema>;

const SanctuaryGuideOutputSchema = z.object({
  response: z
    .string()
    .describe('The response to the user query, formatted in markdown.'),
});
export type SanctuaryGuideOutput = z.infer<typeof SanctuaryGuideOutputSchema>;

export async function askSanctuaryGuide(
  input: SanctuaryGuideInput
): Promise<SanctuaryGuideOutput> {
  return sanctuaryGuideFlow(input);
}

const sanctuaryGuidePrompt = ai.definePrompt({
  name: 'sanctuaryGuidePrompt',
  input: {schema: SanctuaryGuideInputSchema},
  output: {schema: SanctuaryGuideOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an AI-powered guide for the D’Last Sanctuary (DLS) website. Your name is the "Sanctuary Guide".

Your purpose is to answer user questions about the site, guide users to relevant sections, and provide snippets of lore. You have extensive knowledge about D'Last Sanctuary.

Here is the user's query:
"{{{query}}}"

Please provide a helpful and informative response.
- Keep the response concise and to the point.
- Address the prompt completely.
- Format the response using markdown for readability.
`,
});

const sanctuaryGuideFlow = ai.defineFlow(
  {
    name: 'sanctuaryGuideFlow',
    inputSchema: SanctuaryGuideInputSchema,
    outputSchema: SanctuaryGuideOutputSchema,
  },
  async input => {
    const {output} = await sanctuaryGuidePrompt(input);
    if (!output) {
      throw new Error('The AI flow failed to produce an output.');
    }
    return output;
  }
);
