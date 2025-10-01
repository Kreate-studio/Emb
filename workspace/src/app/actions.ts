'use server';

import {
  askSanctuaryGuide,
  type SanctuaryGuideInput,
} from '@/ai/flows/sanctuary-guide';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { headers } from 'next/headers';
import {unstable_noStore as noStore} from 'next/cache';
import { sendMessageToChannel } from '@/lib/discord-service';

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

const partnershipSchema = z.object({
  serverName: z.string().min(2, { message: "Server name must be at least 2 characters."}),
  discordUsername: z.string().min(2, { message: "Username must be at least 2 characters."}),
  serverLink: z.string().url({ message: "Please enter a valid Discord invite link."}),
});

export async function handlePartnershipRequest(
  prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const validatedFields = partnershipSchema.safeParse({
    serverName: formData.get('server-name'),
    discordUsername: formData.get('discord-username'),
    serverLink: formData.get('server-link'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: errors.serverName?.[0] || errors.discordUsername?.[0] || errors.serverLink?.[0] || 'Invalid input.',
      error: true,
    };
  }

  const { serverName, discordUsername, serverLink } = validatedFields.data;
  const channelId = process.env.DISCORD_PARTNERS_CHANNEL_ID;

  if (!channelId) {
    console.error("DISCORD_PARTNERS_CHANNEL_ID is not set.");
    return { message: "Server configuration error. Could not submit request.", error: true };
  }

  try {
    const message = `**New Partnership Request**\n\n**Server Name:** ${serverName}\n**Requester's Username:** ${discordUsername}\n**Invite Link:** ${serverLink}`;
    const { error } = await sendMessageToChannel(channelId, message);

    if (error) {
      console.error("Failed to send partnership request to Discord:", error);
      return { message: "Could not send request to the council. Please try again later.", error: true };
    }

    return { message: "Your partnership request has been sent to the High Council for review!" };
  } catch (err) {
    console.error("Partnership request submission error:", err);
    return { message: "An unexpected error occurred. Please try again later.", error: true };
  }
}


const querySchema = z.object({
  query: z.string().min(1, 'Query cannot be empty.'),
});

type AIState = {
  response?: string | null;
  error?: string | null;
};

const ratelimit = kv && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN ? new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
}) : null;

export async function getAIResponse(query: string): Promise<AIState> {
  // Rate limiting disabled for development to avoid intermittent failures.
  // if (ratelimit) {
  //   const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  //   const { success } = await ratelimit.limit(ip);
  //
  //   if (!success) {
  //     return {
  //       error: 'You have reached the request limit. Please try again in a minute.',
  //     };
  //   }
  // }


  const validatedFields = querySchema.safeParse({ query });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.[0],
    };
  }

  try {
    const input: SanctuaryGuideInput = { query: validatedFields.data.query };
    const result = await askSanctuaryGuide(input);
    return { response: result.response };
  } catch (error) {
    console.error('AI response error:', error);
    return {
      error: 'The sanctuary is silent... The AI assistant is currently unavailable.',
    };
  }
}

export async function getTenorGifUrl(url: string) {
    noStore();
    if (!url.startsWith('https://tenor.com/')) {
        return { url: null, error: 'Invalid Tenor URL' };
    }
    
    // Some tenor URLs don't end in the GIF ID, but have it in the path
    // e.g. https://tenor.com/view/a-b-c-d-12345
    // or https://tenor.com/bDERd/fun.gif
    // The redirect logic handles both cases.
    
    try {
        const fetchUrl = url.endsWith('.gif') ? url : `${url}.gif`;
        const response = await fetch(fetchUrl, {
            method: 'HEAD', // We only need the headers to find the redirect
            redirect: 'manual', // We handle the redirect manually
        });
        
        const finalUrl = response.headers.get('location');
        
        if (finalUrl) {
            return { url: finalUrl };
        }
        
        // If there's no redirect, it might be the direct URL already, though unlikely for base tenor links
        if (response.status >= 200 && response.status < 300) {
             return { url: fetchUrl };
        }

        return { url: null, error: 'Could not find GIF URL' };
    } catch (error) {
        console.error('Failed to get Tenor GIF URL:', error);
        return { url: null, error: 'Failed to fetch Tenor GIF' };
    }
}
