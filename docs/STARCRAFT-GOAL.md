# Active gameplay goal: as close as possible to StarCraft

The goal remains active. The gameplay and evidence below are maintained against the current source. Passing a small skirmish's tests
is not evidence of overall StarCraft-like fidelity.

The original constraints still apply: one polished static single-player Babar
skirmish, mouse and touch, existing artwork/source preserved, the full character
crossover, no accounts/backend/multiplayer requirement, and GitHub Pages delivery.

| Dimension | Current authoritative evidence | Remaining work / proof needed |
| --- | --- | --- |
| Physical worker economy | game.js gather/deliver loop; regression checks | Extraction slots, idle-worker selection and finite Materials quarries implemented/tested; workforce reports now separate assignment, extraction, hauling and blocked supply; grouped builders preserve other gatherers; independent headquarters and three paid Commander openings now measure construction/escort opportunity cost and viable secured expansion (EXPANSION-OPENINGS.md); broader human balance remains unverified |
| Construction and production | Worker-built structures, paid queues, cancellation, rally, control groups | Guard School gates Artillery Works; dual-resource costs, multi-producer allocation and housing-raid production blocks implemented; two-tier infantry protection now competes with weapons and recruitment; researched infantry burst now adds a health-for-tempo micro decision; paid Shift/touch construction chains now preserve delivery and gathering with explicit queue status and cancellation; broader build-order comparisons remain |
| Army composition | Guards, scouts, artillery, commanders; research and abilities | Sappers counter armored guns/structures and guards counter sappers; four composition scenarios recorded. Historical composition results vary by opening and release; current paid offensive results are recorded in PUSH-COMPARISON.md and EXPANSION-OPENINGS.md. Eight controlled burst comparisons now verify health-for-tempo tradeoffs (BURST-COMPARISON.md); paid doctrine openings now compare one versus two schools and research opportunity cost (DOCTRINE-OPENINGS.md); concurrent production is verified but Node/Chromium position rounding diverges over long matches; paid direct/staged offensives now compare 14/18/24-unit commitments; the early staged push won in both Node and Chromium, while the 18-unit browser run remained unresolved at 15 minutes. Broader offensive resilience and human balance comparisons remain |
| Positional combat | artillery.js now implements timed siege deployment, spotting, friendly splash and blind spot | Live battery reports now expose spotting, reloads, blind spots and friendly-fire risk. Staged Commander pushes have paid full-match evidence (PUSH-COMPARISON.md); broader tactical content remains open |
| Enemy macro | enemy-economy.js runs physical Supplies/Materials gathering, paid queues, worker replacement, rebuilding and connected expansion | Paid enemy tech research and scouted counter recruitment implemented; adaptive scouted expansion choices implemented; controlled quarry raids now reduce extraction but do not reduce gun production; see RAID-COMPARISON.md. Paid full-match comparisons now show early sapper commitments lose, established commitments win, and combined main-army pressure beats this raid policy at equal time. Scouted economic raids now detach a limited squad, avoid remembered defenses and preserve withdrawals; controlled outpost defense also covers repeated delivery around crowded approaches. Broader paid offensive responses remain to compare |
| Commands and readability | A*, formations, blocked-waypoint completion, 24-unit queued route, hold/retreat, group and rally UI; browser checks | Idle-worker shortcut and live global production report implemented; attack reports with F3/touch and minimap rings implemented; selection subgroups implemented with isolated orders and retained All selection; repeat patrol routes now support guarded scouting and queued exits; four saved camera positions/zoom levels now support base/front switching without changing army selection |
| Fair scouting | sees() gates targeting; siege checks require forward spotting | Building-memory snapshots now persist through unseen destruction and clear on re-observation for both factions; mobile reports expire after 60s. One paid reconnaissance scout now revisits routes, avoids remembered defenses, withdraws and recovers; replacement purchases honor resources, population and queue time. Two-minute route and hidden-state checks pass; broader long-match economic decision fairness remains to verify |
| Presentation and controls | Local Babar art, audio, command UI, desktop/mobile QA | Four-way infantry facing implemented; commanders/workers/artillery officers retain two-way art. Two-pose infantry gait now follows movement distance. Full gait cycles for other units, physical Safari/touch and extended human balance remain unverified |
| Publication | Public GitHub and Pages; every release runs checks | Verify the current commit, terminal workflow result and public assets after each release |

Reference for this combat increment: Blizzard's
[Terran siege-tank push guide](https://news.blizzard.com/en-us/article/5740271/game-guide-terran-siege-tank-push)
describes screened, spaced artillery positions and friendly splash risk. The
mechanical design here uses original Babar assets, names and balance values.

Next substantive work: audit remaining combat, presentation and long-match reconnaissance gaps against the original scope.
Fog-aware depleted-stock worker fallback, recruitment and resource rally handling are implemented.
Selection subgroups now avoid reselecting a mixed army for specialist orders. Adaptive expansion locations are implemented; wider human balance remains open. Do not mark the broad goal complete
on the strength of the artillery release alone.

## 0.32.0 — command from the minimap

Minimap camera dragging, right-click contextual orders/rally points, Shift/Queue
waypoints and explicit touch orders now share battlefield command rules.
Thirteen added checks cover rule behavior and browser pointer listeners. This
closes a concrete command responsiveness gap. The broader goal remains active;
the outstanding balance, expansion and visual evidence above still needs review.

## 0.33.0 — independent economic expansion

Field Headquarters enable worker-built remote economies on currently scouted
ground: 400 Supplies, 30s construction, independent supply root, delivery and
worker production, +10 population. Enemy macro considers the same paid structure
when current reports show local depletion and a safe remote resource opportunity.
A four-minute controlled comparison measures investment/payback and destruction
cost (EXPANSION-COMPARISON.md); protected-camp income matches real Chromium.
Full-match expansion timing versus army expenditure remains unproven and is the
next substantive economic comparison. No change to the palace-loss objective.

## 0.34.0 — full-match expansion decisions

Three normal-resource Commander openings share an identical first minute and
measure army-first, early camp and depot-secured camp policies. Node and real
Chromium both show an early defensive cost and a viable secured expansion, with
different exact timings. Headquarters now expose actual per-resource delivery
receipts. Cross-runtime trajectory divergence remains an explicit limitation;
the complete original-scope audit has not yet proved overall goal completion.

## 0.35.0 — fixed simulation and matched runtime replay

Live play now uses fixed ticks and smooth presentation interpolation. The full
Commander doctrine replay and all seven state snapshots match Node and Chromium,
and Node's 30/60/144-FPS runs are identical. Historical runtime-divergence warnings
above apply to earlier releases; SIMULATION-CONSISTENCY.md records the tested fix
and its limits. Existing balance scenarios were rerun after trajectory changes.
The next step is the complete current-source audit against the original scope,
not assuming that a passing replay establishes every deliverable.
