CREATE TABLE "exercise_customization" (
	"studio_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_customization_studio_id_exercise_id_pk" PRIMARY KEY("studio_id","exercise_id")
);
--> statement-breakpoint
ALTER TABLE "exercise_customization" ADD CONSTRAINT "exercise_customization_studio_id_studio_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studio"("id") ON DELETE cascade ON UPDATE no action;