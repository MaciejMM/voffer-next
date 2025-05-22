'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createKindeUser, deleteKindeUser, getKindeToken } from '@/lib/kinde';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

const UserSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    title: z.enum(['Mr', 'Mrs', 'Ms'], { required_error: 'Title is required' }),
    role: z.enum(['USER', 'ADMIN'], { required_error: 'Role is required' }),
});

export type User = {
    id: number;
    kindeId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date | null;
    title: string;
    role: string;
    active: boolean | null;
}

export type UserState = {
    success: boolean;
    error: string;
    message: string;
    errors?: {
        email?: string[];
        firstName?: string[];
        lastName?: string[];
        title?: string[];
        role?: string[];
    };
    inputs?: {
        email: string;
        firstName: string;
        lastName: string;
        title: string;
        role: string;
    };
    data?: User;
};

export async function createUser(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
        const email = formData.get('email') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const title = formData.get('title') as string;
        const role = formData.get('role') as string;

        const userData = {
            email,
            firstName,
            lastName,
            title,
            role
        };

        const result = UserSchema.safeParse(userData);
        if (!result.success) {
            return {
                success: false,
                error: result.error.errors[0].message,
                message: 'Validation failed',
                errors: result.error.errors.reduce((acc, error) => {
                    acc[error.path[0] as keyof typeof acc] = [error.message];
                    return acc;
                }, {} as Record<string, string[]>),
                inputs: userData
            };
        }

        // Create user in Kinde
        const kindeResponse = await createKindeUser({
            profile: {
                given_name: firstName,
                family_name: lastName,
            },
            identities: [
                {
                    type: 'email',
                    details: { email: email },
                },
                {
                    type: 'username',
                    details: { username: uuidv4() },
                },
            ],
        });

        if (!kindeResponse.success) {
            return {
                success: false,
                error: kindeResponse.error || 'Failed to create user in Kinde',
                message: 'Failed to create user in Kinde',
                errors: {
                    email: [kindeResponse.error || 'Failed to create user in Kinde'],
                },
                inputs: userData
            };
        }

        // Create user in database
        const [user] = await db.insert(users).values({
            email: email,
            firstName: firstName,
            lastName: lastName,
            title: title,
            role: role,
            kindeId: kindeResponse.data.id,
            createdAt: new Date(),
            updatedAt: null,
            active: true
        }).returning();

        revalidatePath('/dashboard/admin');
        return {
            success: true,
            error: '',
            message: 'User created successfully',
            data: user,
            inputs: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title,
                role: user.role
            }
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: 'Failed to create user',
            message: 'An error occurred while creating the user',
            errors: {
                email: ['An error occurred while creating the user'],
                firstName: ['An error occurred while creating the user'],
                lastName: ['An error occurred while creating the user'],
                title: ['An error occurred while creating the user'],
                role: ['An error occurred while creating the user']
            },
            inputs: {
                email: formData.get('email') as string,
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                title: formData.get('title') as string,
                role: formData.get('role') as string
            }
        };
    }
}

export async function fetchUsers(): Promise<User[]> {
    try {
        const allUsers = await db.select().from(users);
        return allUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}


export async function updateUser(id: number, formData: FormData): Promise<UserState> {
    try {
        const id = parseInt(formData.get('id') as string);
        if (isNaN(id)) {
            return {
                success: false,
                error: 'Invalid user ID',
                message: 'The provided user ID is invalid',
                errors: {
                    email: ['The provided user ID is invalid'],
                    firstName: ['The provided user ID is invalid'],
                    lastName: ['The provided user ID is invalid'],
                    title: ['The provided user ID is invalid'],
                    role: ['The provided user ID is invalid']
                },
                inputs: {
                    email: formData.get('email') as string,
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    title: formData.get('title') as string,
                    role: formData.get('role') as string
                }
            };
        }

        const [existingUser] = await db.select().from(users).where(eq(users.id, id));
        if (!existingUser) {
            return {
                success: false,
                error: 'User not found',
                message: 'The user you are trying to update does not exist',
                errors: {
                    email: ['User not found'],
                    firstName: ['User not found'],
                    lastName: ['User not found'],
                    title: ['User not found'],
                    role: ['User not found']
                },
                inputs: {
                    email: formData.get('email') as string,
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    title: formData.get('title') as string,
                    role: formData.get('role') as string
                }
            };
        }

        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const title = formData.get('title') as string;
        const role = formData.get('role') as string;

        const userData = {
            email: existingUser.email,
            firstName,
            lastName,
            title,
            role
        };

        const result = UserSchema.safeParse(userData);
        if (!result.success) {
            return {
                success: false,
                error: result.error.errors[0].message,
                message: 'Validation failed',
                errors: result.error.errors.reduce((acc, error) => {
                    acc[error.path[0] as keyof typeof acc] = [error.message];
                    return acc;
                }, {} as Record<string, string[]>),
                inputs: userData
            };
        }

        // Update user in database
        const [user] = await db.update(users)
            .set({
                firstName,
                lastName,
                title,
                role,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning();

        revalidatePath('/dashboard/admin');
        return {
            success: true,
            error: '',
            message: 'User updated successfully',
            data: user,
            inputs: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title,
                role: user.role
            }
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            error: 'Failed to update user',
            message: 'An error occurred while updating the user',
            errors: {
                email: ['An error occurred while updating the user'],
                firstName: ['An error occurred while updating the user'],
                lastName: ['An error occurred while updating the user'],
                title: ['An error occurred while updating the user'],
                role: ['An error occurred while updating the user']
            },
            inputs: {
                email: formData.get('email') as string,
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                title: formData.get('title') as string,
                role: formData.get('role') as string
            }
        };
    }
}

export async function deleteUser(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
        const id = parseInt(formData.get('id') as string);
        if (isNaN(id)) {
            return {
                success: false,
                error: 'Invalid user ID',
                message: 'The provided user ID is invalid',
                errors: {
                    email: ['The provided user ID is invalid'],
                    firstName: ['The provided user ID is invalid'],
                    lastName: ['The provided user ID is invalid'],
                    title: ['The provided user ID is invalid'],
                    role: ['The provided user ID is invalid']
                },
                inputs: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    title: '',
                    role: ''
                }
            };
        }

        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            return {
                success: false,
                error: 'User not found',
                message: 'The user you are trying to delete does not exist',
                errors: {
                    email: ['User not found'],
                    firstName: ['User not found'],
                    lastName: ['User not found'],
                    title: ['User not found'],
                    role: ['User not found']
                },
                inputs: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    title: '',
                    role: ''
                }
            };
        }

        // Delete from Kinde
        const kindeResponse = await deleteKindeUser(user.kindeId);

        // Delete from database
        await db.delete(users).where(eq(users.id, id));

        revalidatePath('/dashboard/admin');
        return {
            success: true,
            error: '',
            message: 'User deleted successfully',
            inputs: {
                email: '',
                firstName: '',
                lastName: '',
                title: '',
                role: ''
            }
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            error: 'Failed to delete user',
            message: 'An error occurred while deleting the user',
            errors: {
                email: ['An error occurred while deleting the user'],
                firstName: ['An error occurred while deleting the user'],
                lastName: ['An error occurred while deleting the user'],
                title: ['An error occurred while deleting the user'],
                role: ['An error occurred while deleting the user']
            },
            inputs: {
                email: '',
                firstName: '',
                lastName: '',
                title: '',
                role: ''
            }
        };
    }
}

export async function fetchUser(id: string): Promise<User | null> {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
} 
