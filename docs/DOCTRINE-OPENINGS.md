# Paid doctrine versus continued recruitment

Run `npm run test:doctrine`. The eight seeded full matches compare four policies
on both Story and Commander using the existing defensive opening. All policies
start with the same ordinary funds, workers and army. Their recorded state at
120 seconds must be identical within each difficulty.

After 120 seconds:

- **Troops** continues normal recruitment and artillery production.
- **Volleys** reserves the Guard School until queued recruits finish, buys
  coordinated volleys for 150 Supplies, then resumes recruitment.
- **Rapid** buys volleys, then rapid doctrine for another 180 Supplies and
  60 Materials. The school remains reserved while saving and researching.
  Infantry production resumes after doctrine completes.
- **Two-school rapid** pays 150 Supplies for an extra school and sends a worker
  to construct it. The second school researches while the original recruits.
  The policy saves the next research cost before other purchases, then releases
  that savings target once research starts. Inventories are never modified.

Workers still gather and deliver; construction still needs labor. The policy
cannot grant funds, technologies, units or vision. Artillery, housing, council
support, defense, repair and attack thresholds use the same existing policy.
Rapid activations require more than 60% health, morale above 50, no retreat order,
and a visible armed enemy near weapon range. These are automated player decisions,
not new game AI or extra benefits for the player.

## Recorded seed-8 matches

| Difficulty | Policy | Outcome | Time | Palace HP | Rapid ready | Activations |
| --- | --- | --- | --- | --- | --- | --- |
| Story | Troops | Victory | 263s | 1800 | — | 0 |
| Story | Volleys | Victory | 263s | 1800 | — | 0 |
| Story | Rapid | Victory | 318s | 1800 | 215s | 16 |
| Story | Two-school rapid | Victory | 260s | 1800 | 219s | 28 |
| Commander | Troops | Victory | 275s | 1800 | — | 0 |
| Commander | Volleys | Victory | 273s | 1800 | — | 0 |
| Commander | Rapid | Victory | 327s | 1800 | 219s | 15 |
| Commander | Two-school rapid | Victory | 569s | 1800 | 216s | 43 |

Story purchases occurred at 125s (volleys) and 180s (rapid); Commander at 128s
and 184s. Every purchase is checked for its exact Supplies/Materials debit and
uniqueness. All rapid policies must actually finish research and activate it;
a nominal research policy that never obtains the ability cannot pass.

The army-count threshold for advancing makes lost production time matter. At
240s, Story's troops policy has produced 21 guards; rapid has produced eight.
The research opening's guns continue training, but fewer infantry delay the push.
The weapons-only opening finishes almost level with troop production. These
results support an opportunity cost, not a universal ranking of technologies.
No balance values were changed to favor the new ability.

## Browser evidence and limits

The real-browser **Paid doctrine match ×20** uses ordinary Commander starting
resources with this same policy and renders throughout. It reached victory at
335s with 1800 palace HP, rapid ready at 215s and 19 activations. This browser result is not a numerical reproduction of the Node harness;
see the cross-runtime trace below. Evidence:
`artifacts/paid-doctrine-browser.txt` and `paid-doctrine-browser.png` (local, ignored).

The paid second school was ordered at 135s/137s and completed at 149s/151s
(Story/Commander). Tests verify its 150-Supplies debit, unfinished foundation,
subsequent completion and concurrent progress of research and recruitment. Measured
one-second samples confirmed 46/48 seconds of simultaneous progress; recruit
completion resets can cause this counter to undercount overlap.

The second school restores infantry output, but it does not remove the economic
tradeoff. At 240s, Commander two-school production had fielded 21 new guards and
four guns, versus seven guards and ten guns in the single-school research arm.
The longer seed-8 match coincided with that different composition. The unseeded
rendered two-school Commander run instead won at 288s with 24 activations and 47
measured seconds of concurrent production. This discrepancy motivated additional
paired seeds rather than a claim that extra production always improves the opening.

An initial exploratory two-school policy never saved for rapid: ordinary
recruitment consumed the income and the match ended with only volleys. The test
rejected it because doctrine never completed. The final policy explicitly saves
for research, a player spending choice rather than free money.

These are automated defensive policies, not human playtests or universal rankings.
Offensive research timings, later expansions and human activation decisions remain
open. No game costs or unit statistics changed to favor any policy.


## Cross-runtime reproducibility

Additional Commander pairs with `--seed=9 --commander-only --parallel-pair` and
`--seed=10 --commander-only --parallel-pair` produced the same 327s/569s results
as seed 8. These are **not independent balance samples**: inspection found no
active random decisions in these simulation paths. Audio randomness is unrelated.
The earlier suggestion that random sequences explained browser timing was unsupported.

The browser's synchronous **Fixed-step doctrine check** runs the exact same
one-second policy cadence and twenty 0.05s updates without interleaved animation
frames. It still finishes the two-school case at 288s. Diagnostic snapshots show
the first observed divergence at t=1: worker 5's x coordinate is
182.6253185927438 in Node versus 182.62531859274378 in Chromium. At t=120 treasury
still matches; by t=180 positions and gathering progress diverge substantially.
This is evidence of tiny numerical movement differences growing through crowding
and combat, not evidence of hidden resource grants or a random seed effect.

Snapshots are generated by the authored diagnostic fixture and saved locally in
`artifacts/doctrine-node-trace.json` and `doctrine-browser-trace.json`. The tests
establish repeatability within each runtime, not bit-identical cross-runtime
replays. Multiplayer/lockstep is outside this release. Broader timing and army
composition comparisons remain necessary before changing balance from win time.
