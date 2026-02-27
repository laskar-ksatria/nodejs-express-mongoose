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
    // body boleh di-assign langsung
    req.body = sanitizeObject(req.body);

    // query dan params: mutasi in-place, jangan overwrite property (getter-only)
    const sanitizedQuery = sanitizeObject(req.query);
    const sanitizedParams = sanitizeObject(req.params);

    // bersihkan key lama lalu isi dengan yang sudah disanitasi
    Object.keys(req.query).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (req.query as any)[key];
    });
    Object.assign(req.query as any, sanitizedQuery as any);

    Object.keys(req.params).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (req.params as any)[key];
    });
    Object.assign(req.params as any, sanitizedParams as any);

    next();
  } catch (err) {
    res.status(400).json({
      message: (err as Error).message || "Invalid input.",
    });
  }
};

