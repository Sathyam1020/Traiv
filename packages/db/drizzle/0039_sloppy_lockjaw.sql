CREATE TABLE "client_measurement" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"taken_at" timestamp with time zone NOT NULL,
	"values" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_measurement" ADD CONSTRAINT "client_measurement_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_measurement_date_idx" ON "client_measurement" USING btree ("client_id","taken_at");