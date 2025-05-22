import { getUsers, getUser, createUser, updateUser, deleteUser } from '@/app/actions/user';
import type { User, CreateUserRequest, UpdateUserRequest, UserRole } from '@/app/actions/user';

export { type User, type CreateUserRequest, type UpdateUserRequest };

const castUser = (data: any): User => ({
    ...data,
    role: data.role as UserRole,
    active: data.active ?? true
});

export async function fetchUsers(): Promise<User[]> {
    const result = await getUsers();
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch users');
    }
    return result.data.map(castUser);
}

export async function fetchUser(id: number): Promise<User> {
    const result = await getUser(id);
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch user');
    }
    return castUser(result.data);
}

export async function createNewUser(data: CreateUserRequest): Promise<User> {
    const result = await createUser(data);
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create user');
    }
    return castUser(result.data);
}

export async function updateExistingUser(id: number, data: UpdateUserRequest): Promise<User> {
    const result = await updateUser(id, data);
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update user');
    }
    return castUser(result.data);
}

export async function removeUser(id: number): Promise<User> {
    const result = await deleteUser(id);
    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to delete user');
    }
    return castUser(result.data);
}
