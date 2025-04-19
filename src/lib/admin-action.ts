import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export type User ={
    id: number;
    kindeId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    username: string;
}


export async function fetchUsers():Promise<User[]> {

    const {getAccessTokenRaw} = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin/users`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            method: 'GET',
        });

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}
