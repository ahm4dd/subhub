import { Request, Response, NextFunction } from "express";
import { getUserById } from "../db/queries/users.ts";
import { extractBearerToken, verifyJWT } from "../security/auth.ts";
import {
  NotFoundError,
  ServerError,
  ValidationError,
  BadRequestError,
  ConflictError,
  AuthorizationError,
  DatabaseError,
  AuthenticationError,
} from "../errors.ts";
import { serverConfig } from "../config.ts";

export async function getUserDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      throw new BadRequestError("No token provided!");
    }

    const userId = verifyJWT(token, serverConfig.JWT_SECRET);

    if (req.params.id !== userId) {
      throw new AuthorizationError("Not authorized to access this resource!");
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    const userWithoutPassword = { ...user, passwordHash: undefined };
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
}
