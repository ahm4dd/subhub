import { NewUser, users, User } from "../schema.ts";
import { db } from "../index.ts";
import { eq } from "drizzle-orm";
import { ValidationError } from "../../errors.ts";

export async function createUser(user: NewUser): Promise<User | undefined> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = emailRegex.test(user.email);

  if (!isValidEmail) {
    throw new ValidationError("Invalid email format.");
  }

  const [insertedUser] = await db.insert(users).values(user).returning();
  return insertedUser;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getAllUsers(): Promise<User[] | undefined> {
  return await db.select().from(users);
}
