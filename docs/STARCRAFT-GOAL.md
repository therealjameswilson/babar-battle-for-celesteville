# Active gameplay goal: as close as possible to StarCraft

The goal remains active. The earlier public-visibility response only verified
account state; it did not advance gameplay. The current turn re-inspected the
worktree and implemented the first gap below. Passing a small skirmish's tests
is not evidence of overall StarCraft-like fidelity.

The original constraints still apply: one polished static single-player Babar
skirmish, mouse and touch, existing artwork/source preserved, the full character
crossover, no accounts/backend/multiplayer requirement, and GitHub Pages delivery.

| Dimension | Current authoritative evidence | Remaining work / proof needed |
| --- | --- | --- |
| Physical worker economy | game.js gather/deliver loop; regression checks | Worker saturation, idle-worker management, meaningful expansion pressure and advanced-resource specialization are absent |
| Construction and production | Worker-built structures, paid queues, cancellation, rally, control groups | Production prerequisites and tech progression are shallow; multi-producer selection does not distribute recruitment |
| Army composition | Guards, scouts, artillery, commanders; research and abilities | More explicit unit counters, armor roles, and viable composition comparisons need implementation and balance evidence |
| Positional combat | artillery.js now implements timed siege deployment, spotting, friendly splash and blind spot | Siege-specific long-game and Commander strategy comparisons remain; broader tactical content remains open |
| Enemy macro | tactics.js spends a finite budget and follows scouting/assault/flank/retreat phases | Enemy reserves are scheduled income; the AI does not run a comparable worker economy, build expansions or rebuild production |
| Commands and readability | A*, formations, order queue, hold/retreat, group and rally UI; browser checks | Idle-worker shortcut, production overview, selection subgroups and stronger attack alerts remain candidates for macro parity |
| Fair scouting | sees() gates targeting; siege checks require forward spotting | Long-match reconnaissance and AI economic decision fairness need scenario-level verification |
| Presentation and controls | Local Babar art, audio, command UI, desktop/mobile QA | Only two-way sprite facing; physical Safari/touch and extended human balance remain unverified |
| Publication | Public GitHub and Pages; every release runs checks | Verify the current commit, terminal workflow result and public assets after each release |

Reference for this combat increment: Blizzard's
[Terran siege-tank push guide](https://news.blizzard.com/en-us/article/5740271/game-guide-terran-siege-tank-push)
describes screened, spaced artillery positions and friendly splash risk. The
mechanical design here uses original Babar assets, names and balance values.

Next substantive work: make the economy support different opening choices,
advanced production and expansion decisions; then replace scheduled enemy income
with a visible, disruptible economic base. Do not mark the broad goal complete
on the strength of the artillery release alone.
