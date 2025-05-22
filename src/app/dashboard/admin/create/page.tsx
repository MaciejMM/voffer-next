'use client';

import { useActionState } from 'react';
import { createUser, UserState } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const initialState: UserState = {
    success: false,
    error: '',
    message: '',
    errors: {},
    inputs: {
        email: '',
        firstName: '',
        lastName: '',
        title: '',
        role: ''
    }
};

export default function CreateUserPage() {
    const router = useRouter();
    const [state, action, isPending] = useActionState(createUser, initialState);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedRole, setSelectedRole] = useState('USER');

    useEffect(() => {
        if (state.inputs?.title) {
            setSelectedTitle(state.inputs.title);
        }
        if (state.inputs?.role) {
            setSelectedRole(state.inputs.role);
        }
    }, [state.inputs]);

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard/admin');
        }
    }, [state.success, router]);

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Create New User
            </h3>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="flex flex-col gap-4">
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
                                defaultValue={state.inputs?.email}
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
                                defaultValue={state.inputs?.firstName}
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
                                defaultValue={state.inputs?.lastName}
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
                            {isPending ? 'Creating...' : 'Create User'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
