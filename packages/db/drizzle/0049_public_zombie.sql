ALTER TABLE "client" ADD COLUMN "started_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- Existing rows backfilled to `now()` by the DEFAULT above, which is wrong for every
-- client that already existed before this column did — their real start date is the
-- day their row was created, not today.
UPDATE "client" SET "started_at" = "created_at";