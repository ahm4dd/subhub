import { Router } from "express";
import { isValidCurrency } from "../services/currencyService";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "GET all subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "GET subscription details" });
});
subscriptionRouter.post("/", async (req, res) => {
  const { currency, price } = req.body;
  if (!currency || !(await isValidCurrency(currency))) {
    return res.status(400).json({ error: "Invalid or missing currency code." });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "Invalid price. Must be a positive number." });
  }
  res.send({ title: "CREATE subscription" });
});
subscriptionRouter.put("/", async (req, res) => {
  const { currency, price } = req.body;
  if (currency && !(await isValidCurrency(currency))) {
    return res.status(400).json({ error: "Invalid currency code." });
  }
  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return res.status(400).json({ error: "Invalid price. Must be a positive number." });
  }
  res.send({ title: "UPDATE subscription" });
});
subscriptionRouter.delete("/", (req, res) => {
  res.send({ title: "DELETE subscription" });
});
subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({ title: "GET all user subscriptions" });
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "CANCEL subscription" });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "GET all upcoming renewals" });
});
export default subscriptionRouter;
