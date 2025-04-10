import Redis from "ioredis"

const redisClient = new Redis(process.env.REDIS_URL); // from Upstash

export default redisClient;
