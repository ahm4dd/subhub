import { Router } from "express";
import { refresh } from "../controllers/token.controller.ts";

const tokenRouter = Router();

tokenRouter.post("/refresh", refresh);

tokenRouter.post("/revoke", (req, res) => {
    res.send({ title: "POST revoke token" });
})
export default tokenRouter;