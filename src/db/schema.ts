import {
  integer,
  pgTable,
  varchar,
  uuid,
  check,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email").unique().notNull(),
    passwordHash: varchar("password_hash").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [check("name_length_check", sql`LENGTH(${table.name}) > 2`)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    price: integer("price").notNull(),
    currency: varchar("currency").default("USD"),
    frequency: varchar("frequency"),
    status: varchar("status").notNull().default("active"),
    category: varchar("category").notNull(),
    paymentMethod: varchar("payment_method").notNull(),
    startDate: timestamp("start_date").notNull(),
    renewalDate: timestamp("renewal_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("currency_check", sql`${table.currency} IN ('USD', 'EUR', 'GDP')`),
    check("name_length_check", sql`LENGTH(${table.name}) > 2`),
    check("price_check", sql`${table.price} > 0 AND ${table.price} < 100`),
    check(
      "frequency_check",
      sql`${table.frequency} IN ('daily', 'weekly', 'monthly', 'yearly')`,
    ),
    check(
      "category_check",
      sql`${table.category} IN ('sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other')`,
    ),
    check(
      "status_check",
      sql`${table.status} IN ('active', 'cancelled', 'expired')`,
    ),
    check("start_date_check", sql`${table.startDate} < NOW()`),
    check("renewal_date_check", sql`${table.renewalDate} > ${table.startDate}`),
  ],
);

export type NewSubscription = typeof subscriptions.$inferInsert;
export type NewUser = typeof users.$inferInsert;

export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
