import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import EditUserForm from "@/ui/admin/EditUserForm";


async function getUserData(id: string) {
    const { getAccessTokenRaw } = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        notFound();
    }

    return response.json();
}

export default async function EditUserPage({
    params,
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    try {
        const user = await getUserData(params.id);
        return <EditUserForm user={user} />;
    } catch (error) {
        notFound();
    }
} 
