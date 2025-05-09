'use server';

import { z } from 'zod';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CreateUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z.string().min(1, 'Username is required'),
    title: z.string().min(1, 'Title is required'),
    role: z.enum(['USER', 'ADMIN']),
});

export type CreateUserState = {
    errors?: {
        email?: string[];
        firstName?: string[];
        lastName?: string[];
        username?: string[];
        title?: string[];
        role?: string[];
    };
    message?: string;
    success?: boolean;
    inputs?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        title?: string;
        role?: string;
    };
};

export async function createUser(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
    const { getAccessTokenRaw } = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const rawFormData = {
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        username: formData.get('username'),
        title: formData.get('title'),
        role: formData.get('role') || 'USER',
    };

    const validatedFields = CreateUserSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fill in all required fields correctly',
            success: false,
            inputs: {
                email: rawFormData.email as string,
                firstName: rawFormData.firstName as string,
                lastName: rawFormData.lastName as string,
                username: rawFormData.username as string,
                title: rawFormData.title as string,
                role: rawFormData.role as string,
            }
        };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(validatedFields.data),
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                message: error.message || 'Failed to create user',
                success: false,
                inputs: {
                    email: rawFormData.email as string,
                    firstName: rawFormData.firstName as string,
                    lastName: rawFormData.lastName as string,
                    username: rawFormData.username as string,
                    title: rawFormData.title as string,
                    role: rawFormData.role as string,
                }
            };
        }

        return {
            success: true,
            message: 'User created successfully',
        };
    } catch (error) {
        return {
            message: 'An error occurred while creating the user',
            success: false,
            inputs: {
                email: rawFormData.email as string,
                firstName: rawFormData.firstName as string,
                lastName: rawFormData.lastName as string,
                username: rawFormData.username as string,
                title: rawFormData.title as string,
                role: rawFormData.role as string,
            }
        };
    }
}

export async function deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    const { getAccessTokenRaw } = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to delete user',
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while deleting the user',
        };
    }
}

const UpdateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    title: z.string().min(1, 'Title is required'),
});

export type UpdateUserState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        title?: string[];
    };
    message?: string;
    success?: boolean;
    inputs?: {
        firstName?: string;
        lastName?: string;
        title?: string;
    };
};

export async function updateUser(prevState: UpdateUserState, formData: FormData): Promise<UpdateUserState> {
    const { getAccessTokenRaw } = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const rawFormData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        title: formData.get('title'),
    };

    const validatedFields = UpdateUserSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fill in all required fields correctly',
            success: false,
            inputs: {
                firstName: rawFormData.firstName as string,
                lastName: rawFormData.lastName as string,
                title: rawFormData.title as string,
            }
        };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/admin/${formData.get('id')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                firstName: validatedFields.data.firstName,
                lastName: validatedFields.data.lastName,
                title: validatedFields.data.title,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                message: error.message || 'Failed to update user',
                success: false,
                inputs: {
                    firstName: rawFormData.firstName as string,
                    lastName: rawFormData.lastName as string,
                    title: rawFormData.title as string,
                }
            };
        }

        return {
            success: true,
            message: 'User updated successfully',
        };
    } catch (error) {
        return {
            message: 'An error occurred while updating the user',
            success: false,
            inputs: {
                firstName: rawFormData.firstName as string,
                lastName: rawFormData.lastName as string,
                title: rawFormData.title as string,
            }
        };
    }
} 
