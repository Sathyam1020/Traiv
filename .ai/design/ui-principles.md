# UI principles

## 1. Not everything is a card

Border, fill, radius and shadow each say "separate object". Spend them by role. A page
where every block is a bordered rounded card has no hierarchy — everything shouts equally.
Most lists are rows with space between them, not cards.

## 2. Separate with space before you separate with lines

Reach for `space` first, `border.subtle` second, a card almost never.

## 3. Weight and colour before size

Hierarchy comes from 400→500→600 and primary→secondary text. Jumping type sizes is the
last resort, not the first.

## 4. Mobile is the real target, not the fallback

The client app is used one-handed, on a budget Android, in a basement with no signal.
Design at 360px first. A desktop layout squeezed down is a listed slop pattern.
Tap targets ≥ 44×44px.

**And then it has to grow.** Mobile-first means start at 360 and expand — not stop there.
Three apps shipped as a 512px column stranded in the middle of a desktop because this
principle said where to start and never said where to go.

| | |
|---|---|
| **360** | One column. Floating tab bar. Nothing scrolls sideways, ever. |
| **sm · 640** | Cards that were stacked go two across. |
| **lg · 1024** | Sidebar replaces the tab bar. This is the one breakpoint where navigation changes shape, and it lives in `AppShell` so no app can pick a different one. |
| **xl · 1280** | Third column where a grid has enough to fill it. |
| **beyond** | Content caps at `max-w-[1280px]` and centres. `Page` is that container; use it rather than a new number. |

**Tap-target size follows the pointer, not the width.** `pointer-coarse:` in
`packages/ui`, never `sm:`. Width is the wrong question: a phone held sideways is 844px
and still a thumb, a touchscreen laptop is 1400px and still a thumb, and a 700px window
on a desktop is a mouse. Layout stays width-driven and mobile-first; only *how big a
thing you have to hit* is keyed to the input device.

**The bug that causes almost every sideways scroll: `min-width: auto`.** A grid or flex
item refuses to shrink below its content's min-content width, so one `min-w-[32rem]`
table inside an `overflow-x-auto` drags its whole column past the viewport — and the
*page* scrolls sideways instead of the table. `min-w-0` on the column, not on the
scroller. This is what put the income calculator at 534px on a 360px screen, and it had
been invisible because the scroller looked like it was already handling it.

**Checked, not assumed.** `pnpm --filter @traiv/web audit:responsive 320 390 768 1280`
drives headless Chrome over every route and reports sideways scroll, sub-44px targets
and sub-11.5px text. Reading class names is assuming.

**What stays narrow, deliberately:** a single-task form — sign-in, one intake question —
is worse at 1280px, not better. So is long-form text, which holds a 65–75 character
measure per `typography.md` §5. Narrow is a decision there, not an oversight; everywhere
else it is the oversight.

## 5. Every async surface has four states

Loading, empty, error, and populated — all four designed, none of them an afterthought.
Empty states say what to do next and give the control to do it. Error states say what
broke and offer the retry.

## 6. Interactive things look interactive, and say what they do

A control is labelled with what happens ("Publish", then a toast saying "Published"),
never with a vague noun.

## 7. Density is a per-surface decision

The coach's roster is dense — they're scanning fifty rows. The client's workout screen is
sparse — they're mid-set with sweaty hands. Do not apply one density everywhere.

## 8. The first frame must be readable

No content parked at `opacity: 0` waiting for an observer. No `100vh` hero pushing the
page out of view. Whatever is meant to be read is visible as soon as the page loads.

## Banned outright

These are the AI-slop patterns. Presence of any is a review failure, not a preference.

- Gradients as decoration
- Glassmorphism / backdrop blur used ornamentally — **one documented exception**: the
  mobile navigation bar, where the blur is functional. It floats over scrolling content
  and the blur is what keeps its labels legible while letting the page show through.
  Nothing else in the product gets this treatment; adding a second instance needs an ADR.
- Cards nested inside cards
- An icon next to every label
- Emoji as section markers
- Pills used decoratively rather than to carry state
- Shadows on non-floating elements
- Headings above 24px in product UI
- More than one accent colour on a screen
- Animation that doesn't explain a change
- Centred body text
- A "Dashboard" that is a grid of stat tiles nobody asked for
- Borders on everything
