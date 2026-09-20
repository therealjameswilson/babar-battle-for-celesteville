# Siege release handoff

The client has since advanced through 0.31.0. Read README.md, STARCRAFT-GOAL.md,
ARCHITECTURE.md and the latest QA.md entries for current behavior and evidence.
The original imported baseline and publication history below are retained.

## Initial siege handoff (historical 0.7)

Version 0.7.0 continues the supplied prototype; baseline commit `4109fb621b93a626fdb5cfcb1c04d8497ce66c5a` is preserved. The client has worker construction, supplies and delivery, recruitment and research, control groups, rally points and queued orders, A* navigation, suppression, cover, disrupted supply, finite enemy reserves, active Babar/Rataxes abilities, and all 23 roster entries. See RELEASE-AUDIT.md and QA.md for evidence and limitations.

## Verified GitHub connection and source

GitHub CLI now authenticates as `therealjameswilson`. Repository lookup under the authenticated owner returned not found, then this dedicated repository was created privately (subsequently made public with explicit user approval):

https://github.com/therealjameswilson/babar-battle-for-celesteville

The account has ADMIN permission. `origin` points to that repository. The initial push to main was verified through the GitHub commits API as `59b307adf7c37bfcfed0844dd9d0382a61a24c9d`. Subsequent documentation commits record the publication blocker. No force push occurred. Public visibility was later explicitly authorized by the user.

## Public source and Pages

The user explicitly approved making the repository public. Visibility was changed
through the authenticated GitHub CLI, then the Pages API accepted
`build_type=workflow` and returned this destination:

https://therealjameswilson.github.io/babar-battle-for-celesteville/

The initial private-plan restriction is resolved. The workflow publishes only dist.
Deployment verified: Actions run 35037872195 completed successfully, including all
checks and deploy. The public URL was opened in a real browser; skirmish start,
Babar’s active command, pause, artwork and empty warning/error logs were verified.
All 13 public client files matched local bytes over HTTPS. The .nojekyll marker is
not served as a public asset and is not required by this Actions deployment.

## Validation

Run `npm run check`, `npm test`, `npm run test:balance`, `npm start`. No installation/build is needed. Only dist is deployed. The local browser suite has 70 base checks and 10 expansion checks; rendered Story victory, mobile layout evidence and measured battle performance are documented in QA.md. These do not imply physical iPhone, every browser engine, subjective audio verification, or extended human Commander balancing.

## Recommended next development work

After publication, expand directional walk/fire animations and perform physical iPhone Safari and hands-on Commander balance testing. There is no campaign, multiplayer, save system, or eight-direction character animation.

## Book expansion, 0.8

The original 23 crossover characters are preserved within a 33-entry roster.
Ten book-adventure/history entries add eight tested civilian powers and two
non-purchasable story archives. Book characters can be filtered and searched;
Arthur’s book/TV relationships and the two Isabelles are distinguished. Sources
and exact values are in CHARACTERS.md; browser evidence is in QA.md.

## Active StarCraft-style goal, 0.9.3

Do not treat the broad gameplay objective as completed. See STARCRAFT-GOAL.md for
an evidence-based gap audit. This increment adds deployable field artillery and
same-rule rhino behavior, described in ARCHITECTURE.md. The next major gap is
macro economy/tech progression and a genuinely economic enemy base. All 33 roster
entries remain intact. `artillery.js` must load after game.js and before navigation.


## Materials economy, 0.10.1

Finite Materials deposits, supplied worker-operated quarries, extraction slots,
advanced production costs/prerequisites, idle-worker controls and multi-producer
recruitment are implemented. See ARCHITECTURE.md for values and QA.md for evidence.
Load economy.js after game.js. Both tests/tactics.cjs and the real browser suite
load tests/economy-checks.js. Enemy Materials are physically gathered, but enemy
Supplies remain scheduled. Next substantive work is enemy economic base behavior;
the broad StarCraft-style goal remains active.


## Enemy economic base, 0.11.0

Scheduled enemy Supplies and instant reinforcements are removed. Both factions
now gather physical resources and use paid building queues. New enemy-economy.js
handles worker replacement, paid rebuilding, supply homes, repairs and expansion.
Enemy exact funds are hidden; depot income goes only to its owner. Shared VM/browser
checks include resource conservation over autonomous expansion. Historical QA
entries describe old versions; use the latest entry and STARCRAFT-GOAL.md for scope.
The broad goal stays active: unit-counter depth, research/expansion adaptation and
longer Commander balance still need work.


## Combined arms, 0.12.1

Field Sappers and scouted anti-armor recruitment add composition decisions.
combat-roles.js supplies shared faction research and role/bonus rules. Both armies
now research through paid producer queues. tests/counter-checks.js is shared with
the browser; test:compositions compares four earned-resource opening scenarios and
runs in Actions. Both tested Commander openings lose: investigate defenses and
longer-match behavior next, without weakening tests or calling this complete.


## Defensive command, 0.13.4

Attack banners, static minimap rings, muted/user-gesture-safe dispatch tones and
F3/touch camera cycling improve response while managing production. alerts.js is
shared by damage and UI; tests/alert-checks.js runs in VM and browser.
A normal-resource defensive Commander policy now supplies a winning regression;
see COMMANDER-OPENING.md. Earlier rush-opening defeats are retained as comparison
evidence. This does not prove every human opening is balanced. Remaining gameplay
work includes selection subgroups, adaptive expansion choices and broader human
balance; do not mark the overall goal complete from this result alone.

