# Edge cases

System edits refused. Empty recipe allowed while composing, has zero nutrition.
Missing serving conversion: use grams, never silently assume. Deleted ingredients remain
readable in existing recipes but cannot be newly added. Stale recipe writes return 409.
Upload unavailable: use optional media links or save without media. Failed saves retain
local draft; changing studio never reuses another studio's draft.
