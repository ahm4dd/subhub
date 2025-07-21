import {Request, Response, NextFunction} from "express";
import {
    BadRequestError,
    DatabaseError,
    NotFoundError,
    ServerError,
    ValidationError,
} from "../errors.ts";
import { getRefreshTokenByToken } from "../db/queries/refreshTokens.ts";
import { getUserById } from "../db/queries/users.ts";
import { makeJWT } from "../security/auth.ts";
import { serverConfig } from "../config.ts";

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.cookies?.refreshToken) {
            throw new BadRequestError("No refresh token provided!");
        }
        
        const refreshToken: string = req.cookies.refreshToken;
        const token = await getRefreshTokenByToken(refreshToken);
        if (!token) {
            throw new NotFoundError("Refresh token not found!");
        }
        
        const user = await getUserById(token.userId);
        if (!user) {
            throw new NotFoundError("User not found!");
        }
        
        const newToken = makeJWT(user.id, serverConfig.JWT_SECRET);
        
        if (!newToken) {
            throw new ServerError("Could not create access token.");
        }
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        });
        res.status(200).json({ token: newToken });
    } catch(err) {
        next(err);
    }
}