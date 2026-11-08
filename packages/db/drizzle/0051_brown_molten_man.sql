ALTER TABLE "studio" ADD COLUMN "name_confirmed" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
-- Every studio that already exists has been running under whatever name it has —
-- forcing a sudden "confirm your business name" prompt on an active coach who never
-- asked for one would be a regression, not a fix. Only studios created from here on
-- start at false.
UPDATE "studio" SET "name_confirmed" = true;