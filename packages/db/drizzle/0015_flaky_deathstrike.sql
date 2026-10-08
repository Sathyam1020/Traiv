CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "analytics_event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"visitor" text NOT NULL,
	"path" text NOT NULL,
	"referrer_host" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"device" text,
	"browser" text,
	"os" text,
	"props" jsonb,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_salt" (
	"day" text PRIMARY KEY NOT NULL,
	"salt" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"cover_url" text,
	"cover_alt" text,
	"author_name" text DEFAULT 'Traiv' NOT NULL,
	"read_minutes" integer DEFAULT 1 NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_published_has_a_date" CHECK (("post"."status" = 'published') = ("post"."published_at" is not null)),
	CONSTRAINT "post_slug_shape" CHECK ("post"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"phone" text,
	"name" text,
	"intent" text DEFAULT 'signup' NOT NULL,
	"source" text,
	"path" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"announcements" boolean DEFAULT false NOT NULL,
	"notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_has_a_contact" CHECK ("waitlist"."email" is not null or "waitlist"."phone" is not null)
);
--> statement-breakpoint
CREATE INDEX "analytics_time_idx" ON "analytics_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_name_time_idx" ON "analytics_event" USING btree ("name","created_at");--> statement-breakpoint
CREATE INDEX "analytics_path_time_idx" ON "analytics_event" USING btree ("path","created_at");--> statement-breakpoint
CREATE INDEX "analytics_visitor_idx" ON "analytics_event" USING btree ("visitor","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "post_slug_key" ON "post" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_published_idx" ON "post" USING btree ("published_at") WHERE "post"."status" = 'published';--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist" USING btree ("email") WHERE "waitlist"."email" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_phone_key" ON "waitlist" USING btree ("phone") WHERE "waitlist"."phone" is not null;--> statement-breakpoint
CREATE INDEX "waitlist_created_idx" ON "waitlist" USING btree ("created_at");