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
| Physical worker economy | game.js gather/deliver loop; regression checks | Extraction slots, idle-worker selection and finite Materials quarries now implemented/tested; meaningful expansion pressure and long-game opening comparisons still need work |
| Construction and production | Worker-built structures, paid queues, cancellation, rally, control groups | Guard School gates Artillery Works; dual-resource costs and multi-producer allocation implemented; deeper tech progression remains |
| Army composition | Guards, scouts, artillery, commanders; research and abilities | Sappers counter armored guns/structures and guards counter sappers; four composition scenarios recorded. Rush openings lose Commander; an earned-resource fortified opening wins. Broader opening and human balance comparisons remain |
| Positional combat | artillery.js now implements timed siege deployment, spotting, friendly splash and blind spot | Siege-specific long-game and Commander strategy comparisons remain; broader tactical content remains open |
| Enemy macro | enemy-economy.js runs physical Supplies/Materials gathering, paid queues, worker replacement, rebuilding and connected expansion | Paid enemy tech research and scouted counter recruitment implemented; adaptive expansion choices and sustained raiding/Commander balance remain |
| Commands and readability | A*, formations, order queue, hold/retreat, group and rally UI; browser checks | Idle-worker shortcut and selected-production overview implemented; attack reports with F3/touch and minimap rings implemented; selection subgroups remain |
| Fair scouting | sees() gates targeting; siege checks require forward spotting | Long-match reconnaissance and AI economic decision fairness need scenario-level verification |
| Presentation and controls | Local Babar art, audio, command UI, desktop/mobile QA | Only two-way sprite facing; physical Safari/touch and extended human balance remain unverified |
| Publication | Public GitHub and Pages; every release runs checks | Verify the current commit, terminal workflow result and public assets after each release |

Reference for this combat increment: Blizzard's
[Terran siege-tank push guide](https://news.blizzard.com/en-us/article/5740271/game-guide-terran-siege-tank-push)
describes screened, spaced artillery positions and friendly splash risk. The
mechanical design here uses original Babar assets, names and balance values.

Next substantive work: selection subgroups and production control that avoid
reselecting an entire mixed army for specialist orders. Adaptive expansion
locations and wider human balance remain open. Do not mark the broad goal complete
on the strength of the artillery release alone.
