'use server';

export async function refreshAccessTokenFromApi() {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/trans/auth`, {
        method: 'PUT',
        credentials: 'include',
    });

    if (!res.ok) {
        return null;
    }

    return await res.json();
}
