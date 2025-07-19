CREATE TABLE "refresh_tokens" (
	"token" varchar(256) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"user_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"currency" varchar DEFAULT 'USD',
	"frequency" varchar,
	"status" varchar DEFAULT 'active' NOT NULL,
	"category" varchar NOT NULL,
	"payment_method" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"renewal_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currency_check" CHECK ("subscriptions"."currency" IN ('USD', 'EUR', 'GDP')),
	CONSTRAINT "name_length_check" CHECK (LENGTH("subscriptions"."name") > 2),
	CONSTRAINT "price_check" CHECK ("subscriptions"."price" > 0 AND "subscriptions"."price" < 100),
	CONSTRAINT "frequency_check" CHECK ("subscriptions"."frequency" IN ('daily', 'weekly', 'monthly', 'yearly')),
	CONSTRAINT "category_check" CHECK ("subscriptions"."category" IN ('sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other')),
	CONSTRAINT "status_check" CHECK ("subscriptions"."status" IN ('active', 'cancelled', 'expired')),
	CONSTRAINT "start_date_check" CHECK ("subscriptions"."start_date" < NOW()),
	CONSTRAINT "renewal_date_check" CHECK ("subscriptions"."renewal_date" > "subscriptions"."start_date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "name_length_check" CHECK (LENGTH("users"."name") > 2)
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;