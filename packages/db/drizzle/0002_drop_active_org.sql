CREATE TYPE "public"."membership_role" AS ENUM('owner', 'coach');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'invited', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."studio_status" AS ENUM('active', 'past_due', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."studio_tier" AS ENUM('free', 'starter', 'pro', 'studio');--> statement-breakpoint
CREATE TABLE "membership" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "membership_role" DEFAULT 'coach' NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "studio" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tier" "studio_tier" DEFAULT 'free' NOT NULL,
	"status" "studio_status" DEFAULT 'active' NOT NULL,
	"brand_display_name" text,
	"brand_logo_url" text,
	"brand_color" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "membership_studio_user_key" ON "membership" USING btree ("studio_id","user_id");--> statement-breakpoint
CREATE INDEX "membership_user_idx" ON "membership" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "membership_studio_idx" ON "membership" USING btree ("studio_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "studio_slug_key" ON "studio" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "active_org_id";