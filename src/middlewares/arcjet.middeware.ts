import { Request, Response, NextFunction } from "express";
import aj from "../arcjet.ts";

export async function arcjetMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const decision = await aj.protect(req, { requested: 2 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).send({ message: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).send({ message: "Bot detected" });
      }
      return res.status(403).send({ message: "Access denied" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