## Minimap commands, 0.32.0

Minimap pointer input now lives in minimap-input.js. Default drag pans; right-click
orders selected units/sets production rallies; explicit order plus tap works on
touch. Shift/Queue uses command() and existing limits. Building placement pans
without spending; out-of-bounds releases cancel explicit taps. Shared and browser
event checks pass (584 browser assertions across desktop/portrait/landscape).
Overall StarCraft fidelity goal remains active; see STARCRAFT-GOAL.md for remaining
audit and longer-match comparisons.

## Independent expansions, 0.33.0

New `headquarters` structure uses shared production, delivery and supply helpers.
Remote placement needs current scouting; other structures retain near-building
placement. Production panel, rally, refunds, population, healing, retreat, enemy
raids and fog memory recognize camps. Enemy planning uses recent stock reports
and observed safe sites. See EXPANSION-COMPARISON.md and `npm run test:expansion`.
Protected versus destroyed economic comparison is controlled, not a full-match
balance verdict. Follow up with a paid full-match expansion/military comparison.

## Paid expansion openings, 0.34.0

Headquarters now show physical delivery totals. `npm run test:expansion-openings`
compares three normal-resource Commander policies with the same first minute:
army-first wins, early investment exposes the palace and loses, and depot-secured
investment wins with a larger economy. Browser verification also shows early
loss and secured victory, with runtime-dependent timestamps/totals. See
EXPANSION-OPENINGS.md; this does not imply all early player expansions lose.
Next fidelity work should investigate the known long-run Node/Chromium numerical
divergence and continue the current-scope completion audit before adding breadth.

## Fixed simulation and runtime consistency, 0.35.0

Vector movement plus fixed direction tables remove the measured Node/Chromium
trajectory divergence in the tested replay. simulation-clock.js advances 50ms
ticks with five-tick catch-up and presentation interpolation; pause resets timing.
`npm run test:clock` compares full Commander matches at 30/60/144 FPS. Browser
trace equals Node at all seven checkpoints and the 282s victory result. See
SIMULATION-CONSISTENCY.md for scope, performance and why the early-expansion income
assertion was corrected without weakening protected-expansion viability.
Keep iframe and script cache versions aligned in tests/browser.html during QA.
Continue the original-scope completion audit; physical Safari and comprehensive
human balance are not established by these automated replays.

## Character artwork 0.37.0

All 33 council members have generated portrait/full-body artwork in six local RGBA sheets. `character-art.js` contains inspected per-character crops; `characters.html` is a searchable full-body gallery linked from Family & council. Source/reference caveats and generation recipe: `docs/CHARACTER-ART.md`. Do not assume equal atlas cells. Children/archives remain support/story roles. `tests/character-art.cjs` is included in `npm run check`; `tests/art-browser.html` passed 117 actual browser checks. Screenshot capture remains unavailable in this preview; see QA for scope. Next artwork task: reference-led costume refinement for the lesser-documented book allies, followed by directional commander walk/fire sheets.

## Commander animation 0.38.0

`commander-animation.js` now draws Babar/Rataxes from local 16-frame RGBA sheets. Foot/muzzle anchors and inspected crops are explicit; preserve them when changing art. Movement is distance-driven, shooting uses firedAt/firedAngle, pause freezes the pose, reduced motion removes the gait/flash. Existing atlases provide a missing-image fallback. See COMMANDER-ANIMATION.md for prompts and architecture. Node crop/pose checks and 309 real-browser checks passed; Canvas review saved under ignored artifacts. Full-page screenshots/manual live-motion QA remain limited; see QA.md. Next art refinement: four-phase gait and diagonal facings.

## Fire discipline 0.39.0

Hold fire / Weapons free (C) is a persistent stance for combat units. Both acquisition and shoot enforce it. Fresh player focus orders set forceFire for one target; enabling Hold fire clears earlier focus permissions while preserving routes. See FIRE-DISCIPLINE.md. Node checks and 108 actual browser fixture checks passed. The action grid now constrains/wraps text on mobile. Full-page screenshots/manual playthrough remain limited by preview tooling; do not describe fixture events as manual touch QA. Next focused improvement: contextual retreat/escort control for protecting an artillery battery while repositioning.

## iPhone controls 0.40.0

`mobile.js` owns the compact command tabs, field-manual restart link, two-finger
navigation and visibility auto-pause. Capture-phase pointer listeners suppress
orders until every finger from a navigation gesture lifts. Existing one-finger
selection/order/pan code stays in game.js. Final CSS phone overrides provide
44px primary targets, safe-area padding and dvh layout; desktop retains its panel.
470 browser fixture checks pass; see QA.md for physical Safari and screenshot
limitations. Next task: a physical iPhone Safari match, especially notch/browser
chrome transitions, gestures and measured battery/frame-time behavior.

## Battlefield art 0.41.0

Static ground now lives in battlefield-art.js and is cached below fog. Preserve
module order before render.js and include it in the smoke harness. Original earth
asset and prompt are documented in BATTLEFIELD-ART.md. No simulation terrain was
added. Browser Canvas review artifacts exist; full-page capture remains blocked.
