# Unified inbox and media — 2026-11-02

Approved: one conversation per studio/client relationship, separate chat/photo channels.
Postgres persists messages, read positions, reactions, verified media and check-in reviews.
Workout completion and check-in submission insert unique activity references in their
transaction. Photo Log keeps its original table; compatibility writes mirror into the
inbox transaction and historical rows are backfilled without deleting originals.
HTTP writes and authenticated SSE invalidations use the existing sessions. Persistent
history is authoritative; reconnect/refetch does not depend on in-process delivery.
Cloudinary is temporary. Media stores provider/key metadata and delivery goes through
an authorized API endpoint. New private attachments use authenticated storage, verified
server-side before messages can refer to them. No secrets in browser environment variables.
