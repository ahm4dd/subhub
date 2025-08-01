import { Request, Response, NextFunction } from "express";
import { NewRefreshToken, User, NewUser } from "../db/schema.ts";
import {
  BadRequestError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  ServerError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../errors.ts";
import { createUser, getUserByEmail } from "../db/queries/users.ts";
import { serverConfig } from "../config.ts";
import {
  makeJWT,
  generateRefreshToken,
  hashPassword,
  checkPassword,
} from "../security/auth.ts";
import { createRefreshToken, getRefreshTokenByToken, revokeRefreshToken } from "../db/queries/refreshTokens.ts";

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
      const refreshToken = await createRefreshToken({
        token: generateRefreshToken(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      } satisfies NewRefreshToken);

      if (!token || !refreshToken) {
        throw new ServerError("Could not create auth tokens.");
      }

      res.cookie("refreshToken", refreshToken.token, {
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

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.email && req.body.password) {
      const params: { email: string; password: string } = req.body;
      const user = await getUserByEmail(params.email);

      if (!user) {
        throw new AuthenticationError("User not found.");
      }

      if (await checkPassword(params.password, user.passwordHash)) {
        const token = makeJWT(user.id, serverConfig.JWT_SECRET);
        const refreshToken = await createRefreshToken({
          token: generateRefreshToken(),
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        } satisfies NewRefreshToken);

        if (!token || !refreshToken) {
          throw new ServerError("Could not create auth tokens.");
        }

        res.cookie("refreshToken", refreshToken.token, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.status(200).json({ token });
      } else {
        throw new AuthenticationError("Invalid password.");
      }
    }
    else {
      throw new BadRequestError("Invalid or missing user data.");
    }
  } catch (err) {
    next(err);
  }
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.cookies?.refreshToken) {
      throw new BadRequestError("No refresh token provided!");
    }
    
    const refreshToken: string = req.cookies.refreshToken;
    const token = await getRefreshTokenByToken(refreshToken);
    if (!token) {
      throw new NotFoundError("Refresh token not found!");
    }
    
    if (token.revokedAt !== null) {
      throw new ValidationError("Refresh token already revoked!");
    }
    
    if (token.expiresAt < new Date()) {
      throw new ValidationError("Refresh token expired!");
    }
    
    await revokeRefreshToken(refreshToken);

    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch(err) {
    next(err);
  }
}