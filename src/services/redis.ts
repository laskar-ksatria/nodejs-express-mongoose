import Redis from "ioredis";
import env from "../env";
import HttpError, { errorStates } from "../errors";

export const CACHE_USER = (id: string) => `${id}-CACHE_USER`;

class RedisClient {
  private static instance: Redis;
  private constructor() {}
  public static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        password: env.REDIS_PASSWORD,
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT) || 6379,
      });
      this.instance.on("connect", () => {});
      this.instance.on("error", (err) => {
        console.error("Redis error:", err);
      });
    }
    return this.instance;
  }
}

export const setCache = async (
  key: string,
  value: string,
  expiry: number = 60, //Second
): Promise<void> => {
  try {
    const redis = RedisClient.getInstance();
    await redis.set(key, value, "EX", expiry);
  } catch (error) {
    throw new HttpError(errorStates.internalservererror);
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    const redis = RedisClient.getInstance();
    const value = await redis.get(key);
    return value;
  } catch (error) {
    throw new HttpError(errorStates.internalservererror);
  }
};
