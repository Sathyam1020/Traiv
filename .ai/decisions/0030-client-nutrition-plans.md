# 0030 — Client nutrition plans are private copies
2026-10-30 · Requested by founder with client Nutrition screenshots

Reuse meal_plan_template.client_id and Phase C snapshot documents, paralleling workout
assignment. Library listings remain clientId-null. Direct client creation and copies
of published templates create a client-owned Draft, never a shared template. Copies
use the published source document, preserve recipe snapshots and get fresh child IDs.
Optional custom targets fit quantities through the same Phase C scaler.

Reuse PlanBuilder and PlanSettingsSheet in the client tab; no separate nutrition editor.
Existing roster overview supplies calorie suggestions. Publishing exposes only the
published document via requireClient-derived clientId. Draft edits cannot leak into
client responses. Food reveal requires published_document; a small read-only Food plan
view makes publication usable. Logging remains later scope. No migration/dependency.

Code-only implementation at founder request. UI acceptance pending.
