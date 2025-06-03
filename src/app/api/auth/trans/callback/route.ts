import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TRANS_EU_TOKEN_URL = 'https://auth.platform.trans.eu/oauth2/token';
const TRANS_EU_CLIENT_ID = process.env.TRANS_CLIENT_ID;
const TRANS_EU_CLIENT_SECRET = process.env.TRANS_CLIENT_SECRET;
const TRANS_EU_REDIRECT_URI = process.env.TRANS_REDIRECT_URI;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                { error: 'Missing code parameter' },
                { status: 400 }
            );
        }

        // Exchange code for access token
        const tokenResponse = await fetch(TRANS_EU_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: TRANS_EU_REDIRECT_URI!,
                client_id: TRANS_EU_CLIENT_ID!,
                client_secret: TRANS_EU_CLIENT_SECRET!,
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.json();
            console.error('Token exchange failed:', error);
            return NextResponse.json(
                { error: 'Failed to exchange code for token' },
                { status: 500 }
            );
        }

        const tokenData = await tokenResponse.json();
        const cookieStore = await cookies();

        // Store the access token in an HTTP-only cookie
        cookieStore.set('trans_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: tokenData.expires_in || 3600, // Use token expiry or default to 1 hour
        });

        // Store refresh token if provided
        if (tokenData.refresh_token) {
            cookieStore.set('trans_refresh_token', tokenData.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            });
        }

        // Redirect to dashboard with success message
        return NextResponse.redirect(new URL('/dashboard?auth=success', request.url));
    } catch (error) {
        console.error('Error in Trans.eu callback:', error);
        return NextResponse.redirect(new URL('/dashboard?auth=error', request.url));
    }
} 