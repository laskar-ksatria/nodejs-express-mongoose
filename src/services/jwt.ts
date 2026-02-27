import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../env";
import { TGenerateToken } from "../types";

/**
 * Function to generate a JSON Web Token (JWT) with a given payload.
 *
 * @param payload - The data to include in the JWT (e.g., user ID and email).
 * @returns A signed JWT as a string.
 */
export const GenerateToken = (payload: TGenerateToken): string => {
  const key: string = `${env.PRIVATE_KEY}`;
  const expired: any = `${env.TOKEN_EXPIRED}`;
  const token: string = jwt.sign(payload, key, {
    algorithm: "RS256",
    expiresIn: expired,
  });
  return token;
};

/**
 * Function to verify and decode a given JWT.
 *
 * @param token - The JWT to verify.
 * @returns The decoded payload if the token is valid, or throws an error if invalid.
 */
export const VerifyToken = (token: string): TGenerateToken => {
  const key: string = `${env.PRIVATE_KEY}`;
  return jwt.verify(token, key, { algorithms: ["RS256"] }) as TGenerateToken;
};
