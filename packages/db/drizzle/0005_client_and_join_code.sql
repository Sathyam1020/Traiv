CREATE TYPE "public"."client_status" AS ENUM('active', 'paused', 'archived');--> statement-breakpoint
CREATE TABLE "client" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"coach_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"goal" text,
	"constraints" text,
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"joined_via" text,
	"activated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
-- join_code is NOT NULL, and `studio` already has rows. Three phases: add nullable,
-- backfill a unique code per row, then enforce the constraint. Adding it NOT NULL in
-- one step fails on every existing studio.
ALTER TABLE "studio" ADD COLUMN "join_code" text;--> statement-breakpoint

DO $$
DECLARE
  r record;
  alphabet text := '23456789ABCDEFGHJKMNPQRSTVWXYZ';  -- no 0/O/1/I/L/U: these get read aloud and typed
  candidate text;
  i int;
BEGIN
  FOR r IN SELECT id FROM "studio" WHERE "join_code" IS NULL LOOP
    LOOP
      candidate := '';
      FOR i IN 1..8 LOOP
        candidate := candidate || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
      END LOOP;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM "studio" WHERE "join_code" = candidate);
    END LOOP;
    UPDATE "studio" SET "join_code" = candidate WHERE id = r.id;
  END LOOP;
END $$;--> statement-breakpoint

ALTER TABLE "studio" ALTER COLUMN "join_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "studio" ADD COLUMN "join_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_coach_id_membership_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."membership"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "client_studio_user_key" ON "client" USING btree ("studio_id","user_id") WHERE "client"."user_id" is not null and "client"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "client_studio_status_idx" ON "client" USING btree ("studio_id","status");--> statement-breakpoint
CREATE INDEX "client_coach_idx" ON "client" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "client_user_idx" ON "client" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "studio_join_code_key" ON "studio" USING btree ("join_code");