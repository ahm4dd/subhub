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
