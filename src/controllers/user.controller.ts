import { Request, Response, NextFunction } from "express";
import { createUser, getAllUsers, getUserByEmail, getUserById } from "../db/queries/users.ts";
import { authenticateToken, extractBearerToken, hashPassword, verifyJWT } from "../security/auth.ts";
import {
  NotFoundError,
  ServerError,
  ValidationError,
  BadRequestError,
  ConflictError,
  AuthorizationError,
  DatabaseError,
  AuthenticationError,
} from "../errors.ts";
import { serverConfig } from "../config.ts";
import { NewUser, User } from "../db/schema.ts";

export async function getUserDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {

    const authenticated = authenticateToken(req, serverConfig.JWT_SECRET);
    
    if (authenticated === false) {
      throw new AuthorizationError("Not authorized to create subscription!");
    }

    const userId = authenticated as string;

    if (req.params.id !== userId) {
      throw new AuthorizationError("Not authorized to access this resource!");
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    const userWithoutPassword = { ...user, passwordHash: undefined };
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
}

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticated = authenticateToken(req, serverConfig.JWT_SECRET_ADMIN);
    
    if (authenticated === false) {
      throw new AuthorizationError("Not authorized to create subscription!");
    }
    
    if (!req.body.name || !req.body.email || !req.body.password) {
      throw new BadRequestError("Invalid user data!");
    }
    

    const user: Omit<NewUser, "passwordHash"> & { password: string } = req.body;
    const doesUserExist = await getUserByEmail(user.email);
    if (doesUserExist) {
      throw new ConflictError("User already exists.");
    }

    const newUser: User | undefined = await createUser({
      passwordHash: await hashPassword(user.password),
      ...user,
    } satisfies NewUser);
    
    if (!newUser) {
      throw new DatabaseError("Could not create user.");
    }

    const userWithNoPassword = { ...newUser, passwordHash: undefined };
    res.status(201).json(userWithNoPassword);

  } catch(err) {
    next(err);
  }
}

export async function getAllUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticated = authenticateToken(req, serverConfig.JWT_SECRET_ADMIN);
    if (authenticated === false) {
      throw new AuthorizationError("Admin privileges required!");
    }

    const users = await getAllUsers();
    
    // Remove password hashes from response
    const safeUsers = users?.map(user => ({
      ...user,
      passwordHash: undefined
    }));

    res.status(200).json(safeUsers || []);
  } catch (err) {
    next(err);
  }
}