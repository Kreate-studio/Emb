
import { cookies } from 'next/headers';
import { getIronSession, type IronSessionConfig } from 'iron-session';

const password = process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_dev';
if (process.env.NODE_ENV === 'production' && password === 'complex_password_at_least_32_characters_long_for_dev') {
  console.error('SESSION_SECRET is not set in production. Please set a strong, secret value.');
}

export type SessionUser = {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
};

// Augment the IronSession data type
declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser;
  }
}

const sessionOptions: IronSessionConfig = {
    password: password,
    cookieName: 'dls_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

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
