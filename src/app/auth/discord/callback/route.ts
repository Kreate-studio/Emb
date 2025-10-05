
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=No code provided', request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Discord OAuth environment variables are not set.');
    return NextResponse.redirect(new URL('/login?error=Server configuration error.', request.url));
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
      return NextResponse.redirect(new URL(`/login?error=Failed to authenticate with Discord.`, request.url));
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
      return NextResponse.redirect(new URL('/login?error=Failed to fetch user information.', request.url));
    }

    const userData = await userResponse.json();

    // 3. TODO: Create a session for the user (e.g., set a cookie)

    // For now, just display success and user data.
    return new Response(
      `<h1>Login Successful!</h1>
       <p>Welcome, ${userData.username}#${userData.discriminator}</p>
       <p>Your User ID is: ${userData.id}</p>
       <pre>${JSON.stringify(userData, null, 2)}</pre>
       <a href="/">Go to Homepage</a>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );

  } catch (err) {
    console.error('Discord callback error:', err);
    return NextResponse.redirect(new URL('/login?error=An unexpected server error occurred.', request.url));
  }
}
