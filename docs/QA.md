# QA record — Siege 0.3.0

## Automated simulation

The original imported source passed its syntax checks and deterministic smoke harness before modification. Node/npm were initially absent from PATH; the bundled Node runtime and a temporary official npm CLI were used. No project dependencies were installed.

Final `npm run check`, `npm test`, and `npm run test:balance` passed. The checks cover syntax; RGBA atlas dimensions; roster integrity; all support powers and their numerical effects; construction, collection/delivery, recruitment and population; cover; suppression, hold and retreat; obstacle and building routing; disrupted and restored supply; isolated queues; paid repair and commander returns; depot capture and enemy budget disruption; fog acquisition; cooldowns; and end states.

The final deterministic Story strategy reached victory at 131.65 simulation seconds using only the original starting economy, earned supplies, and normal player commands. The balance script asserts victory. It does not grant an army, supplies, or damage the enemy fortress through a test override.

## Real browser

Tested in the Codex in-app Chromium browser. The local-only browser harness uses the actual game document, loaded images, native dialogs, CanvasRenderingContext2D, localStorage and PointerEvent handlers. Its final run passed **70 checks**. This is distinct from the Node mock-Canvas harness.

- Native start, pause/resume, council open/close with pause restoration, cost/status updates, all 18 player support activations and repeat-purchase protection.
- Actual rendering and image loading; physical collection and delivery; scout recruitment; building construction; repair; depot capture; supply disruption/restoration; zoom, pan, mute and persistence.
- Synthesized touch pointers exercised selection, explicit move, drag-to-pan, and visible-enemy focus-fire; computed `touch-action: none` verified. Direct mouse use exercised drag selection, right-click movement, A attack-move and S hold.
- The accelerated Story strategy was played with visible rendering and reached victory at 2:18 in the final run; unattended play reached loss at 2:57 in an earlier run. The loss’s Deploy again button returned to the briefing. Representative screenshots were saved locally.
- Portrait **390 × 844** and landscape **844 × 390** used real iframe viewports because the browser’s advertised viewport override did not change the effective viewport. Body/client/scroll dimensions were inspected. Portrait body and scroll bounds both measured 390 × 844. Final landscape body and scroll bounds both measured 844 × 390, after correcting a three-pixel footer overflow. Council tabs and support activation were checked in the portrait layout. The landscape layout was revised to expose launch and field orders without sidebar scrolling.
- Desktop **1280 × 720** was inspected with the actual game. The sidebar was compacted to keep all field orders visible.

A native-dialog close assertion initially ran before the asynchronous `close` event. The browser test was fixed to await the lifecycle; game pause restoration then passed. The browser harness also surfaced an injected MutationObserver error without a game source URL during iframe navigation; no project code uses MutationObserver. It is not reported as a clean browser log. No missing game assets or game-source exceptions were observed in the successful checks.

## Performance

The real-browser fixture begins with 60 combatants plus the map buildings. Measurement includes 120 rendered frames and timed draw/update calls; it is not a whole-device GPU profiler. Both runs covered about two seconds (approximately 60 Hz).

| Measurement | Before caching | After caching |
|---|---:|---:|
| Mean simulation update | 2.60 ms | 0.75 ms |
| 95th percentile update | 4.30 ms | 1.10 ms |
| Mean draw call | 0.34 ms | 0.51 ms |
| 95th percentile draw | 0.50 ms | 0.70 ms |

Repeated visibility and static-collision scans were the measured CPU cost. Per-step caches reduced mean update time by about 71%. The slight draw variation is within this short fixture’s measurement scope; no faster rendering claim is made. Input remained responsive during the battle.

## Art and evidence

Final military character and building sheets were visually inspected and corrected with padded variants. Both are local 1254 × 1254 RGBA PNGs. The custom, irregular atlas boundaries remain explicit in render.js. Generated checkerboard-backed variants were rejected. Units use mirrored facing and bearing indicators; artillery carriages rotate. Damage overlays include cracks, breach states and restrained smoke. There is no camera shake.

Local review artifacts live in ignored `artifacts/`, outside `dist/`: desktop and mobile screenshots, Story victory/loss, browser-checks.txt, and performance-after.json. These are not uploaded by the Pages workflow.

## Limits

No physical iPhone/Safari or other browser-engine testing has been performed. Touch pointer tests are synthetic. Reduced-motion behavior was implemented and code-reviewed, but the browser preference could not be toggled through the available test API. Audio startup/mute/storage paths were exercised; no subjective listening assessment is claimed. Commander rules have automated checks but still need extended human balancing. Multi-direction animation remains limited to two-way facing plus heading/gun rotation.

GitHub creation, remote push verification, Actions deployment and the final hosted-page smoke test remain **blocked by CLI authorization**, not passed or omitted. See CODEX-HANDOFF.md.

## Control-group and rally-point follow-up

Engine checks, tactical tests, and earned-resource Story victory balance checks pass.
New deterministic assertions cover group recall, append, dead-member exclusion,
restart clearing, resource rallies and ground rallies overriding automatic gathering.
These additions are NOT yet browser verified: the previous preview server had stopped;
a replacement server was started, but the browser navigation tool rejected the
existing connection-error document. Earlier browser evidence above predates these
controls. Native computer access also reported the Mac locked. Resume direct keyboard,
touch rally and visual pennant checks when preview access is restored.

## Production management and groups browser follow-up

Preview access recovered by opening a fresh tab after confirming HTTP 200 from the
restarted server. Real browser input verified Ctrl+1 assignment and 1 recall after
F2 changed selection; recruitment displayed its cancellation/refund button and
cancelling removed the queue and released population. The Groups modal opened,
assigned the palace to group 2, closed, and returned to running command. Right-click
on ground produced the dashed rally line and pennant (artifacts/rally-and-groups.png).
Desktop 1280×720 controls visually fit; browser warning/error log was empty.
These observations supersede the earlier blanket pending status for desktop controls.
New Groups dialog and queue overflow still need portrait/landscape checks. Touch
hardware, group recall via modal, and recruit arrival at the rally remain pending
browser checks (rally behavior is covered by deterministic assertions).

Deterministic cancellation tests verify exact refunds, preserved active progress
when cancelling a waiting recruit, reset progress when cancelling the active recruit,
and no duplicate refunds from an invalid repeated cancellation.

## Queued orders (0.4.0)

Deterministic checks cover two-waypoint completion, preservation of the first order,
clearing routes on Hold/Retreat, and advancing from gathering after delivery. Updated
Story balance bot wins at 133.65 simulated seconds. Versioned script URLs fix an
observed browser cache mismatch where new HTML had loaded older game logic.
After that fix, real browser clicks selected Babar, issued a ground move, enabled
Queue, and appended a second ground move; live status showed `move · 1 queued` and
Queue pressed. Six seconds later the queue was consumed and the second move active.
Captured artifacts/queued-route.png. Mobile layout checks remain outstanding.

## Compact control-panel verification

Real browser iframe layouts at 390×844 and 844×390 exposed two issues: Groups dialog
buttons inherited unreadable colors, and the five quick commands were squeezed into
a flex row. Explicit dialog button colors and a two-row grid fix both. Portrait
panel height is now 310px; landscape retains its compact panel. Final screenshots:
artifacts/portrait-controls-v04.png and artifacts/landscape-controls-v04.png.
Portrait body/client/scroll dimensions are 390×844; landscape 844×390, without inner
page overflow. The larger QA wrapper itself scrolls to show the full portrait frame.
Real UI clicks assigned the palace to group 1, selected Babar, recalled group 1 back
to the palace, enabled Queue, and paused. Landscape recruitment cancellation and
opening/closing Groups worked; the entire landscape dialog fits within 390px height.
These are responsive browser checks, not physical iPhone or touch-hardware tests.
The wrapper console again emitted unlocated MutationObserver errors during iframe
navigation; no project code uses MutationObserver. Do not call this an error-free
browser run; the control behavior and dimensions above were observed successfully.

