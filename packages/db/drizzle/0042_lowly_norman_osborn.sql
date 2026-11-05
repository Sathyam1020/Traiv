CREATE TABLE "vault_read" (
	"client_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vault_read_client_id_resource_id_pk" PRIMARY KEY("client_id","resource_id")
);
--> statement-breakpoint
ALTER TABLE "vault_read" ADD CONSTRAINT "vault_read_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_read" ADD CONSTRAINT "vault_read_resource_id_vault_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."vault_resource"("id") ON DELETE cascade ON UPDATE no action;