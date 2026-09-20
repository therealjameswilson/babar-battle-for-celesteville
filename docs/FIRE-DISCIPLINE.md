# Fire discipline — 0.39.0

This release adds a small tactical control layer for scouting and ambushes. It is a qualitative RTS improvement, not a measured percentage of similarity to another game.

Select combat troops or commanders and choose **Hold fire / Weapons free**, or press **C**. A mixed selection first puts all eligible friendlies on hold fire; a second toggle releases them. Workers, structures, enemies and dead units are excluded. Deployed artillery is eligible. Selection subgroups naturally restrict the affected units.

Hold fire prevents automatic shooting and chasing. Idle, hold-position, attack-move and patrol orders respect the stance, while routes and queued waypoints remain intact. Enabling it suspends any previously issued focus-fire permissions, including queued focus orders. A **new** focus-fire order authorizes that target only. Killing it or losing sight ends the exception. Weapons free restores ordinary engagement under the current orders; ordinary Move/Retreat orders still do not attack. The selected-unit report shows the count holding fire and any active focus overrides.

Silence does not grant camouflage, change vision, stop incoming attacks, or prevent morale-driven withdrawal. The default remains weapons free, including newly trained and recovered commanders. Enemy units obey the same firing permission rule if a scenario sets their stance; the existing AI doctrine and default behavior are unchanged.

## Implementation

`dist/fire-discipline.js` owns eligibility, permission, selection toggling and status text. Each unit's `holdFire` persists across orders. New player focus orders carry `forceFire`; enabling silence clears old focus permissions but preserves their targets and route data. Both target acquisition and `shoot()` enforce permission, so alternate firing callers cannot bypass it. Simulation rules and rendering remain separate. There is no resource cost, upgrade requirement or new unit.

Action text wraps inside a constrained grid so the stance and existing Same type descriptions cannot push mobile buttons offscreen. C ignores Ctrl/Command/Alt combinations, text fields, repeated keydown events, pause, ended missions and modal dialogs.

## Verification

`tests/fire-discipline-checks.js` is shared by `npm test` and the real-browser fixture. It checks default engagement, silence, no automatic pursuit, unchanged visibility, direct firing guard, explicit focus and loss, release, attack-move/patrol, route preservation, mixed groups, artillery permission, faction symmetry, modal guards and restart.

`tests/fire-discipline-browser.html` additionally exercises actual action button handlers, C, copy/search guards, status, viewport bounds and battlefield drawing at 390×844, 844×390 and 1280×900. See QA.md for observed results and preview limitations.
