import { Request, Response, NextFunction } from "express";
import { NewUser, User } from "../db/schema.ts";
import { getUserById } from "../db/queries/users.ts";

export async function getUserDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (err) {
    next(err);
  }
}
