CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'light', 'moderate', 'very', 'extra');--> statement-breakpoint
CREATE TYPE "public"."diet_type" AS ENUM('vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'jain');--> statement-breakpoint
CREATE TYPE "public"."goal" AS ENUM('lose_fat', 'build_muscle', 'get_stronger', 'maintain', 'improve_fitness', 'general_health');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female', 'undisclosed');--> statement-breakpoint
CREATE TYPE "public"."target_status" AS ENUM('proposed', 'active', 'superseded');--> statement-breakpoint
CREATE TYPE "public"."training_experience" AS ENUM('new', 'some', 'experienced');--> statement-breakpoint
CREATE TABLE "body_metric" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	"weight_kg" real NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "body_metric_weight_sane" CHECK ("body_metric"."weight_kg" between 25 and 400)
);
--> statement-breakpoint
CREATE TABLE "nutrition_target" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" integer NOT NULL,
	"carbs_g" integer NOT NULL,
	"fat_g" integer NOT NULL,
	"basis" jsonb NOT NULL,
	"review_reasons" text[],
	"status" "target_status" DEFAULT 'proposed' NOT NULL,
	"created_by" text NOT NULL,
	"approved_by" text,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutrition_target_kcal_sane" CHECK ("nutrition_target"."kcal" between 800 and 8000),
	CONSTRAINT "nutrition_target_approval_complete" CHECK (("nutrition_target"."approved_by" is null) = ("nutrition_target"."approved_at" is null))
);
--> statement-breakpoint
CREATE TABLE "user_intake" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"goal" "goal",
	"target_weight_kg" real,
	"sex" "sex",
	"birth_year" integer,
	"height_cm" real,
	"daily_activity" "activity_level",
	"experience" "training_experience",
	"days_per_week" integer,
	"session_minutes" integer,
	"equipment" text[],
	"diet" "diet_type",
	"allergies" text,
	"dislikes" text,
	"meals_per_day" integer,
	"health_flags" text[],
	"health_note" text,
	"training_days" text[],
	"preferred_time" text,
	"last_step" integer,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "intake_height_sane" CHECK ("user_intake"."height_cm" is null or "user_intake"."height_cm" between 90 and 250),
	CONSTRAINT "intake_target_weight_sane" CHECK ("user_intake"."target_weight_kg" is null or "user_intake"."target_weight_kg" between 25 and 400),
	CONSTRAINT "intake_birth_year_sane" CHECK ("user_intake"."birth_year" is null or "user_intake"."birth_year" between 1900 and 2100),
	CONSTRAINT "intake_days_sane" CHECK ("user_intake"."days_per_week" is null or "user_intake"."days_per_week" between 1 and 7),
	CONSTRAINT "intake_session_sane" CHECK ("user_intake"."session_minutes" is null or "user_intake"."session_minutes" between 10 and 240),
	CONSTRAINT "intake_meals_sane" CHECK ("user_intake"."meals_per_day" is null or "user_intake"."meals_per_day" between 1 and 8),
	CONSTRAINT "intake_last_step_sane" CHECK ("user_intake"."last_step" is null or "user_intake"."last_step" between 1 and 6)
);
--> statement-breakpoint
ALTER TABLE "body_metric" ADD CONSTRAINT "body_metric_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_target" ADD CONSTRAINT "nutrition_target_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_target" ADD CONSTRAINT "nutrition_target_approved_by_membership_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_intake" ADD CONSTRAINT "user_intake_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "body_metric_user_taken_idx" ON "body_metric" USING btree ("user_id","taken_at");--> statement-breakpoint
CREATE UNIQUE INDEX "body_metric_intake_key" ON "body_metric" USING btree ("user_id") WHERE "body_metric"."source" = 'intake';--> statement-breakpoint
CREATE INDEX "nutrition_target_user_idx" ON "nutrition_target" USING btree ("user_id","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "nutrition_target_active_key" ON "nutrition_target" USING btree ("user_id") WHERE "nutrition_target"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "user_intake_user_key" ON "user_intake" USING btree ("user_id");