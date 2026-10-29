CREATE TYPE "public"."meal_plan_recipe_matching" AS ENUM('scale', 'best_match');--> statement-breakpoint
CREATE TYPE "public"."meal_plan_recipe_source" AS ENUM('all', 'mine');--> statement-breakpoint
CREATE TYPE "public"."meal_plan_source" AS ENUM('coach', 'client');--> statement-breakpoint
CREATE TYPE "public"."meal_plan_status" AS ENUM('draft', 'active');--> statement-breakpoint
CREATE TYPE "public"."recipe_source" AS ENUM('coach', 'client');--> statement-breakpoint
CREATE TABLE "food_log_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"date" text NOT NULL,
	"slot" text NOT NULL,
	"recipe_id" text,
	"ingredient_id" text,
	"servings" real,
	"quantity" real,
	"unit" text,
	"manual_name" text,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "food_log_entry_one_source" CHECK (("food_log_entry"."recipe_id" is not null)::int + ("food_log_entry"."ingredient_id" is not null)::int +
          ("food_log_entry"."manual_name" is not null)::int = 1)
);
--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text,
	"name" text NOT NULL,
	"data_source" text,
	"barcode" text,
	"category" text,
	"country" text,
	"dietary_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"allergen_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"default_unit" text,
	"grams_per_unit" real,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	"micronutrients" jsonb,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "ingredient_kcal_sane" CHECK ("ingredient"."kcal" between 0 and 2000)
);
--> statement-breakpoint
CREATE TABLE "meal_plan_recipe" (
	"id" text PRIMARY KEY NOT NULL,
	"slot_id" text NOT NULL,
	"recipe_id" text NOT NULL,
	"position" integer NOT NULL,
	"scale_factor" real DEFAULT 1 NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	CONSTRAINT "meal_plan_recipe_scale_sane" CHECK ("meal_plan_recipe"."scale_factor" between 0.1 and 10)
);
--> statement-breakpoint
CREATE TABLE "meal_plan_slot" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"percentage" integer DEFAULT 0 NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "meal_plan_slot_pct_sane" CHECK ("meal_plan_slot"."percentage" between 0 and 100)
);
--> statement-breakpoint
CREATE TABLE "meal_plan_template" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"client_id" text,
	"name" text NOT NULL,
	"description" text,
	"cover_image_url" text,
	"calorie_target" integer NOT NULL,
	"recipes_per_meal" integer DEFAULT 4 NOT NULL,
	"protein_pct" integer NOT NULL,
	"carbs_pct" integer NOT NULL,
	"fat_pct" integer NOT NULL,
	"dietary_preferences" text[] DEFAULT '{}'::text[] NOT NULL,
	"allergens_to_avoid" text[] DEFAULT '{}'::text[] NOT NULL,
	"recipe_source_setting" "meal_plan_recipe_source" DEFAULT 'all' NOT NULL,
	"recipe_matching" "meal_plan_recipe_matching" DEFAULT 'scale' NOT NULL,
	"status" "meal_plan_status" DEFAULT 'draft' NOT NULL,
	"source" "meal_plan_source" DEFAULT 'coach' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "meal_plan_template_macro_pct_sane" CHECK ("meal_plan_template"."protein_pct" + "meal_plan_template"."carbs_pct" + "meal_plan_template"."fat_pct" = 100)
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredient" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"position" integer NOT NULL,
	"quantity" real NOT NULL,
	"unit" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_step" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"client_id" text,
	"name" text NOT NULL,
	"description" text,
	"servings" integer DEFAULT 1 NOT NULL,
	"image_url" text,
	"video_url" text,
	"video_link_url" text,
	"meal_types" text[] DEFAULT '{}'::text[] NOT NULL,
	"difficulty" text,
	"prep_minutes" integer,
	"cook_minutes" integer,
	"dietary_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"allergen_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"source" "recipe_source" DEFAULT 'coach' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "recipe_servings_sane" CHECK ("recipe"."servings" between 1 and 50)
);
--> statement-breakpoint
ALTER TABLE "food_log_entry" ADD CONSTRAINT "food_log_entry_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_log_entry" ADD CONSTRAINT "food_log_entry_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_log_entry" ADD CONSTRAINT "food_log_entry_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_recipe" ADD CONSTRAINT "meal_plan_recipe_slot_id_meal_plan_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."meal_plan_slot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_recipe" ADD CONSTRAINT "meal_plan_recipe_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_slot" ADD CONSTRAINT "meal_plan_slot_template_id_meal_plan_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."meal_plan_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD CONSTRAINT "meal_plan_template_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD CONSTRAINT "meal_plan_template_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD CONSTRAINT "meal_plan_template_created_by_membership_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_step" ADD CONSTRAINT "recipe_step_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_created_by_membership_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."membership"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "food_log_entry_client_date_idx" ON "food_log_entry" USING btree ("client_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_name_key" ON "ingredient" USING btree ("name","studio_id") WHERE "ingredient"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_barcode_key" ON "ingredient" USING btree ("barcode") WHERE "ingredient"."barcode" is not null;--> statement-breakpoint
CREATE INDEX "ingredient_studio_idx" ON "ingredient" USING btree ("studio_id");--> statement-breakpoint
CREATE INDEX "ingredient_category_idx" ON "ingredient" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "meal_plan_recipe_position_key" ON "meal_plan_recipe" USING btree ("slot_id","position");--> statement-breakpoint
CREATE INDEX "meal_plan_recipe_recipe_idx" ON "meal_plan_recipe" USING btree ("recipe_id");--> statement-breakpoint
CREATE UNIQUE INDEX "meal_plan_slot_position_key" ON "meal_plan_slot" USING btree ("template_id","position");--> statement-breakpoint
CREATE INDEX "meal_plan_template_studio_idx" ON "meal_plan_template" USING btree ("studio_id","status");--> statement-breakpoint
CREATE INDEX "meal_plan_template_client_idx" ON "meal_plan_template" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_ingredient_position_key" ON "recipe_ingredient" USING btree ("recipe_id","position");--> statement-breakpoint
CREATE INDEX "recipe_ingredient_ingredient_idx" ON "recipe_ingredient" USING btree ("ingredient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recipe_step_position_key" ON "recipe_step" USING btree ("recipe_id","position");--> statement-breakpoint
CREATE INDEX "recipe_studio_idx" ON "recipe" USING btree ("studio_id");--> statement-breakpoint
CREATE INDEX "recipe_client_idx" ON "recipe" USING btree ("client_id");