
'use server';

import {
  discordBotIntegration,
  type DiscordBotIntegrationInput,
} from '@/ai/flows/discord-bot-integration';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { headers } from 'next/headers';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type NewsletterState = {
  message: string;
  error?: boolean;
};

export async function handleNewsletterSignup(
  prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const validatedFields = emailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid input.',
      error: true,
    };
  }

  try {
    // In a real app, you would save the email to a database or mailing list service.
    console.log(`New newsletter signup: ${validatedFields.data.email}`);

    return {
      message: 'Thank you for joining the realm! You will be notified of updates.',
    };
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
      error: true,
    };
  }
}

const querySchema = z.object({
  query: z.string().min(1, 'Query cannot be empty.'),
});

type AIState = {
  response?: string | null;
  error?: string | null;
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});

export async function getAIResponse(query: string): Promise<AIState> {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return {
      error: 'You have reached the request limit. Please try again in a minute.',
    };
  }

  const validatedFields = querySchema.safeParse({ query });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.[0],
    };
  }

  try {
    const input: DiscordBotIntegrationInput = { query: validatedFields.data.query };
    const result = await discordBotIntegration(input);
    return { response: result.response };
  } catch (error) {
    console.error('AI response error:', error);
    return {
      error: 'The sanctuary is silent... The AI assistant is currently unavailable.',
    };
  }
}
