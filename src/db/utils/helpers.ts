export function calculateRenewalDate(
  startDate: Date,
  frequency: "daily" | "weekly" | "monthly" | "yearly" | string | null,
): Date | null {
  if (!frequency || !startDate) {
    return null;
  }

  const renewalDate = new Date(startDate);

  switch (frequency) {
    case "daily":
      renewalDate.setDate(renewalDate.getDate() + 1);
      break;
    case "weekly":
      renewalDate.setDate(renewalDate.getDate() + 7);
      break;
    case "monthly":
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      break;
    case "yearly":
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return renewalDate;
}
