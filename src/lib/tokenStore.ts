import redis from './redis';

const TOKEN_PREFIX = 'access_token:';

export async function saveAccessToken(id: string, token: string) {
  // Zapisz token z TTL = 1h
  await redis.setex(`${TOKEN_PREFIX}${id}`, 86400, token);
}

export async function getAccessToken(id: string): Promise<string | null> {
  return await redis.get(`${TOKEN_PREFIX}${id}`);
}

export async function deleteAccessToken(id: string) {
  await redis.del(`${TOKEN_PREFIX}${id}`);
}
