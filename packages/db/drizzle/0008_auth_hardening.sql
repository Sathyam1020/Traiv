-- ---------------------------------------------------------------------------
-- Clean before constraining. Every statement below is idempotent, and ordered so
-- the data satisfies each new rule before that rule is created.
-- ---------------------------------------------------------------------------

-- The live-code unique index cannot be created while a target has more than one
-- unconsumed challenge, which resending already allowed. Keep the newest per target and
-- consume the rest — exactly what the application now does inside the issuing
-- transaction, applied once to the backlog.
UPDATE "auth_challenge" c
SET "consumed_at" = now()
WHERE c."consumed_at" IS NULL
  AND c."phone" IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "auth_challenge" newer
    WHERE newer."phone" = c."phone"
      AND newer."purpose" = c."purpose"
      AND newer."consumed_at" IS NULL
      AND (newer."created_at", newer."id") > (c."created_at", c."id")
  );
--> statement-breakpoint

-- Case-fold addresses so the lower() check holds and the unique index stops treating
-- Foo@x.com and foo@x.com as two accounts.
UPDATE "user" SET "email" = lower("email") WHERE "email" IS NOT NULL AND "email" <> lower("email");
--> statement-breakpoint
UPDATE "client" SET "email" = lower("email") WHERE "email" IS NOT NULL AND "email" <> lower("email");
--> statement-breakpoint

-- Normalise the phone shapes that are unambiguous. Anything left that still fails the
-- CHECK will abort this migration, which is the right outcome: a number nobody can
-- deterministically repair should be looked at by a person, not guessed at here.
UPDATE "user" SET "phone" = '+91' || regexp_replace("phone", '^(\+?91|0)', '')
WHERE "phone" IS NOT NULL
  AND "phone" !~ '^[+][1-9][0-9]{7,14}$'
  AND regexp_replace("phone", '^(\+?91|0)', '') ~ '^[6-9][0-9]{9}$';
--> statement-breakpoint
UPDATE "client" SET "phone" = '+91' || regexp_replace("phone", '^(\+?91|0)', '')
WHERE "phone" IS NOT NULL
  AND "phone" !~ '^[+][1-9][0-9]{7,14}$'
  AND regexp_replace("phone", '^(\+?91|0)', '') ~ '^[6-9][0-9]{9}$';
--> statement-breakpoint
UPDATE "auth_challenge" SET "phone" = '+91' || regexp_replace("phone", '^(\+?91|0)', '')
WHERE "phone" IS NOT NULL
  AND "phone" !~ '^[+][1-9][0-9]{7,14}$'
  AND regexp_replace("phone", '^(\+?91|0)', '') ~ '^[6-9][0-9]{9}$';
--> statement-breakpoint

DROP INDEX "membership_studio_user_key";--> statement-breakpoint
DROP INDEX "studio_slug_key";--> statement-breakpoint
DROP INDEX "studio_join_code_key";--> statement-breakpoint
DROP INDEX "user_email_key";--> statement-breakpoint
DROP INDEX "user_phone_key";--> statement-breakpoint
CREATE INDEX "auth_challenge_ip_idx" ON "auth_challenge" USING btree ("request_ip","created_at");--> statement-breakpoint
CREATE INDEX "auth_challenge_expires_idx" ON "auth_challenge" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_challenge_live_phone_key" ON "auth_challenge" USING btree ("phone","purpose") WHERE "auth_challenge"."consumed_at" is null and "auth_challenge"."phone" is not null;--> statement-breakpoint
CREATE INDEX "session_expires_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_studio_user_key" ON "membership" USING btree ("studio_id","user_id") WHERE "membership"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "studio_slug_key" ON "studio" USING btree ("slug") WHERE "studio"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "studio_join_code_key" ON "studio" USING btree ("join_code") WHERE "studio"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "user" USING btree ("email") WHERE "user"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "user_phone_key" ON "user" USING btree ("phone") WHERE "user"."deleted_at" is null;--> statement-breakpoint
ALTER TABLE "auth_challenge" ADD CONSTRAINT "auth_challenge_phone_e164" CHECK ("auth_challenge"."phone" is null or "auth_challenge"."phone" ~ '^[+][1-9][0-9]{7,14}$');--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_phone_e164" CHECK ("client"."phone" is null or "client"."phone" ~ '^[+][1-9][0-9]{7,14}$');--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_email_lower" CHECK ("client"."email" is null or "client"."email" = lower("client"."email"));--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_phone_e164" CHECK ("user"."phone" is null or "user"."phone" ~ '^[+][1-9][0-9]{7,14}$');--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_lower" CHECK ("user"."email" is null or "user"."email" = lower("user"."email"));