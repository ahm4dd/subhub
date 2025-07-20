import { Request, Response, NextFunction } from "express";
import { NewRefreshToken, User, NewUser } from "../db/schema.ts";
import {
  BadRequestError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  ServerError,
  ConflictError,
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
    if (req.body.name && req.body.email && req.body.password) {
      const params: Omit<NewUser, "passwordHash"> & { password: string } =
        req.body;
      const doesUserExist = await getUserByEmail(params.email);
      if (doesUserExist) {
        throw new ConflictError("User already exists.");
      }

      const user: User | undefined = await createUser({
        passwordHash: await hashPassword(params.password),
        ...params,
      } satisfies NewUser);
      const userWithNoPassword = { ...user, passwordHash: undefined };
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
      res.status(201).json({ ...userWithNoPassword, token });
    } else {
      throw new BadRequestError("Invalid or missing user data.");
    }
  } catch (err) {
    next(err);
  }
}