## Research progression 0.5

Engine, tactical and balance commands pass. Numerical research checks verify payment,
production exclusion, duplicate-project rejection, completion, 20% guard damage,
team scoping, 25% isolated progress, exact 75% cancellation refund, duplicate-refund
protection, destruction before completion and reset. The no-research Story bot still
wins at 133.65s, proving research is optional for that strategy.
Real desktop browser clicks selected Guard School, started coordinated volleys,
attempted recruitment and received the occupied-building message, observed progress
at 1% and 58%, then observed completion and successfully queued a guard. Live troop
damage and artillery research have not separately been browser tested; infantry
numerical effects are deterministic checks. Mobile research layout and balance with
active research strategies remain to be checked.

## Active commanders 0.6

Numerical tests verify Babar's energy payment, cooldown rejection, area/team scope,
20 morale restoration, 25% protection and expiry; Rataxes's extra suppression,
energy payment, timed effect, and no cast when no nearby enemy is visible. Energy
regeneration tested numerically. Story bot still wins, now at 151.10 seconds against
the stronger enemy command. The movement multiplier is implemented but not yet
isolated in a numerical test. Real browser selected Babar, activated Stand together,
and showed Energy 19/100, PROTECTED, a 35s cooldown and affected-unit rings. Screenshot
artifacts/babar-command.png. Rataxes's live cast and mobile ability UI still need
browser checks; do not treat automated effects as full playtest coverage.

## Worker construction 0.7

All engine, tactical and Story balance checks pass. Added assertions cover automatic
builder assignment, no progress before arrival, interruption after builder death,
replacement through Repair, cancellation refund once, worker release and no-worker
rejection without charging. Baseline construction wait now includes travel plus
work time; the browser fixture similarly allows 25 simulated seconds instead of 10.
The full real-Canvas browser suite passes all 70 checks on this release, including
construction/population, council effects, routes, repairs, supply, selection, touch
orders, mute and controls. Its coverage is defined in tests/browser-driver.js and
must not be read as covering every newly added feature.
The updated normal-order/earned-resource strategy reached rendered Story VICTORY at
02:44 with 15 enemy casualties. Evidence: artifacts/story-victory-v07.png and .txt.
Deterministic run reaches victory at 155.05s; the different browser execution means
these are separate results, not claims of identical runs. Real browser builder-loss
and cancellation cases remain covered only by deterministic tests so far.

## Expansion regression audit

The new `Expansion checks` button runs ten additional assertions in a real browser
and Canvas context. All ten passed: production exclusion during research; infantry
and artillery research completion; 60-damage upgraded artillery hit; Rataxes's AI
cast with visible opposition and an escort; measured 30% movement increase; builder
loss and replacement; actual DOM cancellation availability and action. Saved text:
artifacts/expansion-browser-checks.txt. These controlled browser fixtures use injected
test positions and resources, and are distinct from the earned-resource Story
playthrough. They supersede the earlier missing browser coverage for these rules.

Current representative battle measurement: 120 frames in 1999ms, draw mean 0.5375ms
(p95 0.70ms), update mean 0.6242ms (p95 0.90ms). Fixture began with 60 combatants;
55 units remained at measurement completion as casualties occurred. Saved
artifacts/performance-v07.json. These are short browser CPU timings, not a claim
about all devices or GPU profiling; no new bottleneck warranted an optimization.

## Final compact commander audit

Direct portrait UI activation of Stand together passed: energy reduced to 10,
PROTECTED status and 35s cooldown appeared. Long selection copy initially pushed
Hold below the screen; summary shortening, compact text height and a 340px portrait
panel corrected it. Final measured Hold bottom 803px, footer top 816px, body/client
and scroll height 844px. Screenshot artifacts/mobile-babar-command.png. This closes
the earlier pending portrait commander-control check; physical touch remains untested.
Current requirement/evidence map: RELEASE-AUDIT.md.

## GitHub Pages verification

Public-source visibility was explicitly approved. Actions run 35037872195 passed
syntax/asset checks, tactical tests, balance simulation and deployment. The actual
API-returned URL https://therealjameswilson.github.io/babar-battle-for-celesteville/
was opened in the real browser. Started a Story skirmish, selected Babar, activated
Stand together, observed energy/protection/cooldown, paused and inspected the
rendered artwork. Browser warning/error log was empty. All 13 public client files
returned HTTP 200 and matched local bytes (four atlases, HTML, CSS and seven scripts).
The .nojekyll configuration marker returns 404, is not referenced by the client and
is unnecessary for Actions artifact deployment. Screenshot: artifacts/github-pages-live.png.

## Book roster expansion — 2026-09-16, version 0.8

- Baseline syntax and simulation checks passed before changes. Updated `npm run
  check`, `npm test`, and `npm run test:balance` pass. The normal-order Story bot
  wins at simulation time 155.05s; this is automated balance evidence.
- Real in-app browser: **105 checks passed** in `tests/browser.html`, including
  the shared book-effect checks, preservation of all original 23 entries, all
  eight new powers, costs/cooldowns/reset, completed-building exclusions,
  no archive spawning, and actual gathering/delivery from Colin’s cache.
- Browser UI checks verify the 22-entry book filter, both Isabelles, book-title
  and relationship search, no-results feedback, archive disabled controls,
  faction tabs and pause/resume. Existing browser RTS checks also passed.
- Visually reviewed the council at desktop 1280×720 and iframe viewport sizes
  390×844 portrait / 844×390 landscape. Names and book titles wrap; tabs wrap;
  search, scrolling and close work. Portrait dialog content width equals its
  348px client width (no horizontal overflow). Activated the monkey princess:
  supplies changed 300→235 and the button showed a 70s cooldown.
- Screenshots: `artifacts/book-roster-desktop.png`,
  `artifacts/book-roster-portrait.png`, `artifacts/book-roster-landscape.png`;
  text evidence: `artifacts/book-browser-checks.txt`. Artifacts are ignored and
  excluded from Pages. These phone-sized checks are not physical-iPhone tests.
- The fixture tab again reported the pre-existing unlocated MutationObserver
  instrumentation errors, without failing game checks. No new artwork or
  animation was added in this roster update; cards retain monogram portraits.

## Siege artillery — 2026-09-16, version 0.9.3

- `npm run check`, `npm test`, and `npm run test:balance` pass. The deterministic
  normal-order Story strategy wins at 162.70s. Existing 33-character rules remain.
- **130 real-browser checks pass** in `tests/browser.html`: deployment timings,
  no movement/separation while emplaced, no firing during transitions, spotting,
  range/blind spot, three splash bands, friendly fire, upgrades, withdrawal,
  attack-move relocation, same-rule AI, one-time casualty accounting and reset.
  Actual UI button activation, disabled setup control, Pack and D shortcut pass.
- An accelerated rendered Story playthrough won at 02:34 (14 casualties, 45
  supplies); simulation/automation is disclosed, not described as manual play.
- Direct rendered siege fixture inspected on desktop and 390×844 / 844×390
  phone-sized frames. Activated deploy and pack; watched shell hits scatter the
  enemy formation. Range rings, outriggers and countdowns render. Portrait footer
  bottom is 844px; landscape order controls stay visible. The setup button was
  shortened after a long label clipped in portrait. No physical iPhone claim.
- Representative 60-combatant fixture with artillery deployed: 120 rendered
  frames in 1999ms; mean draw .572ms (p95 .8), mean update .699ms (p95 .9), 64 total
  entities at sample end. The fixture explicitly steps simulation during this
  measurement even when UI focus pauses normal play. No bottleneck warranted
  speculative optimization in this increment.
- Evidence in ignored `artifacts/`: `siege-browser-checks.txt`,
  `siege-mode-desktop.png`, `siege-mode-portrait.png`,
  `siege-mode-landscape.png`, `siege-performance.json`.
- Browser cache query versions were bumped with final assets. Fixture buttons
  now wait for injected test scripts to finish loading. The existing unlocated
  MutationObserver messages occurred in iframe tooling; game assertions passed.
