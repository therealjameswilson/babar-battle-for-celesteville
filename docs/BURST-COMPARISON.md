# Rapid advance: paired tactical comparisons

Run `npm run test:burst`. The same eight scenarios run in the real browser through
`tests/browser.html` → Burst comparisons. Infantry burst battle runs the healthy
engagement at normal speed and allows activation through the actual button or V.

Four elephant guards face four rhino guards. Both sides receive coordinated
volleys; only the elephants receive rapid doctrine. Deployment and research are
fixture grants, not earned-resource openings. Both cores remain; other starting
units are removed, enemy funds are zero and scheduled assaults are delayed beyond
the 12-second observation window. Ordinary damage, visibility, navigation,
suppression, automatic retreat, separation and recovery still run. All eight
setups assert navigable starting positions. The enemy does not receive rapid
research in this comparison, isolating the player's activation decision.

The sole difference within each pair is activation at time zero. Healthy troops
start at 145 health each; wounded troops start at 45. Both sides have full morale.
Attack pairs advance toward holding defenders. Withdrawal pairs issue Move to
x=400 (not the automatic palace Retreat order); pursuing enemies begin either
200 or 110 units ahead. Upon arrival, ordinary acquisition and suppression rules
resume. Consequently later results include renewed combat, not permanent escape.

## Recorded results

| Scenario | Normal orders | Rapid advance | Implication |
| --- | --- | --- | --- |
| Healthy engagement, 3s | Own total HP 407.2; enemy HP 378.4 | Own HP 327.2; enemy HP 320.8 | More early damage, at the full 80-HP squad activation cost |
| Healthy engagement, 12s | Four survivors, HP 191.8; enemy HP 182.5 | Four survivors, HP 169.5; enemy HP 112.7 | Damage advantage persists; this is not a decisive squad wipe |
| Wounded engagement, 3s | Two survivors, HP 3.6 | No survivors | Bursting near death is a losing choice in this engagement |
| Distant withdrawal, 3s | Mean horizontal distance to waypoint 36.5; HP 580 | Distance 14.5; HP 500 | Earlier arrival costs health before any incoming hit |
| Close withdrawal, 12s | Three survivors, HP 107.7 | Two survivors, HP 52.8 | Speed alone does not make a short retreat safe from pursuers |

Twenty-one checks protect fixture placement, finite health/casualties and the
observed early damage, health and movement tradeoffs. They deliberately do not
assert that every activated squad must win or survive longer. Browser results
matched the CLI values; the normal-speed rendered engagement also showed actual
fire, suppression, health loss and the gold ability ring. Local evidence is in
ignored `artifacts/burst-comparisons-browser.txt` and `burst-engagement.png`.

An initial exploratory placement put defenders inside the southern forest. Visual
review exposed it; those results are discarded. Final positions use the open
central approach and have explicit placement checks.

These controlled engagements do not price the 180 Supplies/60 Materials research
against additional recruits. A paid mixed-army opening that chooses doctrine and
activates only on useful engagements remains the next balance comparison.
