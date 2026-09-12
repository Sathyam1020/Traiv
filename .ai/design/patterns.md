# Patterns

Recurring compositions. Match the sibling instance rather than inventing a variant —
consistency across instances matters more than the merits of any single one.

## Forms

Label above input, `type.label`. Helper text below in `caption` / `text.secondary`.
Errors below the field, `danger`, and tied via `aria-describedby`. Submit is primary and
disabled while in flight with the label changed, not a spinner replacing the text.
Never validate on first keystroke — validate on blur, then live once a field has errored.

## Dialogs vs sheets

**Dialog** — a short focused decision or a small form. Centred, `radius.surface`,
`elevation.3`.
**Sheet** — anything long, anything on mobile, anything the user needs page context behind.
Rises from the edge it's anchored to.

Both: `Esc` closes, click-outside closes unless there's unsaved input, focus moves to the
first meaningful control on open and returns to the trigger on close.

## Lists and tables

Rows, not cards. Row hover is `bg.hover`. Separators are `border.subtle` or nothing at all.
Numbers are tabular. Wide tables scroll inside their own `overflow-x: auto` container —
the page body never scrolls sideways.

On mobile, a table becomes a list of rows with the two or three fields that matter. It does
not become a horizontally scrolling table.

## Loading

**Skeletons** for content whose shape is known — match the real layout so nothing jumps.
**Spinners** only inside a control the user just activated.
Never a full-page spinner for a partial update.

## Empty states

One line saying what goes here, one line saying how to add it, and the control to do it.
No illustration. No "Get started!" No exclamation marks.

## Toasts

Confirmation of something the user did, when the result isn't visible on screen. Bottom on
mobile, bottom-right on desktop. Never for errors inside a form — those belong on the field.

## Destructive actions

Confirm only when genuinely irreversible. Name the thing in the confirm ("Delete Priya's
programme?"), label the button with the verb ("Delete programme"), never "Are you sure?"
Prefer undo over confirmation wherever undo is possible.
