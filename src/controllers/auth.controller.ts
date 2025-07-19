import { Request, Response, NextFunction } from "express";
import { NewRefreshToken, User } from "../db/schema.ts";
import {
  BadRequestError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  ServerError,
} from "../errors.ts";
import { createUser, getUserByEmail } from "../db/queries/users.ts";
import { serverConfig } from "../config.ts";
import {
  makeJWT,
  generateRefreshToken,
  hashPassword,
} from "../security/auth.ts";
import { createRefreshToken } from "../db/queries/refreshTokens.ts";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    type Parameters = Omit<User, "id" | "createdAt" | "updatedAt">;
    if (req.body satisfies Parameters) {
      const params: Parameters = req.body;
      params.passwordHash = await hashPassword(params.passwordHash);
      const doesUserExist = await getUserByEmail(params.email);
      if (doesUserExist) {
        throw new AuthenticationError("User already exists.");
      }

      const user: Omit<User, "hashedPassword"> = await createUser(params);
      if (!user) {
        throw new DatabaseError("Could not create user.");
      }
      const token = makeJWT(user.id, serverConfig.JWT_SECRET);
      const refreshToken = createRefreshToken({
        token: generateRefreshToken(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 5184000),
      } satisfies NewRefreshToken);

      if (!token || !refreshToken) {
        throw new ServerError("Could not create auth tokens.");
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.status(201).json({ ...user, token });
    } else {
      throw new BadRequestError("Invalid or missing user data.");
    }
  } catch (err) {
    next(err);
  }
}
