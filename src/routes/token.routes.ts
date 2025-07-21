import { Router } from "express";
import { refresh, revoke } from "../controllers/token.controller.ts";

const tokenRouter = Router();

tokenRouter.post("/refresh", refresh);

tokenRouter.post("/revoke", revoke);
export default tokenRouter;