-- `auth_identity` is for federated providers only. Phone rows duplicated `user.phone`,
-- which meant one credential with two update paths: change the number, update `user`,
-- and the stale identity survives — so the number's next owner could still authenticate
-- against it. Nothing reads these rows; sign-in has always matched on `user.phone`.
DELETE FROM "auth_identity" WHERE "provider" = 'phone';
--> statement-breakpoint
-- Same reasoning for passwords, which were never implemented: `user.password_hash` is
-- the column, and a second home for the same secret is a second thing to get wrong.
DELETE FROM "auth_identity" WHERE "provider" = 'password';
