import { Request, Response, NextFunction } from "express";
import { createSubscription } from "../db/queries/subscriptions.ts";
import { Subscription, NewSubscription } from "../db/schema.ts";
import { AuthorizationError, BadRequestError, NotFoundError, DatabaseError, ServerError} from "../errors.ts";
import { getUserById } from "../db/queries/users.ts";
import { authenticateToken, extractBearerToken, verifyJWT } from "../security/auth.ts";
import { serverConfig } from "../config.ts";

export async function createSubscriptionHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        if (req.body.name && req.body.price && req.body.category && req.body.startDate && req.body.userId && req.body.paymentMethod) {

            
            const authenticated = authenticateToken(req, serverConfig.JWT_SECRET);
            if (authenticated === false) {
                throw new AuthorizationError("Not authorized to create subscription!");
            }

            const userId = authenticated as string;

            if (req.body.userId !== userId) {
                throw new AuthorizationError("Not authorized to create subscription!");
            }
            
            const user = await getUserById(userId);
            if (!user) {
                throw new NotFoundError("User not found!");
            }
            
            const subscription: Omit<NewSubscription, "renewalDate" | "status"> & { renewalDate?: Date } = req.body;
            const newSubscription: Subscription = await createSubscription(subscription);
            
            if (!newSubscription) {
                throw new ServerError("Could not create subscription!");
            }
            
            res.status(201).json(newSubscription);
        } else {
            throw new BadRequestError("Invalid subscription data!");
        }

    } catch (error) {
        next(error);
    }
}