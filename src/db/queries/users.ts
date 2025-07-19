import { NewUser, users, User } from "../schema.ts";
import { db } from "../index.ts";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = emailRegex.test(user.email);

  if (!isValidEmail) {
    throw new Error("Invalid email format.");
  }

  const insertedUser = await db.insert(users).values(user).returning();
  return insertedUser;
}

export async function getUserById(id: string): Promise<User> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(users);
}
