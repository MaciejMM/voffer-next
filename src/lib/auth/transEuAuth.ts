import { cookies } from 'next/headers';

const TRANS_EU_AUTH_URL = 'https://auth.platform.trans.eu/oauth2/auth';
const TRANS_EU_CLIENT_ID = process.env.TRANS_CLIENT_ID!;
const TRANS_EU_REDIRECT_URI = process.env.TRANS_REDIRECT_URI!;

export async function generateTransEuAuthUrl() {
    if (!TRANS_EU_CLIENT_ID || !TRANS_EU_REDIRECT_URI) {
        throw new Error('Missing required environment variables for Trans.eu authentication');
    }
    // random_number should be atleast 8 characters long
    const random_number = Math.random().toString(36).substring(2, 15);

    const params = new URLSearchParams({
        client_id: TRANS_EU_CLIENT_ID,
        response_type: 'code',
        state: 'random_number',
        redirect_uri: TRANS_EU_REDIRECT_URI
    });

    return `${TRANS_EU_AUTH_URL}?${params.toString()}`;
}
