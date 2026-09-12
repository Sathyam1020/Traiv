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
- Glassmorphism / backdrop blur used ornamentally
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
