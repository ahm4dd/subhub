import { NewUser, users } from "../schema.ts";
import { db } from "../index.ts";

export async function createUser(user: NewUser) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = emailRegex.test(user.email);

  if (!isValidEmail) {
    throw new Error("Invalid email format.");
  }

  const insertedUser = await db.insert(users).values(user).returning();
  return insertedUser;
}
