'use client';
export async function refreshTranseuAccessToken() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/transeu/refresh-token`, {
            method: "POST",
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

export async function getTranseuAccessToken(code:string): Promise<string> {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/transeu/token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
            }),
        });

        if (!response.ok) {
            console.log("Failed to refresh TRANS.EU token");
        }
        return await response.json();

    } catch (err) {
        console.error("Error refreshing access token", err);
        return "";
    }
}
