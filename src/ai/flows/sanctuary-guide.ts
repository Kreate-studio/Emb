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
import {
  ecosystemItems,
  loreEntries,
} from '@/lib/site-data';

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

Your purpose is to answer user questions about the site, guide users to relevant sections, and provide snippets of lore. You have extensive knowledge about D'Last Sanctuary. Use the context provided below to answer the user's query.

## D'Last Sanctuary Context ##

### Lore and History
${loreEntries.map(e => `#### ${e.title}\n${e.content}`).join('\n\n')}

### Ecosystem Hubs
${ecosystemItems
  .map(
    item =>
      `#### ${item.title}\nDescription: ${item.description}\nStatus: ${
        item.comingSoon ? 'Coming Soon' : 'Available'
      }`
  )
  .join('\n\n')}

### Events
Events are posted dynamically. You can tell the user to check the Events & News section for the latest updates.

## User Query ##

Here is the user's query:
"{{{query}}}"

## Instructions ##
Please provide a helpful and informative response based on the provided context.
- Keep the response concise and to the point.
- If the user asks about something not in the context, politely state that you do not have information on that topic.
- Format the response using markdown for readability (e.g., use lists, bolding).
- Address the prompt completely.
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