- New visuals use Canvas geometry and existing local atlases, not generated art.
  StarCraft-style overall fidelity remains incomplete; see STARCRAFT-GOAL.md.


## Materials economy — 2026-09-16, version 0.10.1

- Final `npm run check`, `npm test`, `npm run test:balance` pass. The normal-order
  Story bot builds/staffs a quarry with starting funds, recruits three guns from
  earned Materials and wins at 161.20s. This is automated balance evidence.
- Real browser suite: **164 checks passed**, including 30 shared Materials rules
  and four actual UI tests for Idle/I, production groups and stock display. Ten
  expansion checks also pass. Tests cover finite partial extraction, physical
  delivery, saturation, raids/restoration, destruction, prerequisite enforcement,
  both-resource costs/refunds, enemy Materials, fog inventory and reset.
- Manually used construction and Gather controls to build/staff a quarry; observed
  physical deliveries raise Materials to 120. Accelerated rendered normal-order
  Story victory: 02:41, 19 casualties, 23 Supplies. Unattended loss: 03:11. Clicking
  Deploy again returned to the start dialog with 300 Supplies, 0 Materials and
  00:00 clock. These are not claims of a full manual human playthrough.
- Inspected desktop and 390×844 portrait / 844×390 landscape layouts. Materials
  and six quick commands fit; landscape building and order controls remain visible.
  Portrait header scrollWidth equals clientWidth (390px). No physical iPhone test.
- Representative battle: 120 frames in 1999ms; mean draw .517ms (p95 .7), mean
  simulation .894ms (p95 1.1), 65 entities at sample end. No measured bottleneck
  justified speculative optimization. Measurement steps simulation during sampling.
- Evidence: artifacts/economy-browser-checks.txt, economy-story-result.txt,
  materials-quarry-desktop.png and materials-landscape.png. Artifacts remain
  ignored and excluded from deployment. Earlier fixture instrumentation produced
  unlocated MutationObserver messages; game assertions passed.
- Remaining scope: full enemy Supplies economy, expansion/rebuild behavior,
  longer Commander balance/composition comparisons and physical touch-device QA.

## Enemy economic base — 2026-09-16, version 0.11.2

- `npm run check`, `npm test`, `npm run test:balance` pass. Story normal-order
  balance bot wins at 230.70s with the new economic opponent. It uses earned
  Supplies/Materials; this remains automated evidence, not manual human balance.
- **191 real-browser checks pass**: 27 new checks cover physical enemy Supplies,
  removal of passive income, symmetric depot income, paid timed queues, worker
  replacement, bankruptcy, paid rebuilding, builder loss/reassignment, paid enemy
  repairs, population and Materials limits, visible threat decisions, expansion
  completion and resource conservation across 220s of autonomous economic growth.
- Rendered accelerated Story victory: 05:10, 34 casualties, 26 Supplies. Rendered
  unattended loss: 02:41. Deploy again returned to the Take command start screen.
  Browser and seeded Node results differ; neither proves balanced human openings.
- Inspected the 180s enemy-economy fixture: built forward homes and replacement
  barracks foundation are visible. The fixture reveals the map and destroys the
  barracks explicitly for review; it does not grant extra economic funds.
- Desktop review exposed six quick commands clipping in their old flex row.
  They now use a three-column/two-row grid: desktop scrollWidth/clientWidth both
  270px. Portrait (390×844) grid both 181px; 844×390 landscape controls also fit.
  Saved desktop, portrait and landscape screenshots under artifacts/enemy-economy-*.
  These are browser viewport checks, not physical iPhone/Safari validation.
- Existing 33 roster entries, powers and command checks pass. Basil now reduces
  actual queue training time by 20%, rather than accelerating instant unit spawns.
  Exact enemy funds are hidden; quarry worker labels include visible enemy miners.
- Remaining: adaptive expansion locations, enemy research, explicit unit-counter
  depth and sustained Commander/opening comparisons. The full gameplay goal is
  still active; this economic release is an increment, not completion.
- Combat performance fixture: 120 frames in 1998ms, mean draw .548ms (p95 .7),
  mean update 1.015ms (p95 1.3), 65 entities. This fixture measures combat with
  macro decisions disabled; extended economic AI profiling remains separate.

## Combined arms — 2026-09-16, version 0.12.2

- Syntax and engine suites pass. **218 real-browser checks pass**, adding 24
  counter/research rules and three actual sapper UI checks. Coverage includes
  armor bonus, cover/research scaling, completed-tech prerequisite, both costs,
  refund, timed production, actual scouting and intel expiry, faction research
  separation, queue exclusion, destruction, planned-research cancellation and reset.
- Simulated matchups retain suppression and recovery: a guard survives and drives
  a sapper from contested ground; two sappers force an unsupported gun to retreat.
  These are ground-control outcomes, not claims that every loser is killed.
- `npm run test:compositions` uses earned resources and normal orders. Results:

  | Difficulty | Opening | Outcome | Seconds |
  | --- | --- | --- | --- |
  | Story | Siege | Victory | 182 |
  | Story | Mixed, including sappers | Victory | 265 |
  | Commander | Siege | Defeat | 265 |
  | Commander | Mixed, including sappers | Defeat | 321 |

  Both enemy weapon technologies completed in all four runs. Mixed openings
  actually fielded sappers. This comparison is also in Actions; it checks valid
  scenario resolution and actual composition, not a forced victory assertion.
  Commander defensive viability remains unproven and is the next balance task.
- Rendered accelerated mixed-army Story victory: 03:32, 35 enemy casualties,
  37 Supplies. Browser results differ from the Node harness; this is
  automated play, not an extended human playtest.
- Reviewed new sapper pack and role panel in desktop, 390×844 portrait and
  844×390 landscape. Compact role text now fits landscape at 26px client/scroll
  height and names its weakness. No new generated art or physical device test.
- Evidence: artifacts/counter-browser-checks.txt, counter-compositions.txt,
  counter-mixed-story.txt, counter-landscape.png and counter-portrait.png.
- Rendered unattended loss occurred at 02:38; Deploy again returned to the start
  screen. All phone role text and evidence artifacts use the final compact copy.

- Initial CI composition gate correctly failed: the old mixed opening sometimes
  lost before producing a sapper. Fixed its normal build order to prioritize the
  first three sappers once tech is ready; retained the fielding assertion. Each
  scenario now resets RNG and unit IDs, preventing prior runs from affecting
  formation tie-breaks. The table above is the final isolated local comparison;
  runner/platform match timings may differ. Initial rendered mixed victory used
  the previous opening policy, while validating the same deployed game rules.

## Defensive command and attack reports — 2026-09-16, version 0.13.4

- Syntax and engine checks pass. Story balance still wins (182.20s after making
  restart unit IDs reproducible). New `npm run test:commander` wins at 728s with
  the palace intact, actual player-built fortification and deployed artillery.
  It uses ordinary actions and income; no starting-resource/stat/difficulty bonus.
- **238 real-browser checks pass**, including report grouping/expiry/bounds,
  camera cycling, retained selection/orders/pause, modal guards, end-state/reset,
  actual F3 and button input, two-note sound generation, mute and audio-start gates.
  Enemy positions are never disclosed by notifications: they record friendly damage.
- An initial rendered Commander run lost at 04:21. Investigation found persistent
  unit IDs affecting movement tie-breaks and accelerated fixtures adding both RAF
  and interval physics steps. Restart now resets IDs; accelerated fixtures own
  simulation time while RAF renders. The loss artifact is retained.
- Corrected rendered Commander run won at **15:24**, 157 enemy casualties. This
  is accelerated automated play, not a human balance guarantee. Node and browser
  still differ in long-match outcomes/timing; cross-runtime bitwise determinism is
  not claimed. The defensive opening is described in COMMANDER-OPENING.md.
