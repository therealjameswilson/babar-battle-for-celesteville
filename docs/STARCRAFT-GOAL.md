# Active gameplay goal: as close as possible to StarCraft

The goal remains active. The gameplay and evidence below are maintained against the current source. Passing a small skirmish's tests
is not evidence of overall StarCraft-like fidelity.

The original constraints still apply: one polished static single-player Babar
skirmish, mouse and touch, existing artwork/source preserved, the full character
crossover, no accounts/backend/multiplayer requirement, and GitHub Pages delivery.

| Dimension | Current authoritative evidence | Remaining work / proof needed |
| --- | --- | --- |
| Physical worker economy | game.js gather/deliver loop; regression checks | Extraction slots, idle-worker selection and finite Materials quarries implemented/tested; workforce reports now separate assignment, extraction, hauling and blocked supply; grouped builders preserve other gatherers; meaningful expansion pressure and long-game opening comparisons still need work |
| Construction and production | Worker-built structures, paid queues, cancellation, rally, control groups | Guard School gates Artillery Works; dual-resource costs, multi-producer allocation and housing-raid production blocks implemented; two-tier infantry protection now competes with weapons and recruitment; researched infantry burst now adds a health-for-tempo micro decision; paid Shift/touch construction chains now preserve delivery and gathering with explicit queue status and cancellation; broader build-order comparisons remain |
| Army composition | Guards, scouts, artillery, commanders; research and abilities | Sappers counter armored guns/structures and guards counter sappers; four composition scenarios recorded. Latest movement checks: siege rush loses Commander, mixed and fortified openings win in local scripted scenarios. Eight controlled burst comparisons now verify health-for-tempo tradeoffs (BURST-COMPARISON.md); paid doctrine openings now compare one versus two schools and research opportunity cost (DOCTRINE-OPENINGS.md); concurrent production is verified but Node/Chromium position rounding diverges over long matches; broader offensive openings and human balance comparisons remain |
| Positional combat | artillery.js now implements timed siege deployment, spotting, friendly splash and blind spot | Siege-specific long-game and Commander strategy comparisons remain; broader tactical content remains open |
| Enemy macro | enemy-economy.js runs physical Supplies/Materials gathering, paid queues, worker replacement, rebuilding and connected expansion | Paid enemy tech research and scouted counter recruitment implemented; adaptive scouted expansion choices implemented; controlled quarry raids now reduce extraction but do not reduce gun production; see RAID-COMPARISON.md. Paid full-match comparisons now show early sapper commitments lose, established commitments win, and combined main-army pressure beats this raid policy at equal time. Scouted economic raids now detach a limited squad, avoid remembered defenses and preserve withdrawals; controlled outpost defense also covers repeated delivery around crowded approaches. Broader paid offensive responses remain to compare |
| Commands and readability | A*, formations, blocked-waypoint completion, 24-unit queued route, hold/retreat, group and rally UI; browser checks | Idle-worker shortcut and live global production report implemented; attack reports with F3/touch and minimap rings implemented; selection subgroups implemented with isolated orders and retained All selection; repeat patrol routes now support guarded scouting and queued exits; four saved camera positions/zoom levels now support base/front switching without changing army selection |
| Fair scouting | sees() gates targeting; siege checks require forward spotting | Building-memory snapshots now persist through unseen destruction and clear on re-observation for both factions; mobile reports expire after 60s. Broader long-match economic decision fairness remains to verify |
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
