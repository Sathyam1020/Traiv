CREATE TYPE "public"."otp_transport" AS ENUM('whatsapp', 'sms', 'console');--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD COLUMN "transport" "otp_transport";--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD COLUMN "sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD COLUMN "send_error" text;