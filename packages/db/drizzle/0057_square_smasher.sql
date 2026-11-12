ALTER TYPE "public"."challenge_purpose" ADD VALUE 'email_verify';--> statement-breakpoint
ALTER TYPE "public"."otp_transport" ADD VALUE 'email';--> statement-breakpoint
CREATE UNIQUE INDEX "auth_challenge_live_email_key" ON "auth_challenge" USING btree ("email","purpose") WHERE "auth_challenge"."consumed_at" is null and "auth_challenge"."email" is not null;--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD CONSTRAINT "auth_challenge_email_format" CHECK ("auth_challenge"."email" is null or "auth_challenge"."email" ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$');