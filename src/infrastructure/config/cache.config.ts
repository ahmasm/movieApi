// src/infrastructure/persistence/redis/cache.config.ts
import Redis, { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const redisClient = new Redis(redisOptions);

redisClient.on("error", (error: Error) => {
  console.error("❌ Redis Error:", error);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

export default redisClient;
