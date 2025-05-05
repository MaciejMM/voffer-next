'use client';

import { useActionState } from 'react';
import { createUser, CreateUserState } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
    const router = useRouter();
    const initialState: CreateUserState = {
        errors: {},
        message: '',
        success: false,
    };

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
                            <div 
                                className="flex gap-4" 
                                role="radiogroup"
                                aria-invalid={!!state.errors?.title}
                                aria-describedby="title-error"
                            >
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
                                        />
                                        <Label htmlFor={title}>{title}</Label>
                                    </div>
                                ))}
                            </div>
                            {state.errors?.title && (
                                <p className="text-sm text-red-500" id="title-error">
                                    {state.errors.title[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div 
                                className="flex gap-4"
                                role="radiogroup"
                                aria-invalid={!!state.errors?.role}
                                aria-describedby="role-error"
                            >
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
                                        />
                                        <Label htmlFor={role}>{role}</Label>
                                    </div>
                                ))}
                            </div>
                            {state.errors?.role && (
                                <p className="text-sm text-red-500" id="role-error">
                                    {state.errors.role[0]}
                                </p>
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
                                aria-invalid={!!state.errors?.email}
                                aria-describedby="email-error"
                            />
                            {state.errors?.email && (
                                <p className="text-sm text-red-500" id="email-error">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                                defaultValue={state.inputs?.firstName}
                                aria-invalid={!!state.errors?.firstName}
                                aria-describedby="firstName-error"
                            />
                            {state.errors?.firstName && (
                                <p className="text-sm text-red-500" id="firstName-error">
                                    {state.errors.firstName[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Doe"
                                defaultValue={state.inputs?.lastName}
                                aria-invalid={!!state.errors?.lastName}
                                aria-describedby="lastName-error"
                            />
                            {state.errors?.lastName && (
                                <p className="text-sm text-red-500" id="lastName-error">
                                    {state.errors.lastName[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="john_doe"
                                defaultValue={state.inputs?.username}
                                aria-invalid={!!state.errors?.username}
                                aria-describedby="username-error"
                            />
                            {state.errors?.username && (
                                <p className="text-sm text-red-500" id="username-error">
                                    {state.errors.username[0]}
                                </p>
                            )}
                        </div>

                        {state.message && !state.success && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {state.message}
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
