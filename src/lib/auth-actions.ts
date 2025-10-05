
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionOptions, type SessionUser } from '@/lib/auth';


// This function is for Server Components, Server Actions, and Route Handlers
async function getSessionFromCookies() {
    return getIronSession(cookies(), sessionOptions);
}

export async function getSession(): Promise<SessionUser | null> {
    const session = await getSessionFromCookies();
    if (!session.user) {
        return null;
    }
    return session.user;
}

export async function setSession(user: SessionUser): Promise<void> {
    const session = await getSessionFromCookies();
    session.user = user;
    await session.save();
}

export async function clearSession(): Promise<void> {
    const session = await getSessionFromCookies();
    session.destroy();
}

export async function handleLogout() {
  await clearSession();
  redirect('/');
}
