CREATE TABLE "client_tag" (
	"client_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_tag_client_id_tag_id_pk" PRIMARY KEY("client_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#6b7280' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tag_color_is_hex" CHECK ("tag"."color" ~ '^#[0-9a-f]{6}$'),
	CONSTRAINT "tag_name_not_blank" CHECK (length(btrim("tag"."name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "client_tag" ADD CONSTRAINT "client_tag_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_tag" ADD CONSTRAINT "client_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_tag_tag_idx" ON "client_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_studio_name_key" ON "tag" USING btree ("studio_id",lower("name"));--> statement-breakpoint
CREATE INDEX "tag_studio_idx" ON "tag" USING btree ("studio_id");