-- These three tables were keyed on `client`, which asked a person for their height again
-- every time they hired a second coach. They are being rebuilt on `user` in 0013.
--
-- Dropping is only safe because they shipped and were re-keyed the same day, with nothing
-- in them. If that is not true where this runs, stop: the answers below are a person's
-- health information and a calorie target, and recovering them from a CASCADE is not
-- possible. Move the data across by hand, then delete this block.
DO $$
DECLARE n bigint;
BEGIN
  SELECT (SELECT count(*) FROM client_intake)
       + (SELECT count(*) FROM body_metric)
       + (SELECT count(*) FROM nutrition_target)
    INTO n;
  IF n > 0 THEN
    RAISE EXCEPTION
      'Refusing to drop intake tables: % rows present. Migrate them to the user-keyed tables first.', n;
  END IF;
END $$;--> statement-breakpoint
DROP TABLE "body_metric" CASCADE;--> statement-breakpoint
DROP TABLE "client_intake" CASCADE;--> statement-breakpoint
DROP TABLE "nutrition_target" CASCADE;--> statement-breakpoint
DROP TYPE "public"."activity_level";--> statement-breakpoint
DROP TYPE "public"."diet_type";--> statement-breakpoint
DROP TYPE "public"."goal";--> statement-breakpoint
DROP TYPE "public"."sex";--> statement-breakpoint
DROP TYPE "public"."target_status";--> statement-breakpoint
DROP TYPE "public"."training_experience";