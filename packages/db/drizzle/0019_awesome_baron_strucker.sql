ALTER TABLE "training_session" DROP CONSTRAINT IF EXISTS "training_session_workout_day_id_workout_day_id_fk";--> statement-breakpoint
ALTER TABLE "set_log" DROP CONSTRAINT IF EXISTS "set_log_workout_item_id_workout_item_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "set_log_slot_key";--> statement-breakpoint
ALTER TABLE "training_session" DROP COLUMN IF EXISTS "workout_day_id";--> statement-breakpoint
ALTER TABLE "set_log" DROP COLUMN IF EXISTS "workout_item_id";--> statement-breakpoint
DROP TABLE IF EXISTS "workout_item" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "workout_day" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "workout_plan" CASCADE;
