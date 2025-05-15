'use client';

export async function refreshTranseuAccessToken() {
    try {
        const response = await fetch('/api/trans/auth', {
            method: "PUT",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        
        if (data.access_token) {
            sessionStorage.setItem("transeuAccessToken", data.access_token);
        }

        return data.access_token;
    } catch (err) {
        console.error("Error refreshing access token", err);
        return null;
    }
}

export async function getTranseuAccessToken(code: string): Promise<string> {
    try {
        const response = await fetch('/api/trans/auth', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_TRANS_REDIRECT_URI
            }),
        });

        if (!response.ok) {
            console.log("Failed to get TRANS.EU token");
            throw new Error("Failed to get token");
        }

        const data = await response.json();
        
        if (data.access_token) {
            sessionStorage.setItem("transeuAccessToken", data.access_token);
        }

        return data.access_token || "";

    } catch (err) {
        console.error("Error getting access token", err);
        return "";
    }
}
