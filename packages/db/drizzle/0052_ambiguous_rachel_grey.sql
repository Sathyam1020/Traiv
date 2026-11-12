CREATE TABLE "analytics_checkpoint" (
	"rollup_name" text PRIMARY KEY NOT NULL,
	"last_processed_day" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_metric_rollup" (
	"day" text NOT NULL,
	"studio_id" text DEFAULT 'platform' NOT NULL,
	"metric" text NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "daily_metric_rollup_day_studio_id_metric_pk" PRIMARY KEY("day","studio_id","metric")
);
--> statement-breakpoint
CREATE TABLE "event_definition" (
	"name" text PRIMARY KEY NOT NULL,
	"business_purpose" text NOT NULL,
	"privacy_class" text NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"deprecated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"studio_id" text,
	"actor_role" text NOT NULL,
	"source_app" text NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"privacy_class" text DEFAULT 'operational' NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_event" ADD CONSTRAINT "product_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_event" ADD CONSTRAINT "product_event_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_metric_rollup_metric_idx" ON "daily_metric_rollup" USING btree ("metric","day");--> statement-breakpoint
CREATE INDEX "product_event_name_time_idx" ON "product_event" USING btree ("name","received_at");--> statement-breakpoint
CREATE INDEX "product_event_studio_time_idx" ON "product_event" USING btree ("studio_id","received_at");--> statement-breakpoint
CREATE INDEX "product_event_user_time_idx" ON "product_event" USING btree ("user_id","received_at");
--> statement-breakpoint
-- The Phase 1 event catalog (docs/analytics/event-taxonomy.md) — a human-browsable
-- reference, not read at ingestion time (that validates against the in-code Zod shapes).
INSERT INTO "event_definition" ("name", "business_purpose", "privacy_class") VALUES
	('signup_completed', 'Funnel step, activation cohort anchor', 'operational'),
	('client_joined', 'Funnel step, trainer-activation signal — the only path that creates a client row', 'operational'),
	('check_in_submitted', 'Core activation metric input', 'operational'),
	('workout_session_completed', 'Weekly-active-clients input, the product''s north-star metric', 'operational'),
	('onboarding_step_completed', 'The funnel for the 15-step client intake', 'operational')
ON CONFLICT ("name") DO NOTHING;