CREATE TABLE "daily_steps" (
	"client_id" text NOT NULL,
	"date" date NOT NULL,
	"count" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_steps_client_id_date_pk" PRIMARY KEY("client_id","date"),
	CONSTRAINT "steps_count_valid" CHECK ("daily_steps"."count" between 0 and 200000)
);
--> statement-breakpoint
CREATE TABLE "step_goal" (
	"client_id" text NOT NULL,
	"effective_on" date NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT "step_goal_client_id_effective_on_pk" PRIMARY KEY("client_id","effective_on"),
	CONSTRAINT "step_goal_valid" CHECK ("step_goal"."count" between 100 and 100000)
);
--> statement-breakpoint
ALTER TABLE "daily_steps" ADD CONSTRAINT "daily_steps_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_goal" ADD CONSTRAINT "step_goal_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;