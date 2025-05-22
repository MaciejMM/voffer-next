'use client'
import { updateUser, UserState } from '@/lib/actions/admin';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

type User = {
    id: number;
    title: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date | null;
    kindeId: string;
    active: boolean | null;
}

export default function EditUserForm({ user }: { user: User }) {
    const router = useRouter();
    const [selectedTitle, setSelectedTitle] = useState(user.title);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const updateUserWithId = updateUser.bind(null, user.id);
    const [state, action, isPending] = useActionState(
        async (prevState: UserState, formData: FormData) => {
            return await updateUserWithId(formData);
        },
        {
            success: false,
            error: '',
            message: '',
            errors: {},
            inputs: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title,
                role: user.role
            }
        }
    );

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard/admin');
        }
    }, [state.success, router]);

    return (
        <form action={action} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={user.id} />
            <div className="space-y-2">
                <Label>Title</Label>
                <div className="flex gap-4" role="radiogroup">
                    {['Mr', 'Mrs', 'Ms'].map((title) => (
                        <div key={title} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={title}
                                name="title"
                                value={title}
                                className="h-4 w-4"
                                checked={selectedTitle === title}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                                title={`Select ${title} as title`}
                            />
                            <Label htmlFor={title}>{title}</Label>
                        </div>
                    ))}
                </div>
                {state.errors?.title && (
                    <p className="text-sm text-red-500">{state.errors.title[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex gap-4" role="radiogroup">
                    {['USER', 'ADMIN'].map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={role}
                                name="role"
                                value={role}
                                className="h-4 w-4"
                                checked={selectedRole === role}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                disabled={role === 'ADMIN'}
                                title={`Select ${role} role`}
                            />
                            <Label htmlFor={role}>{role}</Label>
                        </div>
                    ))}
                </div>
                {state.errors?.role && (
                    <p className="text-sm text-red-500">{state.errors.role[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    defaultValue={user?.email}
                    disabled
                    required
                />
                {state.errors?.email && (
                    <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    defaultValue={user?.firstName}
                    required
                />
                {state.errors?.firstName && (
                    <p className="text-sm text-red-500">{state.errors.firstName[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    defaultValue={user?.lastName}
                    required
                />
                {state.errors?.lastName && (
                    <p className="text-sm text-red-500">{state.errors.lastName[0]}</p>
                )}
            </div>

            {state.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {state.error}
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" disabled={isPending} className="mt-4">
                {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
} 
