# Exercise catalog provider

Set server-only `EXERCISE_CATALOG=exerciseapi` and `EXERCISEAPI_KEY` in the root ignored `.env` (or deployment secrets). Never use a `NEXT_PUBLIC_` key. The development environment is configured; deployment needs the same secrets. No provider account, billing or subscription is changed by this integration.

## Catalog and workout identity

The existing studio exercise endpoints now search the provider live, using 20-result pages and a 500-result pagination ceiling even if the key temporarily has a higher trial tier. Studio-created exercises remain in the same picker. Old shared exercises are hidden from new selections, not deleted.

Provider IDs are namespaced as `exa:<source-id>`; IDs are never reconstructed from names. When a trainer saves a workout using a new provider movement, only the selected movement's identity, name, muscle, equipment, movement classification and prescription defaults are retained to satisfy existing workout foreign keys and preserve history. Full descriptions, video URLs, images and the remote catalog are not mirrored in the shared database. Existing assignments retain their original exercise IDs. Legacy shared movements can resolve a demo on demand only on an unambiguous normalized-name/equipment match; trainer videos are never replaced.

No destructive catalog operation is necessary. Migration 0045 adds studio-scoped exercise customizations. Provider metadata and videos are loaded through authenticated existing endpoints. The shared read-only exercise sheet and client details use the same MP4 player. Provider images are relative paths without an image base, so they are not turned into guessed URLs. Missing videos retain an image/instruction fallback.

## Request and cache behavior

The key is sent only from the API to `https://api.exerciseapi.dev/v1`. Video playback goes directly to the public provider CDN. No video downloading, transcoding, shared media cache, or PWA service-worker precaching is added.

Catalog and demonstration metadata use a bounded 24-hour per-installation browser cache. Workout history is fetched fresh independently of cached media. Catalog errors are not persisted as successful device-cache pages. Studio library mutations clear catalog caches. The server has no shared provider payload cache. Timeouts and rate limits return safe errors, honor retry/reset headers, and do not prevent access to existing workout records. If the upstream fails while studio exercises are available, those remain visible with a retry message.

## Provider limitations and open terms question

As verified during integration, the API advertises/returns 243 exercises with video. Most catalog entries have no video. Some clips identify an AI generation system in their source metadata; this integration does not certify coaching accuracy.

Provider guidance explicitly restricts shared redistribution of cached data. The linked `/terms` URL returned HTTP 404 during integration. This design avoids a catalog import and stores only trainer-selected workout references, but retaining those selected metadata fields should still be confirmed with the provider before commercial release. Do not extend this into a bulk dataset mirror without appropriate permission.

## Rollback

Set `EXERCISE_CATALOG=legacy` and restart the API. Clear `traiv.exerciseapi.*` browser storage and React Query cache to discard old provider search pages. Saved provider exercise references remain in the database so history and assigned workouts continue to load; live provider demonstrations require the provider to remain enabled. Do not rerun seed scripts as a migration or delete exercise rows referenced by workouts.

## Verification

API, trainer and client TypeScript checks; focused formatting/lint checks; live provider search and detail lookup; MP4 HEAD request returned HTTP 200 with `video/mp4`. Browser/device UX and assignment saves require desktop verification. No bulk import, video downloads, or existing-workout deletions were performed.


## Studio exercise editing and uploads

The two-step editor is used for system/provider exercises as well as studio-created exercises. Provider loading shows a skeleton in that same layout, never an editable form that later switches to a preview. Saving a shared exercise writes `exercise_customization`, keyed by studio and exercise; it never alters the shared/provider record. Customized names, media and descriptions are applied to the studio’s library, templates, and its clients’ session/detail/history views. Set prescriptions and logs retain their IDs and values.

Exercise video/image uploads use the existing Cloudinary adapter under `traiv/exercise-video/<studio>/` and `traiv/exercise-image/<studio>/`. MP4/MOV videos are limited to 150 MB; PNG/JPG/GIF images to 10 MB. Uploaded assets are checked on save using the provider’s resource API, including studio ownership, actual format and byte size. External/provider URLs are not copied to storage. YouTube/Vimeo links remain an alternative to uploading a video. Cache invalidation clears edited exercise records and lists; client-specific customizations are read fresh, outside the 24-hour provider cache.

Visibility is per studio (including its trainers and clients), not platform-wide. This is application-level library scoping; generic exercise upload URLs use the existing public media delivery mode. No provider-video S3 migration has been performed.

## Filter and search consistency

`GET /studios/:id/exercise-filters` retrieves the provider's full muscle/equipment/category vocabularies. Neither trainer surface derives dropdown choices from loaded search rows. Reference metadata is cached per installation for 24 hours; studio-only values are merged from fresh studio data. `@traiv/exercises` shares canonicalization and merge rules between API and trainer. Changing only media must preserve provider keyword/secondary-muscle search matches; changing a filterable studio field rechecks that field.

Search whitespace/case are normalized, text requests are debounced once, and stale rows are hidden while the entered text is waiting for its request. Query keys and the versioned device cache include every active filter. Request cancellation is passed to the HTTP client. Pagination uses the server's next offset; an old pagination response cannot advance a newly changed filter. Exhausted pages and the free 500-result ceiling are handled separately. Counts say how many records are loaded rather than claiming an unknown search total. Both the exercise page and workout picker expose retry/clear controls.

Verification: 14 database/network-free unit checks cover full facets, aliases, combined filters, source keyword matches, studio media overrides, duplicate IDs, malformed provider pages, and page boundaries. Live read-only verification returned 16 muscle groups (including Chest), 35 equipment values, 12 types, 20 results for each of `chest` and `chest press`, and 187 Chest-filter matches with no duplicate IDs across its first two pages. Browser UX remains for desktop verification.
