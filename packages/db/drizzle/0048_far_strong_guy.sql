CREATE TYPE "public"."work_activity_level" AS ENUM('sedentary', 'light', 'moderate', 'heavy', 'very_heavy');--> statement-breakpoint
ALTER TABLE "user_intake" DROP CONSTRAINT "intake_last_step_sane";--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "worked_with_coach" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "typical_day" text;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "work_activity" "work_activity_level";--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "training_locations" text[];--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "excluded_ingredients" text[];--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "ed_induce_vomiting" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "ed_food_dominates" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "ed_recent_weight_loss" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "ed_body_image_mismatch" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "ed_loss_of_control" boolean;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "dietary_tags" text[];--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "additional_nutrition_notes" text;--> statement-breakpoint
ALTER TABLE "user_intake" ADD COLUMN "other_notes" text;--> statement-breakpoint
ALTER TABLE "user_intake" ADD CONSTRAINT "intake_last_step_sane" CHECK ("user_intake"."last_step" is null or "user_intake"."last_step" between 1 and 15);