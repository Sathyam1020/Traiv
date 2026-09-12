# UI development

## Before writing any component

1. Read `design/ui-principles.md`, `design/components.md`, `design/patterns.md`.
2. **Does shadcn provide it?** Use it — and restyle it to our tokens as you add it.
3. **Does Traiv already have it?** Reuse.
4. **Can it be composed?** Compose.
5. Only then build, and only against a real requirement.

## While building

- **Mobile first, 360px.** Not a desktop layout scaled down.
- **Tokens only.** No hex, no arbitrary px, no `w-[437px]`. If nothing fits, the scale is
  missing something — raise it rather than working around it.
- **Four states, always:** loading, empty, error, populated.
- **Match the sibling.** If another dialog in the app closes on Esc and autofocuses the
  first field, yours does too. Consistency beats your better idea.
- **Read `design/voice.md` before writing any string.** The banned-words list is enforced.

## Before calling it done

- Open it at 360px, 768px, 1280px. Actually open it.
- Tab through it. Every interactive element reachable, focus visible.
- Trigger the error state on purpose. Trigger the empty state on purpose.
- Both themes.
- Run `skills/ui-review.md` against your own work honestly.
