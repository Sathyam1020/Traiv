# Coachway — evidence log

How every finding in this directory was produced, and how to reproduce it.

## Method

**Account:** an authorised Coachway trial belonging to the repository owner, with one
self-created test client. No other account was accessed.

**Browser:** a dedicated Chrome profile at `~/.chrome-rea`, launched with
`--remote-debugging-port=9222`, isolated from the user's everyday profile so no other
signed-in session was exposed to the debug port.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-rea" \
  https://coachway.io
```

**Tooling, and why it is a hybrid**

| Tool | Used for | Status |
|---|---|---|
| `rea.list_browser_targets` | enumerating tabs | **worked** |
| `rea.inspect_web_page` | structural page capture | **worked** (output >120k chars → written to a file and queried with `jq`) |
| `rea.observe_web_session` | — | **rejected**: retains navigation metadata only. Its own limitation: *"headers, bodies, cookies, console values, and payloads are not captured by this tool."* |
| `rea.capture_browser_scenario` | driving clicks | **unavailable**: provider `rea-playwright-browser-scenario` requires Playwright, which is not installed |
| Custom CDP driver (`cw.mjs`) | navigation, clicking, network + DOM capture | **worked** |

Because REA's scenario provider needs an engine that is not installed, navigation was
driven over raw CDP and REA's own tools were used where they are supported — which is
what REA's skill instructs ("use the connected server's actual tool list").

## The driver

`cw.mjs` (session scratchpad). For one route it navigates, waits, optionally clicks a
sequence of labels, then records:

- **DOM structure**: title, headings, internal links, buttons, tabs, table headers,
  inputs (type/name/label/placeholder/required), dialogs, truncated body text
- **Network**: method, URL (query string stripped), status, MIME, per resource type
- **Response shapes**: JSON responses reduced to **keys and value types only**

```bash
node cw.mjs /clients clients 10000                       # capture a route
CLICK="1 pending|sathyam client" node cw.mjs /clients x   # click, then capture
```

### Privacy measures, by construction

- Request **headers are never read**, so no `Cookie` or `Authorization` reaches disk.
- Response bodies are passed through a `shape()` function that emits `{key: typeof}` and
  never a value. `"Sathyam"` becomes `"string"`; `72.5` becomes `"number"`.
- Only the first 25 JSON responses per page are shaped, depth-capped at 3.
- The client UUID is written as `<client-id>` in all prose documents.
- The tab containing a live Stripe checkout session (`cs_live_…`) was **excluded from
  every capture** and never navigated to.

## Captures

All under `research/coachway/evidence/*.json`, 24 Oct 2026.

| File | Route | Yielded |
|---|---|---|
| `shell-root.json` | `/` → `/clients` | sidebar, 16 routes, shell preamble, status tabs |
| `clients-pending.json` | `/clients` + click Pending | table columns, `?status=` param |
| `client-detail.json` | row click | `from=` return path, detail URL shape |
| `client-overview.json` | `/clients/<id>` | **the four client endpoints and their shapes** |
| `inbox.json` | `/inbox` | Photo log sub-view |
| `leads.json` | `/leads` | `/lead-status`, conversion-rate endpoint |
| `automations.json` | `/automations` | empty state |
| `vault.json` | `/vault` → `/resources` | redirect, tag filter |
| `content.json` | `/content` → `/articles` | three content types |
| `insights.json` | `/insights` | five report sections, two endpoints |
| `wk-exercises.json` | `/workouts/exercises` | **seeded library**, full exercise shape |
| `wk-templates.json` | `/workouts/templates` | `/workout/templates/list` |
| `nu-recipes.json` | `/nutrition/recipes` | `/recipes/meal-types` |
| `nu-ingredients.json` | `/nutrition/ingredients` | **seeded**, Country facet |
| `nu-templates.json` | `/nutrition/templates` | `/mealplan` |
| `forms.json` | `/forms` | versioned, language-tagged forms |
| `forms-metrics.json` | `/forms/metrics` | **seeded** metric registry |
| `settings.json` | `/settings` → `/account` | 14 panes |
| `settings-billing.json` | `/settings/billing` | three platform-billing endpoints |
| `set-statuses.json` | `/settings/statuses` | custom statuses |
| `set-client-defaults.json` | `?section=client-defaults` | **the default values table** |

## Reproduction

```bash
# 1 · launch the isolated profile and sign in
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-rea" https://app.coachway.io

# 2 · capture any route
node cw.mjs /clients clients 10000

# 3 · read what was captured
jq -r '.dom.tableHeaders, .api_shapes[].url' research/coachway/evidence/clients.json
```

## Three mistakes made, and what they cost

Recorded because each one would otherwise be repeated.

1. **`observe_web_session` was the wrong tool.** Chosen for "passive capture", it returns
   navigation metadata only. Cost: one empty 45-second window. Read a tool's stated
   limitations before relying on it.

2. **A timing race.** `inspect_web_page` with a 90-second window required the user to
   click *during* the window, which could not be coordinated reliably. Cost: two empty
   captures. Replaced by a driver that controls navigation and timing itself.

3. **`\s` inside a Node template literal.** The click matcher used
   `replace(/\s+/g, " ")` in a template string, where a lone `\s` collapses to `s` —
   silently making the regex `/s+/g`, which strips the letter *s* instead of whitespace.
   The target button's text is `"1\nPending"`, which therefore never matched
   `"1 Pending"`. The DOM extractor in the same file had `\\s` and worked, which is why
   the button appeared in output while the click reported NOT FOUND.
   Cost: four debugging cycles. **The tell was the contradiction** — an element visible
   in extracted output that the matcher claimed not to find.

Class of all three: **silent failure that typechecks and runs** — the same failure mode
recorded throughout this project's history. The fix each time was asserting against
observable reality (a standalone probe that found the element) rather than trusting the
code path that reported nothing.