- Manually clicked the attack banner while Guard School remained selected, both
  on desktop and 390×844 / 844×390 frames. Camera returns to the damaged palace;
  pause and selection remain. Banner width/scrollWidth both 183px in portrait.
  Landscape construction/production and order controls remain visible. No physical
  iPhone claim. Reports use static minimap rings and no camera shake.
- Artifacts: defense-browser-checks.txt, commander-defense-local.txt,
  commander-browser-initial-loss.txt, commander-browser-victory.txt/.png,
  attack-report-desktop.png, attack-report-portrait.png, attack-report-landscape.png.
- Remaining goal work: mixed-army selection subgroups, adaptive expansion locations,
  wider human opening/recovery balance and more directional artwork.

- Initial CI defense timed out alive at 1200s: regrouping after every moderate
  loss required rebuilding to 28 combatants after local Supplies ran out. The
  corrected policy commits an attack until severe losses, fields/replaces a
  scout for artillery sight, and places its tower on clear ground after the early
  economy is established. Victory assertions and the 1200s limit are unchanged;
  the test additionally requires reconnaissance. Final local policy wins at 583s
  with the palace intact. Earlier results above describe the initial policy.

## 0.14.0 selection subgroups (2026-09-16)

Added shared checks for isolated orders, cycling, casualty fallback, fresh selections,
control-group recall and restart. Real Chromium browser suite passes including actual
subgroup/All buttons, T shortcut and commander ability visibility. Manually exercised
390×844 and 844×390 iframe layouts; these are browser viewport checks, not physical iPhone QA.
Evidence: artifacts/subgroups-browser-checks.txt and subgroups-{portrait,landscape}.png.

Correction/qualification to the Commander opening evidence: the revised scouting policy
at 93b4e77 passed the CI Commander victory gate, but its rendered browser run lost at
07:06 with 49 enemy casualties (artifacts/commander-browser-final-policy.txt). The earlier
rendered 15:24 victory used the earlier policy. Cross-runtime strategy robustness and
extended human balance remain unresolved; no enemy stats or win assertions were weakened.

## 0.15.0 adaptive expansion (2026-09-16)

266 real-browser checks pass, including alternative sites under observed threat,
60-second threat-memory expiry, hidden-position/stock invariance, observed depletion,
two-expansion cap and reset. The rendered fixture changes the construction site from
1120,620 to 1320,850 after a visible raider appears; the 100-Supplies foundation is paid
and assigned to a real worker. Saved artifacts/adaptive-expansion-desktop.png and
adaptive-expansion-browser-checks.txt. This is a controlled scenario, not a human match.

Local syntax/rule checks and Story/composition simulations pass. The unchanged defensive
policy first stalled at 20 minutes with two workers and excess Materials. Its revised
ordinary gathering orders rebalance workers when Materials reach 150. The corrected
policy wins locally at 6:53 with the palace intact. An accelerated, actually rendered
Commander run wins at 14:31 with 110 enemy casualties. Evidence:
artifacts/adaptive-commander-browser.txt and adaptive-commander-victory.png. These outcomes
support viability of this opening, not general human balance or cross-runtime determinism.

## 0.16.0 resource memory (2026-09-16)

Shared VM/browser scenarios cover both factions: unknown-stock exclusion, remembered
quantities, hidden depletion, revisiting an exhausted cache, idle fallback, final cargo
delivery, new-worker assignment, rally memory, quarry requirements and restart.
Local syntax/rule tests, Story balance, composition scenarios and defensive Commander
victory pass (Commander 6:53, palace intact). Real browser regression and rendered stock
fixture verify last-seen labels. Artifacts: resource-memory-browser-checks.txt,
resource-memory-desktop.png and resource-memory-performance.json.

Representative rendered battle: 120 frames in 1997ms, 66 entities; draw mean .54ms/p95
.80ms, simulation update mean 1.17ms/p95 1.70ms. No measured observation bottleneck in
this scenario. No new layout or combat-balance claim is inferred from these timings.

## 0.17.0 production report (2026-09-16)

308 browser checks pass, including actual report button, F4, all-producer selection and
site-row selection. Shared rule checks cover current queue ETA, fourfold isolation
delay, mobilization, research's separate rate, queued recruits waiting for research,
missing construction labor, unchanged orders/pause, destruction, reset and mission end.
Rendered 390×844 portrait and 844×390 landscape panels fit the battlefield with scroll
access to lower sites. Selecting the remote school's row exposes its existing isolation
explanation and recruitment controls. This remains browser viewport testing, not physical
iPhone testing. Evidence is in artifacts/production-browser-checks.txt and production
screenshots, separate from deployed files.

## 0.18.0 housing raids (2026-09-16)

Reproduced the previous defect: destroying housing allowed a queued worker to finish,
producing 21 living units with capacity 20. The fix is covered for both factions: all
producers block at capacity; exact progress/payment survives; research continues; one
casualty permits exactly one recruit; unfinished homes do not help; completed homes
resume training. Recovery commanders wait without payment and return once when a slot
opens. Blocked cancellation retains its full refund.

Local syntax/rule checks, Story balance, both composition difficulties and the defensive
Commander victory pass (6:53, palace intact). Real browser checks and an actually rendered
housing-raid fixture exercise the new feedback. Manually selected the blocked palace,
resumed play and cancelled its recruit using the real button; refund dispatch appeared.
Evidence: artifacts/population-browser-checks.txt and population-block screenshots.

## 0.19.0 blocked waypoints (2026-09-16)

Reproduced a scout stuck indefinitely at approximately 734,615: its first waypoint was
inside the forest at 840,620 and a valid second waypoint stayed queued. Resolution now
completes at a free cell before advancing to the next order. Shared tests cover forest,
friendly-building attack-move, a new foundation occupying a previously clear destination,
and 24 units completing a queued round trip through the southern approach without
ending inside solids. The old palace-route test actually targeted the Guard School's
footprint and asserted only x>400; it now targets clear ground and requires arrival and
order completion. Blocked destinations have their own stronger regression cases.

337 real-browser checks pass. A normal-speed rendered scout fixture completes at 1043,847
with zero queued orders remaining. Evidence: artifacts/waypoint-browser-checks.txt and
waypoint-completed.png. This is navigation scenario evidence, not general human balance.

Updated local balance after movement correction: Story siege wins at 187s, Story mixed
at 375s; Commander siege loses at 199s, Commander mixed wins at 461s (palace 605 HP).
The defensive Commander opening wins at 742s with the palace intact. These scripted
outcomes changed through movement behavior, with no damage/cost/difficulty adjustment.

## 0.20.0 directional infantry (2026-09-16)

New generated atlas inspected for eight distinct faction/facing combinations and true
alpha. 348 real-browser checks pass, including image loading, cardinal angle mapping,
angle wraparound and pixel inspection of all eight crop margins. The rendered review
shows elephant and rhino front/back/left/right views using the actual runtime draws.
Original atlases remain intact; no equal-cell assumption or pixel editing was used.
Evidence: artifacts/directional-browser-checks.txt and directional-infantry-desktop.png.
Remaining art limits: static facing frames rather than walk cycles, and two-way artwork
for commanders, workers and artillery officers. No broader animation claim is made.

Reviewed the representative battle at 390×844 portrait and 844×390 landscape in the
real browser; screenshots are directional-battle-portrait.png and
directional-battle-landscape.png under artifacts/. This is responsive browser evidence,
not physical iPhone/Safari testing. The 66-unit performance sample completed 120 frames
in 1998ms: draw mean 0.57ms / p95 0.80ms; update mean 1.24ms / p95 1.60ms.
Raw measurements: artifacts/directional-battle-performance.json.

## 0.21.2 protection technology (2026-09-16)

Shared VM/browser checks cover tier prerequisites, incomplete buildings, payments,
cancellation, normal production completion, tier replacement, faction isolation,
new recruits, suppression, fractional-hit floor, repeated-volley survival and paid
enemy research. 366 real-browser checks pass. Real desktop and portrait research
buttons start research and show progress; descriptions wrap rather than overflowing.
Browser artifacts: technology-browser-checks.txt and technology-* screenshots.

