'use client';

import EditUserForm from "@/ui/admin/EditUserForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type Role = 'ADMIN' | 'USER';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    role: Role;
    active: boolean;
}

export default function EditUserPage() {
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { getAccessTokenRaw } = getKindeServerSession();
                const accessToken = await getAccessTokenRaw();

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin/${params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    setError("Invalid response from server");
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return <EditUserForm user={user} />;
} 
