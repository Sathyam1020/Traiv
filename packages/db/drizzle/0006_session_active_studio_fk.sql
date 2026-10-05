-- Sessions issued before this constraint existed may name a studio that has since been
-- hard-deleted. Adding the key straight onto such a row fails the whole migration, so
-- the dangling references are cleared first — those sessions simply have no active
-- studio, which `requireStudio` already treats as "pick one again".
UPDATE "session" s
SET "active_studio_id" = NULL
WHERE s."active_studio_id" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "studio" st WHERE st."id" = s."active_studio_id");
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_active_studio_id_studio_id_fk" FOREIGN KEY ("active_studio_id") REFERENCES "public"."studio"("id") ON DELETE set null ON UPDATE no action;
