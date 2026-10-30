ALTER TABLE "ingredient" ADD COLUMN "nutrient_type" text;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD COLUMN "preparation_note" text;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD COLUMN "minimum_unit_amount" text DEFAULT 'all' NOT NULL;