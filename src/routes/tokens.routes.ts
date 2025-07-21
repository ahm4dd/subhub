import { Router } from "express";

const tokenRouter = Router();

tokenRouter.post("/refresh", (req, res) => {
    res.send({ title: "POST refresh token" });
})

tokenRouter.post("/revoke", (req, res) => {
    res.send({ title: "POST revoke token" });
})
export default tokenRouter;