ALTER TYPE "public"."recipe_source" ADD VALUE 'system' BEFORE 'coach';--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "studio_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "seed_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_seed_key" ON "recipe" USING btree ("seed_key");--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_owner_sane" CHECK (("recipe"."source"::text = 'system' and "recipe"."studio_id" is null and "recipe"."client_id" is null) or ("recipe"."source"::text <> 'system' and "recipe"."studio_id" is not null));