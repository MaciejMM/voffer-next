'use client';

import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/admin";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Role = 'ADMIN' | 'USER';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    role: Role;
    active: boolean;
}

interface FormProps {
    user: User;
}

type ActionResult = {
    success: boolean;
    message?: string;
};

export default function EditUserForm({ user }: FormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(
        async (state: ActionResult, formData: FormData): Promise<ActionResult> => {
            return await updateUser(user.id, formData);
        },
        { success: false }
    );

    const handleSubmit = async (formData: FormData) => {
        const result = await formAction(formData) as unknown as ActionResult;
        
        if (result.success) {
            toast({
                title: "Success",
                description: "User updated successfully",
            });
            router.push('/dashboard/admin');
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to update user",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                defaultValue={user.firstName}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                defaultValue={user.lastName}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={user.title}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            defaultChecked={user.active}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 