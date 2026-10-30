ALTER TABLE "recipe" DROP CONSTRAINT "recipe_owner_sane";--> statement-breakpoint
ALTER TABLE "meal_plan_recipe" DROP CONSTRAINT "meal_plan_recipe_recipe_id_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_ingredient_id_ingredient_id_fk";
--> statement-breakpoint
ALTER TABLE "meal_plan_recipe" ADD CONSTRAINT "meal_plan_recipe_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_owner_sane" CHECK (("recipe"."source"::text = 'system' and "recipe"."studio_id" is null and "recipe"."client_id" is null) or ("recipe"."source"::text <> 'system' and "recipe"."studio_id" is not null));