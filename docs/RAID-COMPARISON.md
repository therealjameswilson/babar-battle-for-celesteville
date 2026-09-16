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

## Paid full-match commitments

`npm run test:earned-raids` compares four Commander matches with seed 8, normal
starting units/resources and active enemy assaults. Both branches recruit exactly
four sappers through the Guard School (360 Supplies and 80 Materials). They assemble
behind the palace before commitment; no troops, resources or damage are injected.
Early recruitment begins as soon as technology/resources permit. The established
opening waits until 180 seconds and five living field guns. Both openings defend
until the sapper squad assembles. The control then joins the main army; the raid
separates the sappers for up to 60 seconds, withdraws them and rejoins after 90.
Targeted quarry orders require visibility; the quarry approach itself is map knowledge.

| Timing / commitment | Squad ready | Outcome | Match time | Palace HP | Surviving sappers | Enemy guns produced |
| --- | ---: | --- | ---: | ---: | ---: | ---: |
| Early / main army | 122s | Loss | 193s | 0 | 0 | 3 |
| Early / quarry raid | 122s | Loss | 192s | 0 | 0 | 3 |
| Established / main army | 228s | Win | 284s | 1800 | 4 | 3 |
| Established / quarry raid | 228s | Win | 469s | 1800 | 3 | 7 |

The established pair has identical measured state at 180s, before recruitment and
commitment diverge. At the equal 270s checkpoint, main-army pressure had already
destroyed the quarry and faced three produced guns; the raid branch had not destroyed
it and faced five. Extracted Materials were 800 versus 900. Thus the difference is
not explained only by the raid match lasting longer: concentrating the force also
applied more effective pressure at this shared observation time.

An initial unassembled policy fed each recruit into combat and never formed a squad;
that invalid comparison prompted the identical assembly phase. A 900-second limit
reports unresolved matches explicitly instead of calling them wins. The gate checks
four paid/fielded sappers, equal pre-commitment state and at least one winning
established commitment. It does not require every strategy to win.

The real-browser established raid won at 299s, with 1800 palace HP, four surviving
sappers and three produced enemy guns. Its unseeded timing differs from the Node
comparison, so this is additional rendered playthrough evidence, not deterministic
reproduction. Artifacts: earned-raid-browser-result.json / earned-raid-browser-finish.png.

These results support an opportunity cost for an early specialized force and favor
combined pressure in this particular opening. They do not prove every raid is weak,
that any resource price is correct, or that a dedicated flanking/worker-raid policy
cannot outperform this one. No gameplay cost was changed to force a desired result.
