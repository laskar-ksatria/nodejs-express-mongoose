import { Document, Types } from "mongoose";
import { Request } from "express";

// TypeScript
export type TGenerateToken = {
  id: Types.ObjectId;
};

export interface IAuthRequest extends Request {
  decoded?: TGenerateToken;
}

// Error
export interface IErrorMessage {
  message: string;
  error_id: number;
  http_code: number;
  sentry?: boolean;
}

export type CreateLimitType = {
  max: number; // Maximum number of requests allowed
  ms: number; // Time window in milliseconds
};

// User ---------------------------------------------------------- //
export interface IUser {
  email: string;
  full_name: string;
  password: string;
}

export interface IUserModel extends IUser {
  _id: Types.ObjectId;
}

export interface IUserDocument extends IUser, Document {}

// Role ---------------------------------------------------------- //
