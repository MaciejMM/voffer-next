import {  fetchUser } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditUserForm from '@/ui/admin/EditUserForm';


export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const user = await fetchUser(id);

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Edit User
            </h3>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditUserForm user={user} />
                </CardContent>
            </Card>
        </div>
    );
} 
