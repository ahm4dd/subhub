import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  BadRequestError,
  AuthenticationError,
  AuthorizationError,
  ServerError,
} from "../errors.ts";

export function middlewareError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;

  if (err instanceof ValidationError) {
    statusCode = 400;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
  } else if (err instanceof BadRequestError) {
    statusCode = 400;
  } else if (err instanceof AuthenticationError) {
    statusCode = 401;
  } else if (err instanceof AuthorizationError) {
    statusCode = 403;
  } else if (err instanceof ServerError) {
    statusCode = 500;
  }

  if (statusCode >= 500) {
    console.error(err.message);
  }

  res.status(statusCode).send({ error: err.message });
  res.end();
}
