'use client';

import { useActionState } from 'react';
import { updateUser, UpdateUserState } from '@/lib/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'ADMIN' | 'USER';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    role?: Role;
    active?: boolean;
}

export default function EditUserForm({ user }: { user: User }) {
    const router = useRouter();
    const initialState: UpdateUserState = {
        errors: {},
        message: '',
        success: false,
    };

    const [state, action, isPending] = useActionState(updateUser, initialState);
    const [selectedTitle, setSelectedTitle] = useState(user.title);

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard/admin');
        }
    }, [state.success, router]);

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
                    <form action={action} className="flex flex-col gap-4">
                        <input type="hidden" name="id" value={user.id} />
                        
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
                            <input 
                                type="hidden" 
                                name="role" 
                                value="USER" 
                            />
                            <div className="text-sm text-gray-500">
                                Role: USER
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                                defaultValue={user.firstName}
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
                                defaultValue={user.lastName}
                                aria-invalid={!!state.errors?.lastName}
                                aria-describedby="lastName-error"
                            />
                            {state.errors?.lastName && (
                                <p className="text-sm text-red-500" id="lastName-error">
                                    {state.errors.lastName[0]}
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
                            {isPending ? 'Updating...' : 'Update User'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 
