import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, redirect_uri } = body;

  if (!code || !redirect_uri) {
    return NextResponse.json({ error: 'Missing code or redirect_uri' }, { status: 400 });
  }

  const grant_type = 'authorization_code';
  const client_id = process.env.NEXT_PUBLIC_TRANS_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_TRANS_CLIENT_SECRET;
  const api_key = process.env.NEXT_PUBLIC_TRANS_API_KEY;

  if (!client_id || !client_secret || !api_key) {
    return NextResponse.json({ error: 'Missing Trans.eu API credentials in environment variables' }, { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', grant_type);
  params.append('code', code as string);
  params.append('redirect_uri', redirect_uri as string);
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);

  try {
    const response = await fetch('https://api.platform.trans.eu/ext/auth-api/accounts/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-key': api_key,
      },
      body: params,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Failed to fetch access token', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const { access_token, expires_in, token_type, scope, refresh_token } = data;

    if (refresh_token) {
      const cookieStore = await cookies();
      cookieStore.set('trans_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return NextResponse.json({ access_token, expires_in, token_type, scope });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const existing_refresh_token = cookieStore.get('trans_refresh_token')?.value;

  if (!existing_refresh_token) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 });
  }

  const grant_type = 'refresh_token';
  const client_id = process.env.TRANS_CLIENT_ID;
  const client_secret = process.env.TRANS_CLIENT_SECRET;
  const api_key = process.env.TRANS_API_KEY;

  if (!client_id || !client_secret || !api_key) {
    return NextResponse.json({ error: 'Missing Trans.eu API credentials in environment variables' }, { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', grant_type);
  params.append('refresh_token', existing_refresh_token);
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);

  try {
    const response = await fetch('https://api.platform.trans.eu/ext/auth-api/accounts/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-key': api_key,
      },
      body: params,
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If refresh token is invalid/expired, clear it from cookies
      if (response.status === 400 || response.status === 401) {
        cookieStore.delete('trans_refresh_token');
      }
      return NextResponse.json({ error: 'Failed to refresh access token', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const { access_token, expires_in, token_type, refresh_token: new_refresh_token } = data;

    if (new_refresh_token) {
      cookieStore.set('trans_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    } else {
      // If the response doesn't include a new refresh token, but the request was successful,
      // it might mean the old refresh token is still valid and reusable.
      // Or, it might mean we should clear the old one if it's single-use and no new one is provided.
      // The documentation for Trans.eu states: "refresh_token: Single serving token that can be used to extend lifetime of access token."
      // This implies a new refresh token should always be issued. If not, it's safer to clear the old one to prevent issues.
      // However, to be certain, one would need to test or consult Trans.eu documentation on refresh token rotation.
      // For now, let's assume if a new one isn't provided on a 200 OK, the old one might have been consumed or is invalid.
      // Clearing it defensively.
        cookieStore.delete('trans_refresh_token');
    }
    

    return NextResponse.json({ access_token, expires_in, token_type });
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 