# Backend

## Stack (proposed — see dependencies.md)

Node 24, **Express 5**, Drizzle, **Neon** Postgres, zod.

## Shape

```
apps/api/src/
  routes/        thin HTTP layer — parse, authorize, call a use case, serialize
  features/      use cases. The real logic. Grouped by feature.
  db/            queries
  integrations/  razorpay, whatsapp, ses — each behind an interface
  middleware/    auth, error handling, request validation
  jobs/          outbox workers
```

Route handlers stay thin. Business logic lives in use cases, which is also the layer
scenario tests target.

## Authorization

**Every handler authorizes explicitly.** No route is safe because it's "internal".

The check is always the same shape: does this session's user have a role in the org that
owns this resource? Deriving the org from the request body rather than from the resource
is the IDOR bug — always load the resource, then compare its `org_id`.

Scope every tenant query by `org_id`. A missing scope is a security bug, not a logic bug.

## Idempotency

Anything a third party can retry, or a user can double-click, must be idempotent.

- Webhooks: write `webhook_event` first (`UNIQUE(provider, external_id)`), process second.
- Client-minted ids: `ON CONFLICT (id) DO NOTHING`.
- Mutations: a submit lock plus a server-side guard. Not just a disabled button.

## Transactions and side effects

State change and the work it triggers commit together. Write the `outbox` row in the same
transaction, then let a worker pick it up. Never fire a WhatsApp message inside a request
handler and hope.

## Express specifics

Express 5 — **not 4**. It changed real behaviour: async handler rejections now propagate to
the error middleware automatically, so no `express-async-handler` wrapper and no
`try/catch` in every route. Path-matching syntax also changed. **Read the Express 5 docs
before writing routes** — v4 knowledge does not transfer cleanly.

One error-handling middleware, registered last, owns all error → HTTP mapping. Routes throw
typed errors; they don't build error responses themselves.

## Integrations

Each behind an interface with a real implementation and a dev implementation
(`ConsoleMailer`, `ConsoleWhatsApp`). Local development must work with zero third-party
credentials.

## Validation

Zod at the edge on every request body, query param and webhook payload. Env vars parsed
once at boot through a schema — the process refuses to start if one is missing.

## Dev auth bypass

A user-picker, gated on `NODE_ENV !== 'production'` **and** `AUTH_DEV_BYPASS=true`, plus a
boot assertion that hard-crashes the API if both production and bypass are ever true.
Two independent guards, because this is the worst possible thing to ship by accident.
