CREATE TYPE "public"."auth_provider" AS ENUM('password', 'google', 'apple', 'phone');--> statement-breakpoint
CREATE TYPE "public"."challenge_purpose" AS ENUM('phone_verify', 'login', 'client_invite', 'password_reset');--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"phone" text,
	"password_hash" text,
	"name" text NOT NULL,
	"avatar_url" text,
	"locale" text DEFAULT 'en-IN' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"phone_verified_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_email_or_phone" CHECK ("user"."email" is not null or "user"."phone" is not null)
);
--> statement-breakpoint
CREATE TABLE "auth_challenge" (
	"id" text PRIMARY KEY NOT NULL,
	"purpose" "challenge_purpose" NOT NULL,
	"phone" text,
	"email" text,
	"user_id" text,
	"code_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"request_ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_identity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_uid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"active_org_id" text,
	"user_agent" text,
	"ip" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD CONSTRAINT "auth_challenge_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_identity" ADD CONSTRAINT "auth_identity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_phone_key" ON "user" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "user_last_seen_idx" ON "user" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "auth_challenge_phone_idx" ON "auth_challenge" USING btree ("phone","purpose","created_at");--> statement-breakpoint
CREATE INDEX "auth_challenge_email_idx" ON "auth_challenge" USING btree ("email","purpose","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_identity_provider_uid_key" ON "auth_identity" USING btree ("provider","provider_uid");--> statement-breakpoint
CREATE INDEX "auth_identity_user_idx" ON "auth_identity" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_key" ON "session" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");