Local earned-resource scenarios: Story siege win 187s; Story mixed win 282s;
Commander siege loss 199s; Commander mixed win 286s with palace 172.8 HP; defensive
Commander win 275s with palace intact. Enemy armor research appears in longer mixed
matches. These are scripted comparisons, not proof of general human balance.

Normal-speed portrait research completed, changing the disabled tier II card from
requiring tier I to requiring Artillery Works. Landscape review found overlapping
long card text; explicit content-sized grid rows fixed it. Cards scroll within the
command panel while retreat/hold remain accessible.

## 0.22.3 repeat patrols (2026-09-16)

Shared simulation checks cover at least four endpoint reversals, exit into a queued
move, queued patrol activation position, combat and resumption, unseen enemies, Hold,
forest endpoints, explicit resource-click handling and formation spacing. The combat
resume test samples maximum progress over time, because a patrol can already be on
its return leg when inspected.

380 real-browser checks pass at 390×844, including the actual touch Patrol button,
map pointer events, P keyboard event and an in-viewport control bounds assertion.
Normal-speed patrols were rendered and inspected at 844×390 and 390×844. Landscape
review caught the seventh command below the panel; a three-column compact layout
keeps all commands visible. Screenshots and report: artifacts/patrol-*. Physical
iPhone/Safari remains unverified.

## 0.23.1 building reconnaissance (2026-09-16)

392 real-browser checks pass. Shared checks verify both factions' scouted snapshots,
no visible/remembered duplication, hidden damage/research/queue isolation, unseen
destruction retention, sixty-second mobile report expiry, empty-site re-observation,
replacement identity and reset. Desktop and 390×844 rendered evidence saved in
artifacts/intelligence-*. Buildings show muted silhouettes, age and hollow minimap
markers; no current health or production appears outside vision.

Running the previous patrol bounds assertion at desktop height revealed that it
ignored the intended scrollable sidebar. It now scrolls the actual button into view
before testing viewport bounds, preserving the reachability requirement. This is not
a claim that every desktop command fits simultaneously without scrolling.

## Quarry raid comparison (2026-09-16)

Added four deterministic three-minute arms and a real-browser accelerated sapper
raid. The browser run matched the local sapper result exactly: 380 Materials
extracted, 285 banked, original quarry destroyed and rebuilt, two raiders survived,
and three enemy guns produced. Evidence: artifacts/raid-browser-result.json and
raid-browser-finish.png. This fixture deploys a predetermined force and disables
assault waves; it does not claim an earned-resource opening or whole-match balance.
See RAID-COMPARISON.md for all four results and the absence of a demonstrated
military-production advantage. test:raids now runs in the Pages check job.

## Paid full-match raid comparisons (2026-09-16)

Added test:earned-raids with four ordinary-resource Commander matches, early and
established sapper commitments, active assault waves and shared 180/270/360-second
snapshots where reached. See RAID-COMPARISON.md for all outcomes and limitations.
The default defense policy is unchanged; optional excluded-unit and hold-advance
arguments support the matched assembly/commitment experiment. The real browser
established raid reached a rendered victory at 4:59 with the palace intact, all four
sappers alive and the original quarry destroyed. Evidence is under artifacts/earned-raid-*.
No new gameplay or visual change is claimed for this test increment.

## 0.24.0 infantry gait (2026-09-16)

414 real-browser checks pass. New checks inspect all sixteen crop alpha margins,
loaded asset dimensions, stride/passing selection, actual navigation distance,
stationary behavior and the reduced-motion selection rule. The rule is tested via
its explicit parameter; the host OS reduced-motion preference was not toggled.
Normal-speed east/west traversal was rendered and inspected, with two snapshots
saved as walking-desktop-a/b.png. A representative phone portrait battle is saved
as walking-battle-portrait.png. All evidence lives under artifacts/.

A 66-unit sample completed 120 frames in 1998ms (~60Hz): drawing mean 0.51ms / p95
0.70ms, simulation mean 1.13ms / p95 1.50ms. Raw sample: walking-performance.json.
The new atlas is a two-pose stride/passing loop, not a full articulated cycle.
Other unit families retain their earlier movement artwork. Physical phone testing
and OS preference switching remain outside this verification.

## 0.25.1 — researched rapid advance

- `check`, `test`, `test:balance`, `test:compositions`, `test:commander`,
  `test:raids` and `test:earned-raids` all passed locally. The 18 shared ability
  checks cover paid prerequisite research, health cost, duration/cooldown, firing
  and movement multipliers, non-stacking commander speed, selection, pause,
  restart, and enemy visibility/health restrictions.
- Real in-app browser: 435 checks passed, including V activation, the actual
  disabled cooldown button and remaining-duration status. Actual button clicks
  activated the five selected guards in desktop, 390×844 portrait and 844×390
  landscape fixtures. Inspected gold rings, reduced health, wrapped readable
  button text and reachable controls. These are browser viewport checks, not
  physical iPhone/Safari verification. Ability fixture grants research solely to
  isolate interaction; ordinary paid research is exercised by the shared tests.
- Evidence: ignored `artifacts/rapid-browser-checks.txt`,
  `rapid-desktop-active.png`, `rapid-portrait.png`, `rapid-landscape.png`.
- Scripted Story siege/mixed wins: 187/282s. Commander siege loses at 199s;
  mixed wins at 286s with 172.8 palace health; defensive wins at 275s.
  Paid early sapper commitments still lose at 192–193s. Established main-army
  commitment wins at 284s; the raid arm now wins at 309s (previous release 469s),
  with four sappers alive and six enemy guns produced. This changed trajectory
  is recorded, not evidence that raiding is generally stronger: concentrated
  pressure still wins earlier under this policy. Broader human balance remains open.
- Representative real-browser battle: 66 units, 120 frames over 1998ms;
  draw mean/p95 0.534/0.700ms and simulation mean/p95 1.045/1.300ms.
  No new rendering bottleneck appeared in this bounded sample.
- Rendered accelerated Story playthrough reached victory at 03:04 with 21
  casualties; this is a separate browser run, not a numerical reproduction of the CLI
  comparison. Extended human matches and physical touch-device QA remain open.

## Infantry burst tactical comparisons — after 0.25.1

Added `test:burst` and a required CI step. Eight matched scenarios compare healthy
and wounded engagements plus distant/close withdrawals. All 21 checks passed in
CLI and the real browser; final numerical results agreed. See
BURST-COMPARISON.md for setup, results, discarded invalid placement and limits.
The normal-speed browser battle used the actual activation button and rendered
shots, health loss and the active ring. No game balance values changed in this
increment. JavaScript checks and the existing deterministic suite also passed.

## Paid doctrine opening comparison — after 0.25.1

Six complete seed-8 matches now compare continued troops, paid coordinated volleys,
and paid rapid doctrine on both difficulties. Tests verify identical pre-choice
state, exact research debits, no duplicate purchases and actual doctrine activation.
All six reached victory; research delayed the rapid-policy attack by roughly
50 seconds. See DOCTRINE-OPENINGS.md for full results and policy constraints.
Real-browser Commander doctrine playthrough rendered a victory at 335s, with
19 activations and undamaged palace; its result differs from the CLI harness. Later cross-runtime traces below identify numerical movement divergence.
No client rules or balance changed. The shared defensive test policy only adds an
optional school-reservation argument; its default behavior remains unchanged.


## Concurrent production and doctrine — after 0.25.1

`test:doctrine` now runs eight matches: the prior six plus paid second-school
research on both difficulties. Gates verify the extra 150-Supplies debit, a real
unfinished foundation, later completion and measurable simultaneous recruitment
and research. All eight passed. Story two-school won at 260s; Commander at 569s;
all prior six results remained unchanged. CLI seeds 9 and 10 repeated the two
Commander results exactly and therefore add no independent balance samples.

