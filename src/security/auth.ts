import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function makeJWT(
  userId: string,
  secret: string,
  expiresIn: number = 3600,
) {
  type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const payload: Payload = {
    iss: "subhub",
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(payload, ecret);
}
