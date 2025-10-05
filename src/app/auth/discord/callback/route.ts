
import { type NextRequest, NextResponse } from 'next/server';
import { setSession, type SessionUser } from '@/lib/auth-actions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const loginUrl = new URL('/login', appUrl);


  if (error) {
    loginUrl.searchParams.set('error', error);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    loginUrl.searchParams.set('error', 'No code provided');
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Discord OAuth environment variables are not set.');
    loginUrl.searchParams.set('error', 'Server configuration error');
    return NextResponse.redirect(loginUrl);
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  try {
    // 1. Exchange authorization code for an access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.json();
      console.error('Failed to exchange code for token:', errorBody);
      loginUrl.searchParams.set('error', 'Failed to authenticate with Discord');
      return NextResponse.redirect(loginUrl);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, token_type } = tokenData;

    // 2. Use the access token to get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user info from Discord.');
      loginUrl.searchParams.set('error', 'Failed to fetch user information');
      return NextResponse.redirect(loginUrl);
    }

    const userData = await userResponse.json();
    const sessionUser: SessionUser = {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
    }

    // 3. Create a session for the user
    await setSession(sessionUser);
    
    // 4. Redirect to the homepage
    return NextResponse.redirect(new URL('/', appUrl));

  } catch (err) {
    console.error('Discord callback error:', err);
    loginUrl.searchParams.set('error', 'An unexpected server error occurred');
    return NextResponse.redirect(loginUrl);
  }
}
