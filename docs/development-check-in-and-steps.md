# Development: Check-in and Steps

Clients → client → Development implements the Check-in section. The other Development sections remain outside this release.

Submitted check-ins support Previous/Next navigation, rating comparisons, responses, weight progress, goals and photo comparison. Photo URLs reuse existing Cloudinary uploads. Review status uses the same check_in_review records as chat.

## Steps

Today → Steps → Edit steps records a daily total manually. Selecting a weekday changes the date being edited. Native HealthKit/Health Connect syncing is not implemented; the interface reports when data was updated.

Corrections replace the daily total, including zero. Future dates, fractions and invalid counts are rejected. Date validation uses the device timezone. Trainer goals apply from today, preserving earlier targets; the default is 10,000 steps. Charts run Monday–Sunday.

Visible step data refreshes every 15 seconds and on window focus. Distance and calories use available height/weight, with missing profile data shown as a dash. Active minutes assume approximately 100 steps/minute. These are estimates, not device measurements.

Storage: daily_steps and step_goal, migration 0038_modern_leader.sql. Existing session/studio/client authorization protects endpoints; paused clients can read but cannot edit.

## Verification

API tests cover corrections, client isolation, invalid dates/counts, paused writes, dated goals and review ownership. Utility tests cover year-boundary weeks, historical goal selection and timezone midnight boundaries. Messaging regression tests verify shared review behavior. Client, trainer, UI and API typechecks also run.
