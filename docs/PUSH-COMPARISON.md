# Paid Commander offensive comparisons — 0.31.0

The earlier mixed and artillery-heavy Commander scripts lost with their original
seven-worker opening. This comparison asks a separate question: after a stronger
shared eleven-worker economy, what happens when the army marches together versus
advancing infantry, scouts and deployed guns in stages? It does not isolate the
cause of the original scripts' losses or change any game prices, damage or AI.

Both branches start with normal resources and units. They gather, construct,
recruit, repair and use council support through normal actions. Before 120s they
run the same defense and must have equal recorded economy/army state. Thereafter
they commit when the mobile combat force reaches 14, 18 or 24 units and includes
at least three guns. These counts include commanders and scouts, not workers;
reported `army` in the raw results is occupied population, not head count.

The staged policy scouts ahead, screens its guns and uses five forward positions.
It deploys for visible targets, packs when repositioning, withdraws wounded troops
and regroups after severe losses. Direct march uses combined attack-move after
commitment. Both can fall back and recommit; production continues throughout.

| Commitment size | First attack | Direct march | Staged push | Palace health at both wins |
| --- | ---: | ---: | ---: | ---: |
| 14 | 136s | Win, 375s | Win, 255s | 1800 |
| 18 | 153s | Win, 343s | Win, 288s | 1800 |
| 24 | 226s | Win, 388s | Win, 749s | 1800 |

These are current Node measurements, not universal rankings. The staged advantage
reverses at the later commitment. The 24-unit staged force needed a second push.
The earlier intermediate 18-unit march measurement of 336s omitted shared repair
orders; the corrected final policy above preserves them in both branches.

Real Chromium results differ: the 18-unit staged run was unresolved at the
roughly 15-minute observation limit (901s), with the palace alive and a rebuilding army. The fixture now caps at 900s and pauses an unresolved match. It is
not a victory. The 14-unit staged run committed at 136s, regrouped once and won at
345s with 1800 palace health. Long-match cross-runtime position differences are
already documented in DOCTRINE-OPENINGS.md. The results support a viable earned
Commander offensive, but do not establish robust success for every timing or
that this control policy recovers reliably after every failed attack.

Run `npm run test:push`, `npm run test:push -- --size=14`, or
`npm run test:push -- --size=24`. The default CI gate requires equal pre-commitment
records, observed enemies through a paid scout, real deployed-gun use, advancement,
terminal Node results and a winning staged Commander push. It does not require a
speed advantage. Browser buttons reproduce the direct/default/early variants;
normal-speed control and layout checks remain separate from these accelerated runs.

The resulting player guidance is conditional: scout beyond gun vision, keep allies
out of shell impacts, separate infantry orders from deployed batteries, and consider
when to advance. The live battery report exposes these current firing conditions
without automating the decision or revealing hidden enemies.
