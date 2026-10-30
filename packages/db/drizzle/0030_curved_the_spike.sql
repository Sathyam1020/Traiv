CREATE TABLE "meal_plan_preset" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"name" text NOT NULL,
	"protein_pct" integer NOT NULL,
	"carbs_pct" integer NOT NULL,
	"fat_pct" integer NOT NULL,
	CONSTRAINT "meal_plan_preset_split_sane" CHECK ("meal_plan_preset"."protein_pct" between 0 and 100 and "meal_plan_preset"."carbs_pct" between 0 and 100 and "meal_plan_preset"."fat_pct" between 0 and 100 and "meal_plan_preset"."protein_pct"+"meal_plan_preset"."carbs_pct"+"meal_plan_preset"."fat_pct"=100)
);
--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD COLUMN "draft_document" jsonb;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD COLUMN "published_document" jsonb;--> statement-breakpoint
ALTER TABLE "meal_plan_preset" ADD CONSTRAINT "meal_plan_preset_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meal_plan_preset_name_key" ON "meal_plan_preset" USING btree ("studio_id","name");