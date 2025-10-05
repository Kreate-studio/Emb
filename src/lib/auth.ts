
import type { IronSessionConfig } from 'iron-session';

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

const password = process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_dev';
if (process.env.NODE_ENV === 'production' && password === 'complex_password_at_least_32_characters_long_for_dev') {
  console.error('SESSION_SECRET is not set in production. Please set a strong, secret value.');
}


export const sessionOptions: IronSessionConfig = {
    password: password,
    cookieName: 'dls_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};
