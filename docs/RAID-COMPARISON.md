# Quarry harassment comparison

This controlled three-minute comparison isolates an early quarry raid. It is not
an earned-resource opening, a full match, or proof that harassment is balanced.
`npm run test:raids` runs two matched pairs with seed 8 on Commander rules.

Each pair uses the same initial economy, enemy macro, positioned raiding squad and
normal combat. The control holds its position. The raid attacks for 45 seconds,
then withdraws through the ordinary retreat command. Reinforcement waves are held
until after the measurement window so the two economies can be compared. Guards
focus observed quarry workers; sappers focus the quarry when it becomes visible.
The policy never targets an unseen unit. Positions and army composition are fixture
inputs, not units claimed to have been recruited in a live opening.

| Force / orders | Quarry Materials extracted | Enemy Materials bank | Raiders surviving | Original quarry destroyed | Enemy spending | Guns produced |
| --- | ---: | ---: | ---: | --- | ---: | ---: |
| Five guards / hold | 800 | 715 | 5 | No | 2315 | 3 |
| Five guards / raid | 450 | 345 | 1 | No | 2415 | 3 |
| Four sappers / hold | 800 | 715 | 4 | No | 2315 | 3 |
| Four sappers / raid | 380 | 285 | 2 | Yes | 2515 | 3 |

The quarry was rebuilt by the end of the sapper raid scenario. Each arm also
produced three replacement/additional workers, fifteen guards and one scout.

The evidence supports economic disruption: the raids cut extraction by 44% and
53%, force additional paid spending, and demolition units destroy the structure.
It does **not** demonstrate lower enemy army production. Materials reserves and
army demand are sufficient for the same three guns. The expensive guard losses
also mean reduced extraction alone is not evidence of a favorable trade.

The regression gates require the matched scenario to reach 180 seconds, extraction
to fall by at least 20%, additional enemy spending, and original quarry destruction
by the sapper raid. They deliberately do not require a military benefit absent
from the measured results. See tests/raid-strategy.js for the exact intervention.

Next balance work: compare continued replacement demand and paid player openings,
then examine material costs, mining allocation and reserves together. Do not raise
costs solely to make this one fixture report fewer guns.
