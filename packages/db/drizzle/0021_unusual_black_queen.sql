ALTER TABLE "collection_assignment" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "collection_item" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "collection" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "item_set" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "saved_section" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "section_item" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "template_assignment" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "workout_section" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "workout_template" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "training_session" DROP CONSTRAINT IF EXISTS "training_session_template_id_workout_template_id_fk";
--> statement-breakpoint
ALTER TABLE "set_log" DROP CONSTRAINT IF EXISTS "set_log_item_id_section_item_id_fk";
--> statement-breakpoint
ALTER TABLE "set_log" DROP CONSTRAINT IF EXISTS "set_log_item_set_id_item_set_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "image_url" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "description" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "secondary_muscles" text[];
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "stimulus" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "level" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "category" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "location" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "injury_risk" text;
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "default_fields" text[] DEFAULT '{"weight","reps","rest"}'::text[] NOT NULL;
--> statement-breakpoint
ALTER TABLE "training_session" DROP COLUMN IF EXISTS "template_id";
--> statement-breakpoint
ALTER TABLE "set_log" DROP COLUMN IF EXISTS "item_id";
--> statement-breakpoint
ALTER TABLE "set_log" DROP COLUMN IF EXISTS "item_set_id";
--> statement-breakpoint
ALTER TABLE "set_log" DROP COLUMN IF EXISTS "type";
--> statement-breakpoint
DROP INDEX IF EXISTS "training_session_template_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "set_log_slot_key";
--> statement-breakpoint
DROP INDEX IF EXISTS "set_log_item_idx";
--> statement-breakpoint
DROP TABLE IF EXISTS "collection_assignment" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "collection_item" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "collection" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "item_set" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "saved_section" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "section_item" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "template_assignment" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "workout_section" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "workout_template" CASCADE;
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."set_type";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."template_source";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."template_status";