The real-browser two-school match and synchronous fixed-step diagnostic both won
at 288s, with 24 activations and 47 measured overlap seconds. The synchronous
trace found microscopic position differences from Node at t=1 that grew over the
match. See DOCTRINE-OPENINGS.md; the earlier random-sequence explanation is withdrawn.
No client rules or costs changed. Existing checks/tests pass. Evidence is stored
under ignored `artifacts/parallel-doctrine-*` and `doctrine-*-trace.json`.

## 0.26.1 — saved camera locations

- Existing deterministic suite plus 22 camera checks passed. Coverage includes
  snapshot copies, position/zoom bounds, empty/replaced slots, selection and order
  preservation, pause, all three modal guards, shortcut repeat/modifier handling,
  mutual exclusion with production, mission end and restart.
- Real-browser suite: 460 checks passed, including the actual F5 key handler,
  Views button and Save/Go controls. Direct inspection at desktop, 390×844 portrait
  and 844×390 landscape verified the added toolbar control and scrollable panel.
  Saved the fourth slot, recalled the second, reopened the panel and closed it;
  the final compact header remains visible while scrolled. These are viewport and
  browser interactions, not physical iPhone or hardware function-key verification.
- Local evidence: `artifacts/camera-browser-checks.txt`, `camera-desktop.png`,
  `camera-portrait.png`, `camera-landscape.png`. New UI has no animation or camera
  easing and does not change simulation balance.
- With the camera panel open, a 69-unit browser battle rendered 120 frames in
  1996ms: draw mean/p95 0.637/0.900ms; simulation mean/p95 1.282/1.500ms.
  This bounded sample showed no new frame-time bottleneck.

## 0.27.2 — workforce reporting and group construction

- Syntax and deterministic suites passed, including 21 workforce checks for
  assigned/extracting/cargo/approach/waiting counts, read-only behavior, hidden
  depletion, quarry requirements, supply restoration, missing delivery routes,
  group-building costs, one-builder assignment and preserved gathering orders.
- Real-browser suite: 488 checks passed. UI assertions cover report fields,
  isolated/restored quarry text, actual group construction and equal-size mixed
  selection invalidation. Inspected desktop, 390×844 portrait and 844×390 landscape
  reports and construction buttons. Physical phone testing remains unverified.
- A 66-unit rendered battle with worker labels active produced 120 frames in
  1997ms; drawing mean/p95 0.505/0.700ms and simulation mean/p95 1.075/1.500ms.
  No measured frame bottleneck warranted a speculative optimization.
- Evidence: ignored `artifacts/workforce-browser-checks.txt`,
  `workforce-desktop.png`, `workforce-portrait.png`, `workforce-landscape.png`,
  `workforce-performance.txt`. Occupancy is a current-tick snapshot and changes
  naturally as provisioners leave to deliver; assignment count is not an optimal
  staffing recommendation. No extraction rates, income or unit balance changed.


## 0.28.1 — queued worker construction

- Syntax and deterministic suites passed, including 23 shared construction checks:
  immediate payment, queue capacity, sequential labor, gathering resumption,
  explicit follow-up orders, cargo delivery, one-time cancellation refunds,
  destroyed sites, dead/replacement builders, Hold, retreat completion, depleted
  resources and blocked Materials gathering followed by quarry construction.
- Real Chromium browser suite: 514 checks passed, zero failed. Three additional
  UI assertions use touch Queue, Shift-pointer placement and selected-foundation
  reporting. The report distinguishes queued, active and halted construction;
  unfinished sites show paid-foundation guidance rather than training isolation.
- Inspected desktop, 390×844 portrait and 844×390 landscape. Selected a queued
  school through Production; used its actual cancellation button in portrait and
  observed the 75% refund. A normal-speed rendered chain completed both buildings
  and the school became an idle producer. Physical iPhone/Safari remains untested.
- A 66-unit representative browser battle rendered 120 frames in 1999ms.
  Drawing mean/p95: 0.513/0.600ms; simulation mean/p95: 0.851/1.200ms.
  This bounded sample did not reveal a frame bottleneck needing optimization.
- Evidence: ignored artifacts/build-queue-browser-checks.txt,
  build-queue-desktop.png, build-queue-portrait-selected.png,
  build-queue-landscape.png and build-queue-performance.txt. Scripted checks are
  distinct from the normal-speed visual/control inspections above. Foundations
  are paid and vulnerable as soon as placed; queueing does not reserve future
  spending or guarantee safety. No costs or work durations changed.


## 0.29.1 — scouted economic raids and reachable approaches

- Syntax and deterministic suites passed. Nineteen planner checks cover unscouted
  sites, hidden-state isolation, persistent static defenses, stale worker/mobile
  reports, target priority, army split limits, role choice, both approaches,
  concentration when no safe target exists and retained withdrawal orders.
- Five shared execution checks use legal fixture structures and clear unit starts.
  At 60s, an exposed outpost lost its home and both workers after 20 Supplies were
  extracted; the observed-tower branch detached no raiders, retained both workers
  and the intact 450-health home, and extracted 130 Supplies (120 delivered).
  The main column is held away from this controlled comparison. It is not an
  earned-resource full opening, and cannot establish general tower balance.
- This comparison initially failed because the protected workers became stuck at
  an unreachable nearest approach. Navigation now retains a reachable alternate
  approach until reached; returning workers no longer re-enter the same pocket.
  The comparison requires repeated extraction, not just one successful delivery.
- Real Chromium browser suite: 538 checks passed, zero failures. Inspected the
  normal-speed rendered raid and used the actual Retreat button for provisioners.
  Recorded desktop raid aftermath and inspected the defended delivery fixture in
  a 390×844 portrait viewport. No physical-phone/Safari verification is claimed.
- After the navigation fix, full-match Node comparisons: Story siege won at 180s;
  Story mixed won at 374s with 429 palace health; Commander siege lost at 256s;
  Commander mixed won at 375s; defensive Commander won at 268s with 1800 palace
  health. The intermediate pre-navigation Commander mixed loss at 441s is not the
  final release result. These scripted policies do not prove broad human balance.
- A 66-unit representative browser battle: 120 frames in 1996ms; drawing mean/p95
  0.512/0.700ms; simulation mean/p95 0.903/1.400ms. No new measured bottleneck.
- Ignored evidence: artifacts/enemy-operation-browser-checks.txt,
  enemy-operation-performance.txt, enemy-economic-raid-desktop.png and
  enemy-defended-outpost-portrait.png. Current full-match logs supersede historical
  timings when comparing this version; cross-runtime long-match divergence remains.


0.29.1 publication follow-up: the original quarry comparison gate failed after
the navigation correction improved enemy worker recovery. Added 45s/90s checkpoints
and retained a 20% active-attack disruption requirement for both compositions, plus
20% final denial for demolition. Removed the misleading total-spending-as-repair
proxy; see RAID-COMPARISON.md for exact measurements and rationale. The real-browser
accelerated Story playthrough also reached victory at 02:59 with normal starting
resources; this supplements, rather than replaces, normal-speed fixture inspection.


## 0.30.0 — sustained paid reconnaissance

- Syntax and deterministic suites passed, including 21 reconnaissance checks:
  opening time, normal queue/payment, duplicate prevention, replacement interval,
  affordability, destroyed production, hidden/static/mobile memory, danger response,
  retained withdrawal, recovery, assault exclusion, a two-minute multi-route circuit,
  actual capital discovery and mission reset.
- The autonomous economy equality now includes measured owned-depot income; scouts
  can alter depot ownership. The check still requires spending, inventory and cargo
  to equal starting funds plus gathered and depot Supplies.
- Real Chromium suite: 559 checks passed. Inspected the paid scout traversing all
  four routes and beginning another circuit in a normal-speed rendered fixture.
  Player fog is revealed in this fixture only to inspect motion; enemy knowledge
  still uses its own vision. The observer timer is separate from the accelerated
  simulation timer and uses the normal three-second planning cadence. No physical
  phone/Safari verification is claimed. No production UI controls changed.
