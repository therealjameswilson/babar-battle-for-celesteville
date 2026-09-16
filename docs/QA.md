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
Deterministic run reaches victory at 155.05s; differing frame/random timing means
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
  37 Supplies. Browser randomness differs from seeded Node evidence; this is
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
