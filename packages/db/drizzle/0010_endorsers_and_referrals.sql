CREATE TABLE "endorser" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "referral" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"endorser_id" text NOT NULL,
	"code_used" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD COLUMN "pending_endorser_code" text;--> statement-breakpoint
ALTER TABLE "endorser" ADD CONSTRAINT "endorser_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral" ADD CONSTRAINT "referral_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral" ADD CONSTRAINT "referral_endorser_id_endorser_id_fk" FOREIGN KEY ("endorser_id") REFERENCES "public"."endorser"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "endorser_user_key" ON "endorser" USING btree ("user_id") WHERE "endorser"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "endorser_code_key" ON "endorser" USING btree ("code") WHERE "endorser"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "referral_studio_key" ON "referral" USING btree ("studio_id");--> statement-breakpoint
CREATE INDEX "referral_endorser_idx" ON "referral" USING btree ("endorser_id","created_at");