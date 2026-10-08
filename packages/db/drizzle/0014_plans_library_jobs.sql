CREATE TYPE "public"."job_status" AS ENUM('queued', 'running', 'done', 'failed');--> statement-breakpoint
CREATE TYPE "public"."image_status" AS ENUM('none', 'queued', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."movement_pattern" AS ENUM('squat', 'hinge', 'push_horizontal', 'push_vertical', 'pull_horizontal', 'pull_vertical', 'lunge', 'carry', 'core', 'cardio', 'mobility');--> statement-breakpoint
CREATE TYPE "public"."meal_slot" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');--> statement-breakpoint
CREATE TYPE "public"."plan_source" AS ENUM('ai', 'coach');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('generating', 'proposed', 'active', 'superseded', 'failed');--> statement-breakpoint
CREATE TABLE "job" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "job_status" DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"locked_by" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	CONSTRAINT "job_attempts_sane" CHECK ("job"."attempts" >= 0 and "job"."attempts" <= "job"."max_attempts"),
	CONSTRAINT "job_finished_matches_status" CHECK (("job"."finished_at" is null) = ("job"."status" in ('queued', 'running')))
);
--> statement-breakpoint
CREATE TABLE "exercise" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pattern" "movement_pattern" NOT NULL,
	"muscle" text NOT NULL,
	"equipment" text NOT NULL,
	"video_url" text,
	"cues" text,
	"studio_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "food_request" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"times_requested" integer DEFAULT 1 NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"home_measure" text NOT NULL,
	"grams" real NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	"tags" text[] NOT NULL,
	"slots" text[] NOT NULL,
	"recipe" text,
	"image_url" text,
	"image_status" "image_status" DEFAULT 'none' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "food_macros_account_for_kcal" CHECK (abs(("food"."protein_g" * 4 + "food"."carbs_g" * 4 + "food"."fat_g" * 9) - "food"."kcal") <= greatest(25, "food"."kcal" * 0.15)),
	CONSTRAINT "food_kcal_sane" CHECK ("food"."kcal" between 1 and 2000),
	CONSTRAINT "food_grams_sane" CHECK ("food"."grams" between 1 and 2000)
);
--> statement-breakpoint
CREATE TABLE "diet_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"week_start" text NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" integer NOT NULL,
	"carbs_g" integer NOT NULL,
	"fat_g" integer NOT NULL,
	"status" "plan_status" DEFAULT 'generating' NOT NULL,
	"source" "plan_source" NOT NULL,
	"generated_from" jsonb,
	"approved_by" text,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diet_plan_approval_complete" CHECK (("diet_plan"."approved_by" is null) = ("diet_plan"."approved_at" is null))
);
--> statement-breakpoint
CREATE TABLE "meal_item" (
	"id" text PRIMARY KEY NOT NULL,
	"meal_id" text NOT NULL,
	"food_id" text NOT NULL,
	"quantity" real NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	CONSTRAINT "meal_item_quantity_sane" CHECK ("meal_item"."quantity" > 0 and "meal_item"."quantity" <= 20)
);
--> statement-breakpoint
CREATE TABLE "meal_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"meal_id" text NOT NULL,
	"date" text NOT NULL,
	"ate" boolean DEFAULT true NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal" (
	"id" text PRIMARY KEY NOT NULL,
	"diet_plan_id" text NOT NULL,
	"day_index" integer NOT NULL,
	"slot" "meal_slot" NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "meal_day_sane" CHECK ("meal"."day_index" between 0 and 6)
);
--> statement-breakpoint
CREATE TABLE "training_session" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"workout_day_id" text,
	"date" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "set_log" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"workout_item_id" text,
	"set_number" integer NOT NULL,
	"reps" integer,
	"load_kg" real,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "set_log_reps_sane" CHECK ("set_log"."reps" is null or "set_log"."reps" between 0 and 1000),
	CONSTRAINT "set_log_load_sane" CHECK ("set_log"."load_kg" is null or "set_log"."load_kg" between 0 and 1000)
);
--> statement-breakpoint
CREATE TABLE "workout_day" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"week_index" integer NOT NULL,
	"is_deload" boolean DEFAULT false NOT NULL,
	"day_of_week" integer NOT NULL,
	"title" text NOT NULL,
	"is_rest" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_day_week_sane" CHECK ("workout_day"."week_index" between 0 and 15),
	CONSTRAINT "workout_day_dow_sane" CHECK ("workout_day"."day_of_week" between 0 and 6)
);
--> statement-breakpoint
CREATE TABLE "workout_item" (
	"id" text PRIMARY KEY NOT NULL,
	"day_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"position" integer NOT NULL,
	"sets" integer NOT NULL,
	"reps" text NOT NULL,
	"load_hint" text,
	"rpe" real,
	"rest_seconds" integer,
	"note" text,
	CONSTRAINT "workout_item_sets_sane" CHECK ("workout_item"."sets" between 1 and 20),
	CONSTRAINT "workout_item_rpe_sane" CHECK ("workout_item"."rpe" is null or "workout_item"."rpe" between 1 and 10)
);
--> statement-breakpoint
CREATE TABLE "workout_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"start_date" text NOT NULL,
	"weeks" integer DEFAULT 8 NOT NULL,
	"status" "plan_status" DEFAULT 'generating' NOT NULL,
	"source" "plan_source" NOT NULL,
	"generated_from" jsonb,
	"approved_by" text,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_plan_weeks_sane" CHECK ("workout_plan"."weeks" between 1 and 16),
	CONSTRAINT "workout_plan_approval_complete" CHECK (("workout_plan"."approved_by" is null) = ("workout_plan"."approved_at" is null))
);
--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diet_plan" ADD CONSTRAINT "diet_plan_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diet_plan" ADD CONSTRAINT "diet_plan_approved_by_membership_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_item" ADD CONSTRAINT "meal_item_meal_id_meal_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_item" ADD CONSTRAINT "meal_item_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_log" ADD CONSTRAINT "meal_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_log" ADD CONSTRAINT "meal_log_meal_id_meal_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal" ADD CONSTRAINT "meal_diet_plan_id_diet_plan_id_fk" FOREIGN KEY ("diet_plan_id") REFERENCES "public"."diet_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_workout_day_id_workout_day_id_fk" FOREIGN KEY ("workout_day_id") REFERENCES "public"."workout_day"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_session_id_training_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_workout_item_id_workout_item_id_fk" FOREIGN KEY ("workout_item_id") REFERENCES "public"."workout_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_day" ADD CONSTRAINT "workout_day_plan_id_workout_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_item" ADD CONSTRAINT "workout_item_day_id_workout_day_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."workout_day"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_item" ADD CONSTRAINT "workout_item_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plan" ADD CONSTRAINT "workout_plan_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plan" ADD CONSTRAINT "workout_plan_approved_by_membership_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_claim_idx" ON "job" USING btree ("run_after") WHERE "job"."status" = 'queued';--> statement-breakpoint
CREATE INDEX "job_kind_idx" ON "job" USING btree ("kind","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_name_key" ON "exercise" USING btree ("name","studio_id") WHERE "exercise"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "exercise_pattern_idx" ON "exercise" USING btree ("pattern","equipment");--> statement-breakpoint
CREATE UNIQUE INDEX "food_request_name_key" ON "food_request" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "food_name_key" ON "food" USING btree ("name") WHERE "food"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "food_image_idx" ON "food" USING btree ("image_status") WHERE "food"."image_status" <> 'ready';--> statement-breakpoint
CREATE INDEX "diet_plan_client_idx" ON "diet_plan" USING btree ("client_id","week_start");--> statement-breakpoint
CREATE UNIQUE INDEX "diet_plan_active_key" ON "diet_plan" USING btree ("client_id") WHERE "diet_plan"."status" = 'active';--> statement-breakpoint
CREATE INDEX "meal_item_meal_idx" ON "meal_item" USING btree ("meal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "meal_log_day_key" ON "meal_log" USING btree ("user_id","meal_id","date");--> statement-breakpoint
CREATE INDEX "meal_plan_day_idx" ON "meal" USING btree ("diet_plan_id","day_index");--> statement-breakpoint
CREATE INDEX "training_session_client_idx" ON "training_session" USING btree ("client_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "set_log_slot_key" ON "set_log" USING btree ("session_id","workout_item_id","set_number");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_day_slot_key" ON "workout_day" USING btree ("plan_id","week_index","day_of_week");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_item_position_key" ON "workout_item" USING btree ("day_id","position");--> statement-breakpoint
CREATE INDEX "workout_item_exercise_idx" ON "workout_item" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "workout_plan_client_idx" ON "workout_plan" USING btree ("client_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_plan_active_key" ON "workout_plan" USING btree ("client_id") WHERE "workout_plan"."status" = 'active';