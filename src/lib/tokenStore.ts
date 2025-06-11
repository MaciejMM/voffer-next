import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import redis from './redis';

const TOKEN_PREFIX = 'access_token:';

export async function saveAccessToken(id: string, token: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  await redis.setex(`${TOKEN_PREFIX}${userId}:${id}`, 86400, token);
}

export async function getAccessToken(id: string): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return await redis.get(`${TOKEN_PREFIX}${userId}:${id}`);
}

export async function deleteAccessToken(id: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  await redis.del(`${TOKEN_PREFIX}${userId}:${id}`);
}

async function getUserId() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  return user.id;
}