'use server';
import { cookies } from 'next/headers';

export async function refreshAccessTokenFromApi() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('transeu_refresh_token');
    console.log(refreshToken)
    if (!refreshToken) {
        console.error("No refresh token found");
        return null;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/transeu/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `transeu_refresh_token=${refreshToken.value}`,
        },
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("API route refresh-token failed");
        return null;
    }

    const data = await res.json();
    
    // Set the new refresh token in cookies
    const newRefreshToken = res.headers.get('set-cookie');
    if (newRefreshToken) {
        const cookieStore = await cookies();
        cookieStore.set('transeu_refresh_token', newRefreshToken.split('=')[1].split(';')[0], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
    }

    return {
        accessToken: data.access_token,
        refreshToken: newRefreshToken
    };
}
