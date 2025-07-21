import jwt from "jsonwebtoken";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthorizationError } from "../errors.ts";
import crypto from "node:crypto";

const SALT_ROUNDS = 10;

export function makeJWT(
  userId: string,
  secret: string,
  expiresIn: number = 3600,
): string {
  type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const payload: Payload = {
    iss: "subhub",
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(payload, secret);
}

export function verifyJWT(token: string, secret: string): string {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.sub as string;
  } catch (err) {
    throw new AuthorizationError("Invalid access token!");
  }
}

export async function hashPassword(
  password: string,
  salt_rounds: number = SALT_ROUNDS,
): Promise<string> {
  return await bcrypt.hash(password, salt_rounds);
}

export async function checkPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function extractBearerToken(req: Request): string | undefined {
  return req.headers.authorization?.split("Bearer ")[1] || undefined;
}