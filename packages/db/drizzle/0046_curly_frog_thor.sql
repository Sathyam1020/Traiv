CREATE TABLE "trainer_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"notifications" jsonb DEFAULT '{"paymentFailures":true,"successfulPayments":true,"newLeads":true,"clientOnboarding":true,"expiringPaymentMethods":true,"paymentSetupFailures":true,"subscriptionCancellations":true,"automationFailures":true,"clientAssignments":true,"paymentPlansNotStarted":true,"reportedCommunityPosts":true}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trainer_settings" ADD CONSTRAINT "trainer_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;