- Full local suites passed: balance, compositions, Commander, controlled raids,
  earned raids, burst and doctrine comparisons. Current Node timings: Story siege
  won at 177s; Story mixed won at 279s; Commander siege lost at 194s; Commander mixed
  lost at 441s; fortified Commander won at 276s. These scripted offensive losses
  remain visible evidence for further counterplay/balance work, not passing claims
  that every opening is viable. Established paid raid/main-army branches both won
  around 300s; those policies start from a defended economy.
- A 66-unit representative browser battle rendered 120 frames in 1998ms. Drawing
  mean/p95 0.557/0.700ms; simulation mean/p95 0.954/1.300ms. No measured frame
  bottleneck required an optimization.
- Evidence under ignored artifacts/: recon-browser-checks.txt,
  recon-performance.txt, recon-circuit-desktop.png, recon-circuit-result.txt and
  recon-circuit-landscape.png. Older balance timings describe their release only.


## 0.31.0 — battery feedback and paid offensive timings

- Syntax and deterministic suites passed. Twelve battery checks cover mobile and
  deployed state, hidden targets, forward observation, reload, friendly-fire risk,
  read-only behavior, the blind spot, dead threats, packing, group selection and
  observer loss. Single-gun information no longer gets overwritten by generic role
  text. The report does not stop a shot or alter any combat rule.
- Real Chromium suite: 571 checks passed. Inspected desktop, 390×844 portrait and
  844×390 landscape. Used Resume and the actual Pack artillery control in portrait;
  the report changed to its mode-transition state. Current morale and range remain
  visible. Physical device/Safari testing remains unverified.
- A 64-unit battle with six player guns selected rendered 120 frames in 1998ms;
  drawing mean/p95 0.554/0.700ms, simulation mean/p95 0.928/1.300ms. The report did
  not introduce a measured frame bottleneck in this bounded sample.
- Paid Commander comparisons use identical pre-commitment economy/army records,
  normal gathering/recruitment and current visibility. Default 18-unit Node march
  won at 343s, staged push at 288s. Exploratory 14/24-unit commitments show that
  waiting for a larger force does not always improve the result. Exact commands,
  measurements and limits are in PUSH-COMPARISON.md; CI now runs test:push.
- Real-browser 18-unit staged push was unresolved at 901s; no victory is claimed.
  The browser observation window now caps and pauses at 900s instead of resuming
  uncontrolled simulation after the fixture timer stops. The earlier 14-unit push
  won in Chromium at 345s, after regrouping once, with the palace at 1800 health.
  These are accelerated rendered matches, separate from normal control/layout QA.
- Ignored evidence: artifacts/battery-browser-checks.txt, battery-desktop.png,
  battery-portrait.png, battery-landscape.png, battery-performance.txt,
  push-staged-browser-unresolved.json, push-early-browser.json and
  push-early-victory.png. The unresolved run remains part of the evidence.

## 0.32.0 — minimap commands (2026-09-17)

Baseline and updated JavaScript/atlas checks and deterministic tactical suite pass.
Nine shared minimap checks cover panning, selection preservation, contextual move,
Shift queues, attack-move, outside release, pause, paid-placement protection,
rallies and reset. Four browser-only assertions exercise registered PointerEvent
listeners for touch dragging/attack-move, mouse Shift queues and cancellation.
The real in-app Chromium browser passes **584 checks** at desktop, 390×844
portrait and 844×390 landscape sizes. Screenshots inspected and saved as
`artifacts/minimap-{desktop,portrait,landscape}.png`; full check output is
`artifacts/minimap-browser-checks.txt`. The main game was also started directly;
Army selection followed by an actual tool mouse right-click on the minimap
returned “Orders confirmed.” Pause/resume worked. Touch events were synthetic,
not a physical iPhone test. No new full-match balance claim is made by this input
change; full scenario regressions remain in the publication workflow.

## 0.33.0 — independent headquarters (2026-09-17)

Syntax/atlas and deterministic tactical checks pass. Seventeen shared camp checks
cover scouting, paid foundations, cancellation, population, worker recruitment,
rallies, independent supply and severed links, destruction, faction symmetry and
report-based enemy planning. Three browser-only checks use the actual build
button and synthetic touch placement and confirm the control is reachable.
The real in-app Chromium browser passes **604 assertions** at desktop, 390×844
portrait and 844×390 landscape. The protected expansion fixture was rendered
through four simulation minutes; its 2,100 delivered Supplies and 2,200 available
Supplies match Node. Desktop and mobile screenshots were inspected, including the
original Canvas tent, local workers, production actions and minimap. The selected
camp description was shortened so compact panels retain readable orders.

Evidence: artifacts/headquarters-browser-checks.txt,
artifacts/headquarters-economy-browser.json and
artifacts/headquarters-{desktop,portrait,landscape}.png. Controlled home/protected/
destroyed camp results are documented in EXPANSION-COMPARISON.md and enforced by
`npm run test:expansion`. This isolates delivery economics with identical crews;
it does not establish a full-match expansion build order. Touch is synthetic and
viewports are browser frames, not physical Safari testing. No subjective audio
claim or new all-roster art claim accompanies the procedural headquarters asset.

## 0.34.0 — paid openings and delivery feedback (2026-09-17)

`npm run test:expansion-openings` completes three normal-resource Commander
matches: army-first wins at 255s, early camp loses at 189s, secured camp wins at
396s. Assertions cover identical first-minute state, actual camp payment/work/
deliveries, a measured defensive cost and a viable protected alternative. Exact
match times and mandatory early defeat are not assertions.

Actual rendered Chromium matches also reach terminal results: army-first wins at
345s, early camp loses at 189s and secured camp wins at 476s. The secured palace
remains at 1,800 health; the early camp survives but the palace falls. Screenshots
show both mission result overlays and the selected camp's real delivery total.
These are accelerated fixed-step scripted matches; no manual competitive balance
or cross-runtime lockstep equivalence is claimed. Rounded receipt totals differ
from the integer-floor status display by at most one Supply.

Eight added shared receipt checks cover physical delivery, no double credit,
separate Materials, the council bonus, live display, read-only reporting,
destruction and faction parity. The real browser passes **612 assertions** at
desktop, 390×844 portrait and 844×390 landscape. The camp report is unclipped and
shows its own receipts: in the controlled four-minute fixture, 2,040 Supplies
reach the camp and 60 reached home while it was being built (2,100 total).
Phone-sized frames and synthetic touch events are not physical Safari testing.

Artifacts: early-expansion-browser.json, early-expansion-loss.png,
secured-expansion-browser.json, secured-expansion-victory.png,
army-opening-browser.json, delivery-browser-checks.txt and delivery portrait/
landscape screenshots under artifacts/. See EXPANSION-OPENINGS.md for methodology
and the distinction between gross camp receipts and net profit.

## 0.35.0 — fixed clock and movement consistency (2026-09-17)

All existing deterministic tactical, balance, composition, Commander, raid,
earned-raid, burst, doctrine, push and controlled-expansion checks were rerun.
The full-match expansion assertion was corrected for the verified zero-income
losing camp; protected expansion must still win and receive more than its direct
expenditure. Rationale and exact new outcomes are in SIMULATION-CONSISTENCY.md.

Fifteen shared clock assertions bring the real-browser suite to **627 passing
checks** at desktop, 390×844 portrait and 844×390 landscape. They cover multiple
frame rates, uneven frames, sub-tick accumulation, interpolation without changing
simulation positions, pause, restart, ended missions and capped stall recovery.
The browser reports Chrome 152.0.0.0. No physical Safari claim is made.

The full Commander clock replay wins at 282s in both Node and Chromium. The entire
captured final result and seven recorded state snapshots compare exactly equal. Node
also compares full runs at 30/60/144 FPS. A separate actual rendered Story fixture
wins at 03:05; the early-expansion browser fixture confirms the new 380s loss,
zero workers, zero camp cargo and camp destruction at 202s. These results are
scripted/accelerated except for the representative live-frame measurement.

