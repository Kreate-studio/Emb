
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

  // In the next step, we will exchange this code for an access token.
  // For now, let's just display it.
  
  return new Response(`<h1>Discord Login Successful!</h1><p>Your authorization code is: <strong>${code}</strong></p><p>Next step: Exchange this code for an access token.</p>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
