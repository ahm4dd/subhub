import { db } from "../index.ts"; // Your configured Drizzle instance
import { subscriptions, NewSubscription } from "../schema.ts";

export async function createSubscription(
  data: Omit<NewSubscription, "renewalDate" | "status"> & {
    renewalDate?: Date;
  },
) {
  const subscriptionToSave: NewSubscription = {
    ...data,
    status: "active",
    renewalDate: data.renewalDate || null,
  };

  if (!subscriptionToSave.renewalDate) {
    const renewalPeriodsInDays = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const newRenewalDate = new Date(subscriptionToSave.startDate);
    newRenewalDate.setDate(
      newRenewalDate.getDate() +
        renewalPeriodsInDays[
          subscriptionToSave.frequency as keyof typeof renewalPeriodsInDays
        ],
    );
    subscriptionToSave.renewalDate = newRenewalDate;
  }

  if (subscriptionToSave.renewalDate < new Date()) {
    subscriptionToSave.status = "expired";
  }

  const [newSubscription] = await db
    .insert(subscriptions)
    .values(subscriptionToSave)
    .returning();

  return newSubscription;
}
