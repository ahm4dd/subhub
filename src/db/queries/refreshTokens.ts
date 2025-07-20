import { eq } from "drizzle-orm";
import { db } from "../index.ts";
import { RefreshToken, NewRefreshToken, refreshTokens } from "../schema.ts";

export async function createRefreshToken(
  refreshToken: NewRefreshToken,
): Promise<RefreshToken> {
  const [token] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return token;
}

export async function getRefreshTokenByToken(token: string): Promise<RefreshToken> {
  const [refreshToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return refreshToken;
}

export async function revokeRefreshToken(token: string): Promise<RefreshToken> {
  const [refreshToken] = await db
    .update(refreshTokens)
    .set({revokedAt: new Date()})
    .where(eq(refreshTokens.token, token))
    .returning();
  return refreshToken;
}

export async function deleteRefreshToken(token: string): Promise<RefreshToken> {
  const [refreshToken] = await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .returning();
  return refreshToken;
}