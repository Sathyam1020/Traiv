# 0031 — Client nutrition is a diary with frozen food snapshots

Accepted 2026-10-31. Implements the founder-approved expanded Phase E; Cookbooks are excluded.

The client Food tab is useful before a coach assigns a plan. `reveal.food` is therefore
true for an authorized coaching relationship. Published coach plans remain read-only
inputs: logging an option resolves its published, adjusted ingredient snapshot on the
server, rather than the current recipe library. Private client plans use a separate
`food_personal_plan` record and never enter the trainer template list.

Each diary entry stores its display data, per-serving nutrients, micronutrients,
known base weight/unit, and source metadata at log time. Quantity edits scale that
snapshot with a revision guard. Source library edits and deletions cannot rewrite
history. Quick-add is intentionally client-entered nutrition; other sources are
resolved and calculated by the API. Copy operations derive deterministic UUIDs from
client, request and source, so a retry cannot duplicate a meal.

Private foods add `ingredient.client_id`; all trainer ingredient visibility predicates
exclude client-owned rows. Shared barcode-cache products are the only new shared food
writes. Both gram and volume-based nutrition are explicit; ml foods with unknown density
cannot become gram-based recipe ingredients. Own recipes reuse the normalized recipe,
ingredient and instruction tables. Their edits use an updated-at concurrency guard.

Favorites, goal overrides, photo messages, reports, shopping items and retry operations
have relationship-scoped tables and indexes. Heterogeneous recipe/diary snapshots and
personal meal configurations use typed JSONB, as plan snapshots already do. Shopping
quantities are normalized columns. Recipe additions aggregate by ingredient with
transactional retry guards; contribution snapshots explain which recipes contributed.

Five coach permissions are enforced in client API use cases, not only hidden in UI.
Paused coaching retains read access but cannot mutate via client routes. Staff access
verifies both studio membership and the roster client's ownership.

Photo Log is an image-plus-optional-note conversation with coach replies. It never
estimates meal nutrition. Signed Cloudinary folders scope client uploads; persisted photo
messages and label scans verify the expected client folder. The label adapter uses
OpenAI Responses image input with strict structured output, `store:false`, a timeout,
and a per-client hourly quota. Missing or unreadable values stay empty for confirmation.
No provider key or image-extraction logic is exposed to the browser. An unconfigured
provider returns an actionable error and manual entry remains available.

Barcode decoding uses lazily imported `@zxing/browser` because Safari support cannot
rely on the native BarcodeDetector API. Manual entry remains available. Open Food Facts
is read-only and cached locally, with provenance and missing-data handling. Scanning
requires an environment where camera permission is available; this change adds no
network tunnel, HTTPS setup, deployment, or LAN configuration.

No tests, builds, typechecks, or browser checks were run: the founder's standing
nutrition instruction reserves UI testing to them. Database generation/application and
formatting are implementation steps, not a claim of validated UI acceptance.

Implementation references: [OpenAI image inputs](https://developers.openai.com/api/docs/guides/images-vision),
[structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs),
[Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/),
and [ZXing browser reader](https://github.com/zxing-js/browser#readme).
