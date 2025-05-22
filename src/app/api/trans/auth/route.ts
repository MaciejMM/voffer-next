import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { deleteAccessToken, saveAccessToken } from '@/lib/tokenStore';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
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

    const tokenId = randomUUID(); 
    await saveAccessToken(tokenId, access_token); 

    const cookieStore = await cookies();

    cookieStore
      .set('trans_token_id', tokenId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    }).set('trans_refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });


    return NextResponse.json({ access_token, expires_in, token_type, scope });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT() {
    const cookieStore = await cookies();
    const tokenIdCookie = cookieStore.get('trans_refresh_token');
    const oldTokenId = cookieStore.get('trans_token_id');
    if (!tokenIdCookie || !oldTokenId) {
      return NextResponse.json({ error: 'No token id found' }, { status: 401 });
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
        refresh_token: tokenIdCookie.value,
        client_id: client_id,
        client_secret: client_secret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If refresh token is invalid/expired, clear it from cookies
      return NextResponse.json({ error: 'Failed to refresh token', details: errorData }, { status: response.status });
    }
    
    const data = await response.json();
    const { access_token, expires_in, token_type, refresh_token: new_refresh_token } = data;

    await deleteAccessToken(oldTokenId.value);
    const newTokenId = randomUUID(); // Unikalny ID
    await saveAccessToken(newTokenId, access_token); // Zapisz token w store
    // Set the new access token in the response
    const responseWithToken = NextResponse.json({
      access_token,
      expires_in,
      token_type
    });

    // If we got a new refresh token, update it in cookies
    if (new_refresh_token) {
      responseWithToken.cookies
      .set('trans_token_id', newTokenId, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })
      .set('trans_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return responseWithToken;
}
