import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, redirect_uri } = body;

  if (!code || !redirect_uri) {
    return NextResponse.json({ error: 'Missing code or redirect_uri' }, { status: 400 });
  }

  const grant_type = 'authorization_code';
  const client_id = process.env.TRANS_CLIENT_ID;
  const client_secret = process.env.TRANS_CLIENT_SECRET;
  const api_key = process.env.TRANS_API_KEY;

  if (!client_id || !client_secret || !api_key) {
    return NextResponse.json({ error: 'Missing Trans.eu API credentials in environment variables' }, { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', grant_type);
  params.append('code', code as string);
  params.append('redirect_uri', "https%3A%2F%2Fvoffer-d18ce4ed1b53.herokuapp.com" as string);
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
      cookieStore.set('transeu_refresh_token', refresh_token, {
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

export async function PUT() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('transeu_refresh_token');

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    const client_id = process.env.TRANS_CLIENT_ID;
    const client_secret = process.env.TRANS_CLIENT_SECRET;
    const api_key = process.env.TRANS_API_KEY;

    if (!client_id || !client_secret || !api_key) {
      return NextResponse.json({ error: 'Missing Trans.eu API credentials in environment variables' }, { status: 500 });
    }

    const response = await fetch('https://api.platform.trans.eu/ext/auth-api/accounts/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-key': api_key,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value,
        client_id: client_id,
        client_secret: client_secret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If refresh token is invalid/expired, clear it from cookies
      if (response.status === 400 || response.status === 401) {
        cookieStore.delete('transeu_refresh_token');
      }
      return NextResponse.json({ error: 'Failed to refresh token', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const { access_token, expires_in, token_type, refresh_token: new_refresh_token } = data;

    // Set the new access token in the response
    const responseWithToken = NextResponse.json({ 
      access_token,
      expires_in,
      token_type
    });

    // If we got a new refresh token, update it in cookies
    if (new_refresh_token) {
      responseWithToken.cookies.set('transeu_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return responseWithToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 