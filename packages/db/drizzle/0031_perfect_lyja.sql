ALTER TABLE "meal_plan_preset" DROP CONSTRAINT "meal_plan_preset_split_sane";--> statement-breakpoint
ALTER TABLE "meal_plan_template" DROP CONSTRAINT "meal_plan_template_macro_pct_sane";--> statement-breakpoint
ALTER TABLE "meal_plan_preset" ALTER COLUMN "protein_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_preset" ALTER COLUMN "carbs_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_preset" ALTER COLUMN "fat_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ALTER COLUMN "protein_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ALTER COLUMN "carbs_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_template" ALTER COLUMN "fat_pct" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "meal_plan_preset" ADD CONSTRAINT "meal_plan_preset_split_sane" CHECK ("meal_plan_preset"."protein_pct" between 0 and 100 and "meal_plan_preset"."carbs_pct" between 0 and 100 and "meal_plan_preset"."fat_pct" between 0 and 100 and abs("meal_plan_preset"."protein_pct"+"meal_plan_preset"."carbs_pct"+"meal_plan_preset"."fat_pct"-100)<0.02);--> statement-breakpoint
ALTER TABLE "meal_plan_template" ADD CONSTRAINT "meal_plan_template_macro_pct_sane" CHECK ("meal_plan_template"."protein_pct" between 0 and 100 and "meal_plan_template"."carbs_pct" between 0 and 100 and "meal_plan_template"."fat_pct" between 0 and 100 and abs("meal_plan_template"."protein_pct" + "meal_plan_template"."carbs_pct" + "meal_plan_template"."fat_pct" - 100) < 0.02);