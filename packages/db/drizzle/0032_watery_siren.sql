CREATE TABLE "food_favorite" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"kind" text NOT NULL,
	"resource_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"day" text NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_personal_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	"targets" jsonb,
	"meals" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_photo_message" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"author" text NOT NULL,
	"image_url" text,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_report" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_shopping_item" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"unit" text NOT NULL,
	"category" text DEFAULT 'Other' NOT NULL,
	"note" text,
	"checked" integer DEFAULT 0 NOT NULL,
	"contributions" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_permission" (
	"client_id" text PRIMARY KEY NOT NULL,
	"search" integer DEFAULT 1 NOT NULL,
	"barcode" integer DEFAULT 1 NOT NULL,
	"photo_log" integer DEFAULT 1 NOT NULL,
	"calculator" integer DEFAULT 1 NOT NULL,
	"personal_plans" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
DROP INDEX "ingredient_name_key";--> statement-breakpoint
DROP INDEX "ingredient_system_name_key";--> statement-breakpoint
ALTER TABLE "food_log_entry" ADD COLUMN "snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "food_log_entry" ADD COLUMN "revision" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredient" ADD COLUMN "client_id" text;--> statement-breakpoint
ALTER TABLE "food_favorite" ADD CONSTRAINT "food_favorite_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_goal" ADD CONSTRAINT "food_goal_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_personal_plan" ADD CONSTRAINT "food_personal_plan_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_photo_message" ADD CONSTRAINT "food_photo_message_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_report" ADD CONSTRAINT "food_report_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_report" ADD CONSTRAINT "food_report_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_shopping_item" ADD CONSTRAINT "food_shopping_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_permission" ADD CONSTRAINT "nutrition_permission_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "food_favorite_client_resource_key" ON "food_favorite" USING btree ("client_id","kind","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "food_goal_client_day_key" ON "food_goal" USING btree ("client_id","day");--> statement-breakpoint
CREATE INDEX "food_personal_plan_client_idx" ON "food_personal_plan" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "food_photo_client_idx" ON "food_photo_message" USING btree ("client_id","created_at");--> statement-breakpoint
CREATE INDEX "food_shopping_client_idx" ON "food_shopping_item" USING btree ("client_id");--> statement-breakpoint
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_client_name_key" ON "ingredient" USING btree ("client_id","name") WHERE "ingredient"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "ingredient_client_idx" ON "ingredient" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_name_key" ON "ingredient" USING btree ("name","studio_id") WHERE "ingredient"."deleted_at" is null and "ingredient"."client_id" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_system_name_key" ON "ingredient" USING btree ("name","data_source") WHERE "ingredient"."studio_id" is null and "ingredient"."client_id" is null and "ingredient"."deleted_at" is null;