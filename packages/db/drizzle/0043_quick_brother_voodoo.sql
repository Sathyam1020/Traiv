CREATE TABLE "client_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"birth_date" date,
	"time_zone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"units" text DEFAULT 'metric' NOT NULL,
	"height_cm" real,
	"notifications" jsonb DEFAULT '{"chat":true,"checkIns":true,"content":true,"community":true,"messageEmail":false,"campaignEmail":true}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_connection" (
	"client_id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"last_synced_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "health_workout" (
	"client_id" text NOT NULL,
	"external_id" text NOT NULL,
	"provider" text NOT NULL,
	"type" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone NOT NULL,
	"duration" integer NOT NULL,
	"calories" real,
	"source" text,
	CONSTRAINT "health_workout_client_id_external_id_pk" PRIMARY KEY("client_id","external_id")
);
--> statement-breakpoint
CREATE TABLE "notification_delivery" (
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_delivery_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "push_subscription" (
	"endpoint" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_steps" ADD COLUMN "source" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_settings" ADD CONSTRAINT "client_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_connection" ADD CONSTRAINT "health_connection_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_workout" ADD CONSTRAINT "health_workout_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_delivery" ADD CONSTRAINT "notification_delivery_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscription" ADD CONSTRAINT "push_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;