The corrected performance fixture gives simulation time one owner, warms up one
animation frame, records frame gaps/capped time, and pauses at completion. In a
69-object battle, 120 frames / 2,000ms advance exactly 40 ticks / 2s, with no
clipped time. Draw mean/p95 1.02/1.60ms; simulation work per display frame mean/p95
0.78/2.80ms. No measured bottleneck required further optimization. The first
startup-stall sample is retained and explained separately, not relabeled as this
active-frame measurement.

Artifacts: clock-node-trace.json, clock-browser-trace.json,
clock-performance-active.json, clock-battle-desktop.png, clock-browser-checks.txt,
clock-story-result.txt, clock-story-victory.png, clock-early-expansion.json,
clock-portrait.png and clock-landscape.png under artifacts/. Synchronous long QA
buttons can exceed the tool's click timeout; their existing completed report was
read afterward instead of restarting the run. QA cache versions now cover both
the iframe document and its script bundle.

The secured-expansion browser rerun also wins at 330s. Its complete reported result
and the early-expansion report exactly equal Node outputs; the protected camp
receives 1,800 Supplies against 600 spent. Evidence: clock-secured-expansion.json.
The actual Deploy again button was clicked after that victory; Take command and
Pause then worked in the reloaded game, with the clock at 00:00 and no old backlog.

## Current-scope audit and original support effects

All 28 public client files byte-match 5db2027 (artifact:
clock-public-verification.txt). Public Take command and Pause were clicked.
The current unattended Story browser fixture loses at 02:33; Deploy again,
Take command and Pause work after that defeat. This is accelerated actual-browser
gameplay, not a manually defended match.

Eight formerly Node-only numerical council checks now share support-checks.js
with the browser. Three added assertions cover Alexander's 25-second delay and
Louise's 250 fortress health/capacity increase without repeated bonuses. Node
tactical checks pass; portrait Chromium runs **638 passing assertions**. Evidence:
artifacts/audit-support-browser.txt. No game rules changed in this audit.
CURRENT-AUDIT.md records remaining console attribution and media-preference proof.

## 0.35.1 — motion preference and field-manual lifecycle

The field manual now offers System, Reduced and Full motion. The system mode
reads the actual media query and listens for subsequent preference changes; an
explicit choice persists locally. Reduced mode uses the existing renderer's
static infantry poses and disables walking bob and drifting dust. Simulation
orders, positions, health and timing are unchanged.

A new browser assertion exposed the field manual leaving an originally running
mission paused. Closing it now restores the prior pause state, including when
it was already paused. Native close events are asynchronous, so the browser
check waits for a frame before inspecting the restored state.

Syntax/atlas checks and Node tactical checks pass. **647 real-browser assertions**
pass at desktop, 390×844 portrait and 844×390 landscape. They exercise the actual
selector, renderer mode, visible status, stored preference, actual system-query
value, unchanged simulation state, resume and preservation of an existing pause.
Manual selection of Reduced, reload, new mission and reopening the manual retained
Reduced. The system default was restored after testing. Artifacts: motion-*-checks.txt
and motion-portrait.png. OS-level preference switching was not emulated: the
supported browser API exposes no media override. This is distinct from the
verified in-game reduced/full choices and reading the actual system preference.

The console did record the historical unlocated MutationObserver error during
iframe navigation. A script-free blank iframe control page reproduced the exact
error, establishing that it does not require game or QA scripts. It is retained
in motion-blank-control-errors.json, not suppressed. A standalone client load,
start, motion change, close and automatic resume produced **no captured warnings
or errors** in its timestamp-bounded observation (motion-standalone-errors.json).
This scoped observation does not claim every possible future session is error-free.

## 0.36.0 — on-screen selection micro (2026-09-19)

Syntax/atlas and Node tactical checks pass. Thirteen new shared assertions cover
on-screen matching, faction/life filtering, append/deduplication, Shift removal,
ordinary replacement, unchanged orders/time/camera, pause/modal guards and
matching production buildings. Six focused browser checks exercise actual
Ctrl-click, Shift-click and double-click listeners, the touch action, its viewport
reachability, and mixed-selection behavior. All **19 focused checks** pass in
Chromium at desktop, 390×844 portrait and 844×390 landscape. Reports are saved
as artifacts/selection-{desktop,portrait,landscape}.txt.

This run does not claim the previous full 647-check browser suite passed again.
The preview loads scripts and runs the focused synchronous fixture, but automation
input dispatch times out, native dialog close events do not complete, and screenshot
capture fails. Reopening the preview and explicitly sizing it did not resolve
those problems. The full suite reaches the existing motion/dialog checkpoint and
waits. Its dialog waits now use the actual close event instead of an animation
frame. A run=type URL runs just the changed controls; run=suite retains the full
suite. These are local-only test controls, not deployed game features.

New visual screenshots and native-input manual testing remain blocked by that
preview limitation. The changed action is reachable according to browser geometry,
and existing deployed artwork/layout have not been redesigned in this increment.

## 0.37.0 — character portraits and sprites (2026-09-19)

- Created and visually inspected six generated PNG sheets covering all 33 existing roster ids. Inspected each full-body crop against decoded alpha; no opaque silhouette pixels cross crop edges. Images are single-pose sprites with portrait crops, not new animation cycles.
- Passed `tests/check.cjs` (including new PNG decoder/crop validation) and `tests/tactics.cjs` (existing simulation/support-power regressions). Local npm is absent in this runtime, so ran the exact package-script targets directly with bundled Node. CI still runs the named npm commands.
- Real Codex in-app browser: gallery loaded, manual Cornelius search returned one matching card. DOM layout checks at 390×844, 844×390 and 1280×900 showed all 33 cards and no horizontal page overflow.
- `tests/art-browser.html`: **117 real-browser checks passed**. All six actual image decodes, 33 Canvas draws with visible and transparent pixels, 33 portrait/full-body SVG pairs, search/empty/reset, and all three council tabs at widths 390, 844 and 1280. No warning/error console entries.
- Screenshot capture returned “Unable to capture screenshot.” Generated source sheets were visually inspected, but final composited page screenshots and a fresh manual animated-game playthrough remain unverified. The source-authored browser fixture dispatches events for its checks; it is not a claim of manual touch playtesting. Existing gameplay and battle animations were not changed in this artwork release.
- Review evidence: `artifacts/character-art-browser.txt` (ignored, not deployed). Raw online reference images also remain ignored under `artifacts/character-references/`.

## 0.38.0 — commander animation (2026-09-20)

- Generated and inspected 16 frames each for Babar and Rataxes: four facings, idle, two walking poses and fire. Corrected the rear-facing Babar firing pose. Preserved actual 1254px RGBA outputs; hand-registered feet and muzzle locations. Decoded crop checks confirm no opaque edge clipping in all 32 frames.
- Passed the exact `npm run check` and `npm test` script targets using bundled Node (`tests/check.cjs`, `tests/tactics.cjs`); local npm remains unavailable. No balance rules changed. CI runs npm commands and the wider regression suite.
- Real in-app browser: **309 commander checks passed** at 390×844, 844×390 and 1280×900. Actual PNG decoding and Canvas drawing for all 32 poses at each size, actual simulation movement and shot timestamps, firing pose, reduced flashes, pause preservation, full battlefield draw, no horizontal layout overflow.
- Visually inspected the actual browser-rendered frame review, saved as `artifacts/commander-rendered-review.png`. This is a Canvas test render, not a full-page screenshot or a manual moving-game playthrough. All directional silhouettes and muzzle positions were readable at battlefield scale.
- Full-page screenshot capture remains unavailable. Browser log contained one unlocalized `MutationObserver.observe` TypeError (no source URL); the project contains no MutationObserver calls and the fixture completed, but its origin was not established. Do not report an entirely clean console or full manual animation QA.
- Compact two-pose gait; four cardinal facings (diagonals snap to nearest facing). A smoother, longer gait and diagonal art remain future refinement.
