import rateLimit from "express-rate-limit";
import { errorStates } from "../errors";
import { CreateLimitType } from "../types";

/**
 * Function to create a rate-limiter middleware.
 *
 * @param params - An object containing the maximum requests and time window.
 * @returns A configured rate-limiting middleware for Express.
 */
export const RateLimit = ({ max, ms }: CreateLimitType) =>
  rateLimit({
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
    },
    windowMs: ms,
    max,
    message: {
      error_id: errorStates.rateLimit.error_id,
      message: errorStates.rateLimit.message,
    },
  });
