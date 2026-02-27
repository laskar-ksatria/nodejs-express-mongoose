import { config } from "dotenv";

config();

const env = {
  PORT: `${process.env.PORT}`,
  REDIS_HOST: `${process.env.REDIS_HOST}`,
  REDIS_PORT: `${process.env.REDIS_PORT}`,
  SENTRY_DSN: `${process.env.SENTRY_DSN}`,
  TOKEN_EXPIRED: `${process.env.TOKEN_EXPIRED}`,
  PRIVATE_KEY: `${process.env.PRIVATE_KEY}`,
  MONGGO_URI: `${process.env.MONGGO_URI}`,
  REDIS_PASSWORD: `${process.env.REDIS_PASSWORD}`,
};

export default env;
