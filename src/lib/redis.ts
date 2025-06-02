import { Redis } from '@upstash/redis';
import { Redis as IoRedis } from 'ioredis';

let redis: IoRedis | Redis;
if (process.env.BASE_ENV === 'local') {
    redis = new IoRedis(process.env.REDIS_URL!);
} else {
    redis = new Redis({
        url: process.env.REDIS_URL!,
        token: process.env.REDIS_TOKEN!,
    })
}

export default redis;