DELETE FROM check_in_review r WHERE NOT EXISTS (SELECT 1 FROM check_in c WHERE c.id=r.check_in_id);
--> statement-breakpoint
ALTER TABLE "check_in_review" DROP CONSTRAINT "check_in_review_reviewer_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "check_in_review" ALTER COLUMN "reviewer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "check_in_review" ADD CONSTRAINT "check_in_review_check_in_id_check_in_id_fk" FOREIGN KEY ("check_in_id") REFERENCES "public"."check_in"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in_review" ADD CONSTRAINT "check_in_review_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;