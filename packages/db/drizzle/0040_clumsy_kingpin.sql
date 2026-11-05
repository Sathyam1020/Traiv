CREATE TABLE "vault_assignment" (
	"resource_id" text NOT NULL,
	"client_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"opened_at" timestamp with time zone,
	CONSTRAINT "vault_assignment_resource_id_client_id_pk" PRIMARY KEY("resource_id","client_id")
);
--> statement-breakpoint
CREATE TABLE "vault_resource" (
	"id" text PRIMARY KEY NOT NULL,
	"studio_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'Document' NOT NULL,
	"link" text,
	"storage_key" text,
	"storage_type" text,
	"format" text,
	"bytes" integer,
	"verified_at" timestamp with time zone,
	"all_clients" boolean DEFAULT false NOT NULL,
	"tag_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gender" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vault_assignment" ADD CONSTRAINT "vault_assignment_resource_id_vault_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."vault_resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_assignment" ADD CONSTRAINT "vault_assignment_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_resource" ADD CONSTRAINT "vault_resource_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vault_client_idx" ON "vault_assignment" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "vault_studio_idx" ON "vault_resource" USING btree ("studio_id");