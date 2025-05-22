'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createKindeUser, updateKindeUser, deleteKindeUser } from '@/lib/kinde';

export type UserRole = 'USER' | 'USER_MANAGER' | 'ADMIN' | 'SUPER_ADMIN';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  title?: string;
  role?: UserRole;
  active?: boolean;
}

export interface User {
  id: number;
  kindeId: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export async function createUser(data: CreateUserRequest) {
  try {
    // Create user in Kinde
    const kindeResponse = await createKindeUser({
      profile: {
        given_name: data.firstName,
        family_name: data.lastName,
      },
      identities: [
        {
          type: 'email',
          details: { email: data.email },
        },
      ],
    });

    if (!kindeResponse.success) {
      throw new Error(kindeResponse.error);
    }

    // Create user in our database
    const [user] = await db.insert(users).values({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      role: data.role,
      kindeId: kindeResponse.data.id,
      createdAt: new Date(),
    }).returning();

    revalidatePath('/dashboard/users');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function getUsers() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured');
    }

    const allUsers = await db.select({
      id: users.id,
      kindeId: users.kindeId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      title: users.title,
      role: users.role,
      active: users.active,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);

    return { success: true, data: allUsers };
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to fetch users from database' };
  }
}

export async function getUser(id: number) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

export async function updateUser(id: number, data: UpdateUserRequest) {
  try {
    // Get the user first to get their Kinde ID
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      return { success: false, error: 'User not found' };
    }

    // Update user in Kinde
    if (data.firstName || data.lastName) {
      const kindeResponse = await updateKindeUser(existingUser.kindeId, {
        given_name: data.firstName,
        family_name: data.lastName,
      });

      if (!kindeResponse.success) {
        throw new Error(kindeResponse.error);
      }
    }

    // Update user in our database
    const [user] = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    revalidatePath('/dashboard/users');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteUser(id: number) {
  try {
    // Get the user first to get their Kinde ID
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      return { success: false, error: 'User not found' };
    }

    // Delete user from Kinde
    const kindeResponse = await deleteKindeUser(existingUser.kindeId);
    if (!kindeResponse.success) {
      throw new Error(kindeResponse.error);
    }

    // Delete user from our database
    const [user] = await db.delete(users)
      .where(eq(users.id, id))
      .returning();

    revalidatePath('/dashboard/users');
    return { success: true, data: user };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
} 