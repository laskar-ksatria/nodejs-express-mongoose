"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = {
    PORT: `${process.env.PORT}`,
    REDIS_HOST: `${process.env.REDIS_HOST}`,
    REDIS_PORT: `${process.env.REDIS_PORT}`,
    SENTRY_DSN: `${process.env.SENTRY_DSN}`,
    TOKEN_KEY: `${process.env.TOKEN_KEY}`,
    TOKEN_EXPIRED: `${process.env.TOKEN_EXPIRED}`,
    PRIVATE_KEY: `${process.env.PRIVATE_KEY}`,
    PUBLIC_KEY: `${process.env.PUBLIC_KEY}`,
    MONGGO_URI: `${process.env.MONGGO_URI}`,
};
exports.default = env;
