
'use server';

import { unstable_noStore as noStore } from 'next/cache';

const API_URL = process.env.ECONOMY_API_URL;
const API_SECRET = process.env.ECONOMY_API_SECRET;

const GENERIC_CONFIG_ERROR = "Economy API not configured.";

interface EconomyItem {
    name: string;
    quantity: number;
}

export interface EconomyProfile {
    userId: string;
    username: string;
    avatar: string;
    wallet: number;
    bank: number;
    gold: number;
    inventory: EconomyItem[];
}

export async function getEconomyProfile(userId: string): Promise<{ profile: EconomyProfile | null, error: string | null }> {
    noStore();
    if (!API_URL || !API_SECRET) {
        console.error("Economy API environment variables are not set.");
        return { profile: null, error: GENERIC_CONFIG_ERROR };
    }
    
    if (!userId) {
        return { profile: null, error: "User ID not provided." };
    }

    try {
        const response = await fetch(`${API_URL}/api/profile/${userId}`, {
            method: 'GET',
            headers: {
                'X-API-Secret': API_SECRET,
                'Content-Type': 'application/json',
            },
            next: { revalidate: 15 } // Cache for 15 seconds
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { profile: null, error: 'Economy profile not found for this user.' };
            }
            const errorText = await response.text();
            console.error(`Economy API Error (${response.status}): ${errorText}`);
            return { profile: null, error: `Failed to fetch economy profile: ${response.statusText}` };
        }

        const data: EconomyProfile = await response.json();
        return { profile: data, error: null };

    } catch (err) {
        console.error(`Error fetching economy profile for ${userId}:`, err);
        return { profile: null, error: 'An unexpected error occurred while fetching economy data.' };
    }
}

export async function runEconomyCommand(userId: string, command: string, args: string[] = []): Promise<{ message: string | null, error: string | null }> {
    noStore();
    if (!API_URL || !API_SECRET) {
        console.error("Economy API environment variables are not set.");
        return { message: null, error: GENERIC_CONFIG_ERROR };
    }
    
    if (!userId || !command) {
        return { message: null, error: "User ID or command not provided." };
    }

    try {
        const response = await fetch(`${API_URL}/api/command`, {
            method: 'POST',
            headers: {
                'X-API-Secret': API_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, command, args }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`Economy Command API Error (${response.status}):`, responseData);
            return { message: null, error: responseData.error || `Command failed with status: ${response.statusText}` };
        }
        
        return { message: responseData.message, error: null };

    } catch (err) {
        console.error(`Error running economy command '${command}' for ${userId}:`, err);
        return { message: null, error: 'An unexpected error occurred while running the command.' };
    }
}
