import HttpError, { errorStates } from "../errors";
import { VerifyToken } from "../services/jwt";
import { type Response, NextFunction } from "express";
import { IAuthRequest } from "../types";

export default function Authentication(
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req?.headers?.authorization;
    if (!token) throw new HttpError(errorStates.failedAuthentication);
    const decoded = VerifyToken(token.split("Bearer ")[1]);
    req.decoded = decoded;
    next();
  } catch (error: any) {
    if (error?.name === "TokenExpiredError") {
      return next(new HttpError(errorStates.tokenExpired));
    }
    next(error);
  }
}
