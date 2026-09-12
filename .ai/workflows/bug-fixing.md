# Bug fixing

## 1. Reproduce before theorising
If you can't reproduce it, you can't fix it. Find the literal evidence — the log line, the
row, the network call. Don't guess from the description.

## 2. Find the cause, not the symptom
A fix that makes the symptom disappear without explaining the cause is not a fix. If you
can't say *why* it broke, you aren't done diagnosing.

## 3. Check `state/known-issues.md`
It may be known, or related to something known.

## 4. Smallest possible fix
Fix the bug. Do not refactor the surrounding code, improve unrelated naming, or
"clean up while I'm here".

## 5. Write the regression scenario
A test that **fails on the old code and passes on the new**. Verify it fails first —
a regression test that never went red is proving nothing.

Ask the scenario questions: does it also break on the second attempt? With two actors?
Out of order? The original bug is often one instance of a class.

## 6. Record it
If it revealed a wrong assumption, write an ADR. If it's partially fixed or has a known
remaining edge, add it to `state/known-issues.md` — never quietly.
