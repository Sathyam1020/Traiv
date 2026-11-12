CREATE TABLE "operational_event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"route" text,
	"status_code" integer,
	"duration_ms" integer,
	"job_kind" text,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "studio_activity_summary" (
	"studio_id" text PRIMARY KEY NOT NULL,
	"last_login_at" timestamp with time zone,
	"active_client_count" integer DEFAULT 0 NOT NULL,
	"recent_workout_activity_at" timestamp with time zone,
	"health_score" integer,
	"health_score_explanation" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "studio_activity_summary" ADD CONSTRAINT "studio_activity_summary_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "operational_event_time_idx" ON "operational_event" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "operational_event_route_idx" ON "operational_event" USING btree ("route","received_at");