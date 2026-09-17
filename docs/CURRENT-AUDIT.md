# Current scope audit — 2026-09-17

Audited playable source: 5db2027 (0.35.0). This audit adds shared support tests
and documentation, without changing the deployed game. The original scope is one
static Babar skirmish with meaningful macro and tactical command, not multiplayer,
a campaign, a commercial StarCraft replica or an exhaustive adaptation genealogy.
The broad gameplay goal remains active: the evidence below is not a completion claim.

The preceding goal turn verified public visibility, terminal deployment success
and HTTP availability. This turn advances that evidence to all 28 deployed files,
actual public start/pause, current Story loss/restart and missing browser power checks.

| Original requirement | Current source and inspected evidence | Assessment |
| --- | --- | --- |
| Preserve supplied foundation; read guidance | AGENTS.md; tracked authored dist; imported baseline 4109fb6; README, CHARACTERS, CODEX-HANDOFF, actual modules | Established; no fresh skeleton or unrelated changes |
| Correct account, repository, public consent | gh repo view returns therealjameswilson/babar-battle-for-celesteville, PUBLIC; user explicitly authorized public | Verified public repository; credentials not part of client |
| Static Pages delivery and project paths | API returns actual Pages URL; Actions 35255969926 success; all 28 dist files byte-match remote; public start/pause clicked | Verified for 5db2027 |
| Military presentation beyond recoloring | Local siege and directional/walk atlases; render.js damage, breach, smoke, impact, directional guns; ASSETS.md and QA screenshots | Implemented and visually reviewed in release QA; other units retain two-way facing |
| Audio, mute, reduced motion | audio.js gesture startup and local mute; browser toggle/persistence assertions; renderer uses preference | Mute verified; actual reduced-motion media preference still needs explicit browser proof |
| Physical Supplies and useful Materials | game/economy modules; extraction slots, physical cargo, quarries, finite nodes; delivery/economy checks | Verified rule behavior and browser effects |
| Build, recruit, population, research, expansion | construction/production/combat-roles modules; payment, timing, worker travel, prerequisites, queues, housing; paid full-match opening comparisons | Verified; expansion has measurable opportunity cost and a viable secured policy |
| Two approaches, depot and defenses | navigation terrain; tactics depot/cover/supply graph; movement, depot capture and disruption checks | Implemented and exercised in rendered matches |
| Pathfinding and spaced commands | 30px A*, clearance, corner prevention, rerouting, formation/separation; 24-unit queued route tests | Verified tested routes; does not promise congestion-free arbitrary crowds |
| Move, attack-move, focus, hold, retreat; mouse/touch | game/minimap/selection handlers; real DOM pointer/keyboard checks and manual command checks in QA | Verified within tested Chromium and phone-sized frames |
| Distinct units, morale and cover | guards/scouts/sappers/guns/commanders; suppression, recovery, both-faction cover and counter checks | Verified numerical rules; artillery has setup, blind spot, spotting and friendly splash |
| Transparent disrupted supply, repair, recovery | 25% isolated production; supply lines/status, worker repair, aid stations, paid commander recovery | Rule and browser tests cover interruption, restoration, repair and return |
| Disruptible fair enemy economy/AI | enemy-economy/recon/operations; actual workers/budgets/queues, rebuilding, reconnaissance, raids, withdrawals | Controlled hidden-state and paid raid/match tests; universal long-match fairness is not inferred from one test |
| Story and Commander; victory/loss/restart | Current Story victory 03:05; current unattended Story defeat 02:33; clicked Deploy again, Take command and Pause after defeat; Commander paid wins/losses | Current browser lifecycle evidence; scripted play is not human competitive balance |
| Full family/council and book characters | 33 unique entries; all original 23 retained, 22 book characters; canonical relationships separate from invented powers; history/children not combat units | Roster and archive checks pass; not an exhaustive genealogy |
| Every named support effect and officer ability | book-checks; shared support-checks; browserSuite numerical effects; commander energy/range/damage/expiry checks | Former Node-only Pom/Troubadour/Pompadour/Arthur/Celeste/Victor/Basil/Rhudi checks now run in browser; Alexander and Louise checks added |
| Maintainability, balance/provenance docs, AGENTS | Classic modules; authored dist; ARCHITECTURE, CHARACTERS, ASSETS, README, package commands | Architecture opening corrected for current materials, sappers, siege and headquarters; historical sections remain labeled |
| Baseline/current checks and real browser QA | Successful current Actions; Node tactical suite rerun after test refactor; 638 current portrait browser checks; prior 627 at all three sizes | Browser tests include actual Canvas and assets; deterministic tests are not mislabeled as browser tests |
| Mobile layout, clipping, no trapped dialogs | 390×844 and 844×390 evidence in QA; crop-alpha and control reachability assertions | Chromium responsive/synthetic touch only; physical iPhone is not claimed |
| Console errors/missing assets | All public assets match; browser suite completes; historical wrapper MutationObserver errors remain unattributed | Incomplete: need current console/error attribution before calling release error-free |
| Performance and optimization | Current 69-object active-frame sample: 120 frames/2s, 40 ticks, no clipped time; draw p95 1.6ms, simulation p95 2.8ms/display frame | Measured; no current bottleneck justifies speculative optimization |
| Review screenshots separate from assets | Ignored artifacts directory, desktop/portrait/landscape evidence listed in QA | Present locally; not deployed |

## Next required evidence

1. Capture and attribute current browser console/runtime errors, including iframe
   startup versus standalone client, rather than repeating historical uncertainty.
2. Exercise reduced-motion media preference in a supported browser workflow and
   verify that the actual client observes it. Direct helper-argument tests alone
   do not prove preference integration.
3. Finish checking the remaining requirement coverage at current source after
   those gaps close; do not replace this with a new optional feature backlog.

Broader human balance, physical Safari, eight-direction animation for every unit
and additional campaigns are useful future work, not substitutes for closing the
explicit current QA requirements. Current public URLs:
https://github.com/therealjameswilson/babar-battle-for-celesteville and
https://therealjameswilson.github.io/babar-battle-for-celesteville/.

## Follow-up at 0.35.1

The two concrete QA gaps above have stronger evidence now (QA.md): the original
MutationObserver message reproduces on a script-free iframe control; standalone
gameplay/settings/resume has no captured errors. An explicit persistent motion
selector verifies reduced/full renderer integration in the browser, while System
reads the actual media preference. OS preference switching remains untested,
not claimed. 647 checks pass at all three tested sizes. The field manual now
restores its prior pause state. Publication of this follow-up is still pending;
recheck the actual workflow and public files before closing the release audit.
