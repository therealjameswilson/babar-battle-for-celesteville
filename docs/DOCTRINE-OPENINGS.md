# Paid doctrine versus continued recruitment

Run `npm run test:doctrine`. The six seeded full matches compare three policies
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
| Commander | Troops | Victory | 275s | 1800 | — | 0 |
| Commander | Volleys | Victory | 273s | 1800 | — | 0 |
| Commander | Rapid | Victory | 327s | 1800 | 219s | 15 |

Story purchases occurred at 125s (volleys) and 180s (rapid); Commander at 128s
and 184s. Every purchase is checked for its exact Supplies/Materials debit and
uniqueness. Both rapid policies must actually finish research and activate it;
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
335s with 1800 palace HP, rapid ready at 215s and 19 activations. The browser uses
its own random sequence, so it is not a numerical reproduction of seed 8. Evidence:
`artifacts/paid-doctrine-browser.txt` and `paid-doctrine-browser.png` (local, ignored).

This is one defensive build order and one CLI seed. It does not test offensive
research timings, a second Guard School allowing simultaneous production, a human's
activation decisions, or every matchup. Next compare a paid second school against
reserving the only school; keep the technology costs fixed until broader results
justify changing them. CLI comparisons are simulation evidence, not human playtests.
