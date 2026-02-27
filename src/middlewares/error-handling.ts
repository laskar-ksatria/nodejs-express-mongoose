import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import HttpError, { errorStates } from "../errors";
import { NextFunction } from "@sentry/node/build/types/integrations/tracing/nest/types";

// Global error handling middleware
export const ErrorHandling = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Known application errors
  if (error instanceof HttpError) {
    const payload = errorStates.internalservererror;

    const statusCode = error.statusCode ?? payload.http_code;

    // Optionally send to Sentry if this error is marked as sentry
    if ((error as any).sentry) {
      Sentry.captureException(error);
    }

    res.status(statusCode).json({
      success: false,
      error: {
        error_id: error.error_id,
        message: error.message,
        errors: [],
      },
    });

    return;
  }

  const validationErrors: Array<Record<string, string>> = [];

  // Mongoose validation or similar structured errors
  if ((error as any)?.errors) {
    Object.entries((error as any).errors).forEach(
      ([key, value]: [string, any]) => {
        validationErrors.push({
          [key]: value.message,
        });
      },
    );
  }

  // Unexpected error: send to Sentry
  Sentry.captureException(error);

  const fallback = errorStates.internalservererror;

  res.status(fallback.http_code).json({
    success: false,
    error: {
      error_id: fallback.error_id,
      message: fallback.message,
      errors: validationErrors,
    },
  });
};
