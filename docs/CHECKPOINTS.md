# Battle checkpoints

Pause → Save checkpoint records the active skirmish. Save & return to briefing
saves first and reloads only if the write succeeds. Continue saved battle restores
a paused battle. The result screen also offers the most recent checkpoint.

The client saves every 30 seconds of simulation and attempts a save when the tab
is hidden or leaves the page. A browser or operating system can terminate a page
without sending either event; the periodic checkpoint is the fallback. Saves are
local to this browser and origin, not cloud saves. Clearing browser data removes
them. A new battle replaces the current slot on its next save. Completed battles
do not overwrite the prior checkpoint.

`checkpoint-state.js` owns a versioned graph codec and explicit simulation-state
manifest. References preserve worker/deposit, unit/target, shelter, launcher and
Map-key identity. Sets retain research and powers. Orders, navigation paths,
production/research, resource knowledge, enemy intelligence/budget, warning times,
camera views and control groups are included. Derived navigation/visibility
caches are rebuilt. Pointer gestures, targeting modes, effects, DOM, audio and
renderer caches are disposable. Loading never advances time offline.

`checkpoint-ui.js` owns browser storage and interface/lifecycle wiring. It keeps
primary and previous-good slots. A corrupt primary falls back to the backup.
Validation precedes replacing engine state; unsupported schemas are rejected.
Primary writes are atomic localStorage operations. Failed writes display an error
and leave the player in the current battle. Storage limits or browser restrictions
can prevent saving. The current schema is 1, with a 4 MiB character limit.

Run `npm run test:checkpoint` for deterministic identity, continuation and invalid
state checks. Open `tests/checkpoint-browser.html` on the repository-root server
for real browser reload/storage checks; `?size=phone` and `?size=landscape` use
390×844 and 844×390 frames. Fixtures restore the test origin's previous slots.
