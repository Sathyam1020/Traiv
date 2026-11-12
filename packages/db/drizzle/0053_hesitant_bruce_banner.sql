CREATE TABLE "acquisition_attribution" (
	"user_id" text PRIMARY KEY NOT NULL,
	"first_touch_source" text,
	"first_touch_medium" text,
	"first_touch_campaign" text,
	"first_touch_at" timestamp with time zone,
	"last_touch_source" text,
	"last_touch_medium" text,
	"last_touch_campaign" text,
	"last_touch_at" timestamp with time zone,
	"endorser_code" text,
	"attributed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_app" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "funnel_definition" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"steps" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acquisition_attribution" ADD CONSTRAINT "acquisition_attribution_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_session" ADD CONSTRAINT "analytics_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_session_user_idx" ON "analytics_session" USING btree ("user_id","started_at");
--> statement-breakpoint
-- The Phase 2 additions to the event catalog (docs/analytics/event-taxonomy.md) — a
-- human-browsable reference, not read at ingestion time.
INSERT INTO "event_definition" ("name", "business_purpose", "privacy_class") VALUES
	('session_started', 'DAU/WAU, session counting', 'operational'),
	('business_name_confirmed', 'Funnel step', 'operational'),
	('client_invited', 'Funnel step (undercounts — see risks-and-open-questions.md)', 'operational'),
	('workout_template_created', 'Feature adoption, library templates', 'operational'),
	('workout_assigned_to_client', 'Activation signal, a template attached to a client', 'operational'),
	('workout_session_started', 'Engagement', 'operational'),
	('check_in_schedule_set', 'Feature adoption', 'operational'),
	('recipe_created', 'Feature adoption', 'operational'),
	('mealplan_created', 'Feature adoption', 'operational'),
	('roster_status_changed', 'Engagement signal', 'operational'),
	('referral_code_created', 'Growth funnel input', 'operational'),
	('referral_attributed', 'Referral conversion, authoritative', 'operational'),
	('meal_logged', 'Engagement — category only, never the logged value', 'sensitive'),
	('measurement_logged', 'Engagement — category only, never the logged value', 'sensitive')
ON CONFLICT ("name") DO NOTHING;