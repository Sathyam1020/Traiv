-- The two default funnels named in docs/analytics/admin-dashboard-spec.md §3.
--
-- Fixed ids (not newId()'s UUIDv7 — this is a one-time, hand-authored catalog seed, not
-- a client-minted retry-safe write), so re-running this migration is a no-op rather than
-- a duplicate, matching the `event_definition` seed's own `ON CONFLICT DO NOTHING`.
--
-- "Trainer activation" omits the brief's own "Visitor" and "Phone verified" steps: a
-- visitor is anonymous (lives in `analytics_event`, not `product_event` — there is no
-- shared event name between the two systems a sequential funnel could walk), and this
-- product's real auth flow has no moment distinct from `signup_completed` itself where
-- "phone verified" could be its own step — the OTP *is* how signup completes. Walking
-- only real `product_event` names the funnel can actually compute against.
INSERT INTO "funnel_definition" ("id", "name", "steps") VALUES
	(
		'00000000-0000-7000-9000-000000000001',
		'Trainer activation',
		'[
			{"name": "signup_completed"},
			{"name": "business_name_confirmed"},
			{"name": "client_invited"},
			{"name": "client_joined"}
		]'::jsonb
	),
	(
		'00000000-0000-7000-9000-000000000002',
		'Onboarding intake (15 steps)',
		'[
			{"name": "onboarding_step_completed", "properties": {"step_index": 1}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 2}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 3}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 4}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 5}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 6}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 7}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 8}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 9}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 10}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 11}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 12}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 13}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 14}},
			{"name": "onboarding_step_completed", "properties": {"step_index": 15}}
		]'::jsonb
	)
ON CONFLICT ("id") DO NOTHING;
