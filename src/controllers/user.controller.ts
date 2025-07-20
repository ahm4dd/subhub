import { Request, Response, NextFunction } from "express";
import { NewUser, User } from "../db/schema.ts";
import { getUserById } from "../db/queries/users.ts";
import { extractBearerToken } from "../security/auth.ts";

export async function getUserDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = extractBearerToken(req);
  } catch (err) {
    next(err);
  }
}
