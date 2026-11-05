CREATE TABLE "client_feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"studio_id" text,
	"client_id" text,
	"message" text NOT NULL,
	"app_version" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_feedback" ADD CONSTRAINT "client_feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_feedback" ADD CONSTRAINT "client_feedback_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_feedback" ADD CONSTRAINT "client_feedback_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_feedback_created_idx" ON "client_feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "client_feedback_user_idx" ON "client_feedback" USING btree ("user_id","created_at");