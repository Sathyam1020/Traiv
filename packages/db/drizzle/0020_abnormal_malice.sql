CREATE TYPE "public"."set_type" AS ENUM('weight_reps', 'rep_range_weight', 'amrap_weight', 'time_distance', 'time_weight', 'calories');--> statement-breakpoint
CREATE TYPE "public"."template_source" AS ENUM('coach', 'client');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'active');--> statement-breakpoint
CREATE TABLE "collection_assignment" (
	"collection_id" text NOT NULL,
	"client_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_item" (
	"collection_id" text NOT NULL,
	"template_id" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"status" "template_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_set" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"position" integer NOT NULL,
	"type" "set_type" DEFAULT 'weight_reps' NOT NULL,
	"target_reps" integer,
	"target_reps_max" integer,
	"target_weight_kg" real,
	"target_seconds" integer,
	"target_distance_m" real,
	"target_calories" integer,
	"rest_seconds" integer,
	CONSTRAINT "item_set_rep_range_sane" CHECK ("item_set"."target_reps_max" is null or "item_set"."target_reps" is null or "item_set"."target_reps_max" >= "item_set"."target_reps"),
	CONSTRAINT "item_set_reps_sane" CHECK ("item_set"."target_reps" is null or "item_set"."target_reps" between 0 and 1000),
	CONSTRAINT "item_set_weight_sane" CHECK ("item_set"."target_weight_kg" is null or "item_set"."target_weight_kg" between 0 and 1000)
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
CREATE TABLE "section_item" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"position" integer NOT NULL,
	"superset_group" integer,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "template_assignment" (
	"template_id" text NOT NULL,
	"client_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_by" text
);
--> statement-breakpoint
CREATE TABLE "workout_section" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"rounds" integer,
	CONSTRAINT "workout_section_rounds_sane" CHECK ("workout_section"."rounds" is null or "workout_section"."rounds" between 1 and 20)
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
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "workout_template_source_shape" CHECK (("workout_template"."source" = 'client') = ("workout_template"."client_id" is not null))
);
--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "time_periods" jsonb;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "quality" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "intensity" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_weight_lifted_kg" real;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_reps" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_sets" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_completed_sets" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_distance_m" real;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_seconds" integer;--> statement-breakpoint
ALTER TABLE "training_session" ADD COLUMN "total_calories" integer;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "item_id" text;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "item_set_id" text;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "type" "set_type" DEFAULT 'weight_reps' NOT NULL;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "seconds" integer;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "distance_m" real;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "calories" integer;--> statement-breakpoint
ALTER TABLE "set_log" ADD COLUMN "rest_seconds" integer;--> statement-breakpoint
ALTER TABLE "collection_assignment" ADD CONSTRAINT "collection_assignment_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_assignment" ADD CONSTRAINT "collection_assignment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_template_id_workout_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection" ADD CONSTRAINT "collection_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_set" ADD CONSTRAINT "item_set_item_id_section_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."section_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_section" ADD CONSTRAINT "saved_section_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_item" ADD CONSTRAINT "section_item_section_id_workout_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."workout_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_item" ADD CONSTRAINT "section_item_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_assignment" ADD CONSTRAINT "template_assignment_template_id_workout_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_assignment" ADD CONSTRAINT "template_assignment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_assignment" ADD CONSTRAINT "template_assignment_assigned_by_membership_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_section" ADD CONSTRAINT "workout_section_template_id_workout_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template" ADD CONSTRAINT "workout_template_created_by_membership_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collection_assignment_key" ON "collection_assignment" USING btree ("collection_id","client_id");--> statement-breakpoint
CREATE INDEX "collection_assignment_client_idx" ON "collection_assignment" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_item_key" ON "collection_item" USING btree ("collection_id","template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_item_position_key" ON "collection_item" USING btree ("collection_id","position");--> statement-breakpoint
CREATE INDEX "collection_studio_idx" ON "collection" USING btree ("studio_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "item_set_position_key" ON "item_set" USING btree ("item_id","position");--> statement-breakpoint
CREATE INDEX "saved_section_studio_idx" ON "saved_section" USING btree ("studio_id");--> statement-breakpoint
CREATE UNIQUE INDEX "section_item_position_key" ON "section_item" USING btree ("section_id","position");--> statement-breakpoint
CREATE INDEX "section_item_exercise_idx" ON "section_item" USING btree ("exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "template_assignment_key" ON "template_assignment" USING btree ("template_id","client_id");--> statement-breakpoint
CREATE INDEX "template_assignment_client_idx" ON "template_assignment" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_section_position_key" ON "workout_section" USING btree ("template_id","position");--> statement-breakpoint
CREATE INDEX "workout_template_studio_idx" ON "workout_template" USING btree ("studio_id","status");--> statement-breakpoint
CREATE INDEX "workout_template_client_idx" ON "workout_template" USING btree ("client_id");--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_template_id_workout_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_template"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_item_id_section_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."section_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_log" ADD CONSTRAINT "set_log_item_set_id_item_set_id_fk" FOREIGN KEY ("item_set_id") REFERENCES "public"."item_set"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "training_session_template_idx" ON "training_session" USING btree ("template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "set_log_slot_key" ON "set_log" USING btree ("session_id","item_id","set_number");--> statement-breakpoint
CREATE INDEX "set_log_item_idx" ON "set_log" USING btree ("item_id");--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_quality_sane" CHECK ("training_session"."quality" is null or "training_session"."quality" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_intensity_sane" CHECK ("training_session"."intensity" is null or "training_session"."intensity" between 1 and 5);