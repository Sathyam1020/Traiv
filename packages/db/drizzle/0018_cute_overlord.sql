CREATE TYPE "public"."check_in_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."metric_type" AS ENUM('number', 'text', 'image', 'rating');--> statement-breakpoint
CREATE TABLE "check_in_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"check_in_id" text NOT NULL,
	"metric_id" text NOT NULL,
	"number_value" real,
	"text_value" text,
	"rating_value" integer,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "check_in_answer_one_value" CHECK (("check_in_answer"."number_value" is not null)::int + ("check_in_answer"."text_value" is not null)::int
          + ("check_in_answer"."rating_value" is not null)::int + ("check_in_answer"."image_url" is not null)::int = 1),
	CONSTRAINT "check_in_answer_rating_range" CHECK ("check_in_answer"."rating_value" is null or "check_in_answer"."rating_value" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"due_on" date NOT NULL,
	"closes_on" date NOT NULL,
	"status" "check_in_status" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "check_in_window_sane" CHECK ("check_in"."closes_on" >= "check_in"."due_on"),
	CONSTRAINT "check_in_completion_complete" CHECK (("check_in"."status" = 'completed') = ("check_in"."completed_at" is not null))
);
--> statement-breakpoint
CREATE TABLE "metric" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" "metric_type" NOT NULL,
	"unit" text,
	"unit_category" text,
	"position" integer DEFAULT 0 NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metric_code_shape" CHECK ("metric"."code" ~ '^[a-z][a-z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "check_in_weekday" integer;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "check_in_grace_days" integer;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "check_ins_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "studio" ADD COLUMN "check_in_weekday" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "studio" ADD COLUMN "check_in_grace_days" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "check_in_answer" ADD CONSTRAINT "check_in_answer_check_in_id_check_in_id_fk" FOREIGN KEY ("check_in_id") REFERENCES "public"."check_in"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_answer" ADD CONSTRAINT "check_in_answer_metric_id_metric_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric" ADD CONSTRAINT "metric_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "check_in_answer_key" ON "check_in_answer" USING btree ("check_in_id","metric_id");--> statement-breakpoint
CREATE INDEX "check_in_answer_metric_idx" ON "check_in_answer" USING btree ("metric_id");--> statement-breakpoint
CREATE UNIQUE INDEX "check_in_due_key" ON "check_in" USING btree ("client_id","due_on");--> statement-breakpoint
CREATE INDEX "check_in_client_due_idx" ON "check_in" USING btree ("client_id","due_on");--> statement-breakpoint
CREATE UNIQUE INDEX "metric_code_key" ON "metric" USING btree ("code","studio_id");--> statement-breakpoint
CREATE INDEX "metric_studio_idx" ON "metric" USING btree ("studio_id");--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_checkin_weekday" CHECK ("client"."check_in_weekday" is null or "client"."check_in_weekday" between 0 and 6);--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_checkin_grace" CHECK ("client"."check_in_grace_days" is null or "client"."check_in_grace_days" between 1 and 60);--> statement-breakpoint
ALTER TABLE "studio" ADD CONSTRAINT "studio_checkin_weekday" CHECK ("studio"."check_in_weekday" between 0 and 6);--> statement-breakpoint
ALTER TABLE "studio" ADD CONSTRAINT "studio_checkin_grace" CHECK ("studio"."check_in_grace_days" between 1 and 60);