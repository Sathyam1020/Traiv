CREATE TABLE "food_operation" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"kind" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "ingredient_system_name_key";--> statement-breakpoint
ALTER TABLE "food_shopping_item" ADD COLUMN "ingredient_id" text;--> statement-breakpoint
ALTER TABLE "ingredient" ADD COLUMN "base_unit" text DEFAULT 'grams' NOT NULL;--> statement-breakpoint
ALTER TABLE "food_operation" ADD CONSTRAINT "food_operation_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "food_operation_client_kind_idx" ON "food_operation" USING btree ("client_id","kind","created_at");--> statement-breakpoint
ALTER TABLE "food_shopping_item" ADD CONSTRAINT "food_shopping_item_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "food_shopping_ingredient_key" ON "food_shopping_item" USING btree ("client_id","ingredient_id") WHERE "food_shopping_item"."ingredient_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_system_name_key" ON "ingredient" USING btree ("name","data_source") WHERE "ingredient"."studio_id" is null and "ingredient"."client_id" is null and "ingredient"."barcode" is null and "ingredient"."deleted_at" is null;--> statement-breakpoint
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_base_unit_sane" CHECK ("ingredient"."base_unit" in ('grams', 'ml'));