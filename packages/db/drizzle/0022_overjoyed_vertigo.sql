CREATE TYPE "public"."template_source" AS ENUM('coach', 'client');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'active');--> statement-breakpoint
CREATE TABLE "exercise_set" (
	"id" text PRIMARY KEY NOT NULL,
	"session_exercise_id" text NOT NULL,
	"position" integer NOT NULL,
	"reps" integer,
	"reps_max" integer,
	"weight_kg" real,
	"seconds" integer,
	"distance_m" real,
	"calories" integer,
	"rest_seconds" integer,
	CONSTRAINT "exercise_set_rep_range_sane" CHECK ("exercise_set"."reps_max" is null or "exercise_set"."reps" is null or "exercise_set"."reps_max" >= "exercise_set"."reps"),
	CONSTRAINT "exercise_set_reps_sane" CHECK ("exercise_set"."reps" is null or "exercise_set"."reps" between 0 and 1000),
	CONSTRAINT "exercise_set_weight_sane" CHECK ("exercise_set"."weight_kg" is null or "exercise_set"."weight_kg" between 0 and 1000)
);
--> statement-breakpoint
CREATE TABLE "saved_section" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"name" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_exercise" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"position" integer NOT NULL,
	"fields" text[] DEFAULT '{}'::text[] NOT NULL,
	"superset_group" integer,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "workout_session" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_template" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"client_id" text,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"status" "template_status" DEFAULT 'draft' NOT NULL,
	"source" "template_source" DEFAULT 'coach' NOT NULL,
	"default_values" jsonb,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "workout_session_id" text;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "session_exercise_id" text;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "exercise_set_id" text;--> statement-breakpoint
ALTER TABLE "exercise_set" ADD CONSTRAINT "exercise_set_session_exercise_id_session_exercise_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_section" ADD CONSTRAINT "saved_section_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercise" ADD CONSTRAINT "session_exercise_session_id_workout_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercise" ADD CONSTRAINT "session_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_template_id_workout_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_created_by_membership_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_set_position_key" ON "exercise_set" USING btree ("session_exercise_id","position");--> statement-breakpoint
CREATE INDEX "saved_section_studio_idx" ON "saved_section" USING btree ("studio_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_exercise_position_key" ON "session_exercise" USING btree ("session_id","position");--> statement-breakpoint
CREATE INDEX "session_exercise_exercise_idx" ON "session_exercise" USING btree ("exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_session_position_key" ON "workout_session" USING btree ("template_id","position");--> statement-breakpoint
CREATE INDEX "workout_template_studio_idx" ON "workout_template" USING btree ("studio_id","status");--> statement-breakpoint
CREATE INDEX "workout_template_client_idx" ON "workout_template" USING btree ("client_id");--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_session_exercise_id_session_exercise_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercise"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_exercise_set_id_exercise_set_id_fk" FOREIGN KEY ("exercise_set_id") REFERENCES "public"."exercise_set"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "training_session_workout_idx" ON "training_session" USING btree ("workout_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "set_log_slot_key" ON "set_log" USING btree ("session_id","session_exercise_id","set_number");--> statement-breakpoint
CREATE INDEX "set_log_exercise_idx" ON "set_log" USING btree ("session_exercise_id");