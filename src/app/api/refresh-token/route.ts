import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const cookieHeader = request.headers.get('cookie') ?? '';
    console.log(cookieHeader);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/transeu/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cookie": cookieHeader,
            },
        });

        if (!response.ok) {
            console.error("Failed to refresh token");
            return NextResponse.json({ message: "Failed to refresh token" }, { status: response.status });
        }

        const newSetCookie = response.headers.get("set-cookie");

        const data = await response.json();
        console.log("refreshAccessToken response:", data);

        const nextResponse = NextResponse.json(data);
        if (newSetCookie) {
            nextResponse.headers.set("Set-Cookie", newSetCookie);
        }
        return nextResponse;
    } catch (err) {
        console.error("Error refreshing access token", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
