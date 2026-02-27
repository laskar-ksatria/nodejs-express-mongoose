import { NextFunction, Request, Response } from "express";

const dangerousKeyPattern = /^\$|\.|\$/;
const htmlTagPattern = /<[^>]*>/;

const sanitizeObject = <T>(value: T): T => {
  const inner = (val: unknown): unknown => {
    if (Array.isArray(val)) {
      return val.map(inner);
    }

    if (val && typeof val === "object") {
      const obj = val as Record<string, unknown>;
      const sanitized: Record<string, unknown> = {};

      Object.keys(obj).forEach((key) => {
        if (dangerousKeyPattern.test(key)) {
          return;
        }

        sanitized[key] = inner(obj[key]);
      });

      return sanitized;
    }

    if (typeof val === "string") {
      if (htmlTagPattern.test(val)) {
        throw new Error("HTML content is not allowed in input.");
      }

      return val;
    }

    return val;
  };

  return inner(value) as T;
};

export const securityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);

    next();
  } catch (err) {
    res.status(400).json({
      message: (err as Error).message || "Invalid input.",
    });
  }
};

