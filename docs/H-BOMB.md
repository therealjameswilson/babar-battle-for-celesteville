# H-bomb command — 0.48.0

A fictional technology tier after Atomic command, available to both factions at
Artillery Works. This document describes game balance values only.

| Rule | Atomic bomb | H-bomb |
| --- | --- | --- |
| Prerequisite technology | Shells + Field protection II | Atomic command |
| Research Supplies / Materials | 800 / 300 | 1000 / 350 |
| Research time | 90s | 120s |
| Assembly Supplies / Materials | 650 / 200 | 1000 / 350 |
| Supplied assembly time | 75s | 110s |
| Launch warning | 18s | 28s |
| Map radius | 150m | 230m |
| Base damage, center → edge | 900 → 450 | 1350 → 675 |

Research H-bomb command, then select an idle supplied Artillery Works and choose
Assemble H-bomb. Both assembly choices remain available: an atomic bomb costs less
and finishes sooner. One shared assembling/stored/launched payload per faction
prevents stockpiling both types. Research never upgrades an existing payload for
free; type is recorded at assembly and carried through storage and launch.

Touch launch, visible-target requirements, friendly fire, fixed targeting and
launcher counterplay remain identical. Everyone sees the appropriate blast circle
and labeled countdown on the map/HUD/minimap. Destroying or isolating the launcher
aborts either type, consuming the payload. A full-health palace survives a single
unmodified center hit. Existing cover, protection, armor and Story difficulty
modifiers apply. No persistent radiation or full-screen flashes are added.

Rhino research planning considers H-bomb command after 13 simulated minutes and
requires the completed atomic prerequisite. The AI assembles the strongest payload
it can afford while keeping its 120-Supplies reserve, falling back to atomic when
H-bomb funding is insufficient. It uses current faction visibility and the correct
larger radius for cluster scoring and friendly-force avoidance.

atomic.js now parameterizes payload specifications and carries each job/strike's
kind. render.js owns warning drawing; production reports and UI show type-specific
progress, prices and timers. Existing atomic tests remain in the full suite.
H-bomb checks cover prerequisites, faction parity, spending, assembly duration,
shared cap, immutable payload type, larger damage/radius, warning, supply abort,
AI launch and invalid kind refusal. Real-browser tests exercise phone/desktop
assembly and touch targeting at 390×844, 844×390 and 1280×900.
