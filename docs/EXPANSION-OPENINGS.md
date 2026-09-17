# Full-match expansion openings — 0.34.0

These Commander matches use the normal 300 Supplies, starting army and four
workers. All three share the same paid eleven-worker opening for the first
minute; the test compares that checkpoint exactly. They use the same staged
army controller, repair logic, ordinary council actions and current fog of war.
No units, resources, research or buildings are granted after reset.

- **Army first:** keep the staged offensive and its normal production priorities.
- **Early camp:** after 60s, reserve 400 Supplies and detach a scout plus two
  healthy guards. Scout the southern camp site, then send an existing provisioner
  to build. This money and escort detail are unavailable to the main defense.
- **Secured camp:** make the same investment only after capturing the depot.

The camp at (1020,1070) is built only when ordinary visibility and placement
checks permit it. Once complete, the policy assigns up to eight existing workers
to currently observed safe nearby caches and uses paid camp production to reach
fifteen workers overall. Replacement workers also cost Supplies. It preserves
cargo in transit and existing retreat/build/repair orders. It does not rebuild
a destroyed camp during this comparison. The scout withdraws from visible danger.

## Measured results

| Opening | Node result | Camp paid / complete | Direct camp expenditure | Camp Supplies delivered | Palace health |
| --- | --- | --- | ---: | ---: | ---: |
| Army first | Win, 255s | — | 0 | 0 | 1,800 |
| Early camp | Loss, 189s | 80s / 120s | 400 | 390 | 0 |
| Secured camp | Win, 396s | 176s / 216s | 1,200 | 3,155 | 1,800 |

Direct camp expenditure includes the headquarters and all its successfully paid
worker recruits, including replacements; it excludes other base and army spending.
Deliveries count credits at that camp, including Pompadour's efficiency bonus.
They are gross receipts, not profit: military losses and lost gathering time are
not deducted. The secured opening finishes with fifteen workers and more available
Supplies, but its offensive requires regrouping and takes longer than army-first.

The early camp survives and receives real income while the palace falls. At 120s,
the early opening has 1,032 palace health versus 1,800 in the army-first case.
This is a concrete military opportunity cost, not evidence that every early
expansion must fail. Different escort, defense, production and scout decisions
could change the result. No combat prices or damage values were changed to force
these outcomes.

The real Chromium browser wins the army-first opening at 345s, loses the early opening at 189s (370 camp Supplies)
and wins the secured opening at 476s (about 5,248 camp Supplies, palace 1,800).
These are accelerated fixed-step matches with actual rendered gameplay, not a
mocked Canvas or manual competitive playtest. Exact timings and totals differ
across Node/Chromium; do not treat the fixtures as cross-runtime lockstep replays.
See DOCTRINE-OPENINGS.md for the previously measured numerical divergence.

## Regression and player feedback

Run `npm run test:expansion-openings`. Assertions require identical first-minute
state, real payment/construction/delivery, a measured early defensive cost and a
viable secured expansion. They do not require exact timestamps or universal early
defeat. Existing combat and economic regressions still run in the Pages workflow.
The three browser fixture buttons expose the same strategies for rendered review.

Selected headquarters now display cumulative **delivered Supplies and Materials**.
Counters update only when cargo reaches that completed delivery base; production,
depot income and council grants do not fabricate camp deliveries. They remain
separate by resource and cannot count an empty returning worker twice. These
figures help the player judge whether keeping a remote economy supplied is paying
off; the counter does not promise a net-profit calculation.
