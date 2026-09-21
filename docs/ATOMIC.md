# Atomic command — 0.47.0

This is a fictional endgame game mechanic. Both factions use the same technology,
resource payments, assembly progress, targeting restrictions and blast rules.

Technology path: Field protection I → Field protection II (requires Artillery
Works), plus Calibrated field shells → Atomic command at Artillery Works.
Atomic command costs 800 Supplies + 300 Materials and 90 research seconds under
the existing research/supply rules. It competes with artillery research/production.

A completed supplied Artillery Works assembles a bomb for 650 Supplies + 200
Materials over 75 supplied simulation seconds. Assembly occupies the production
site and blocks research/recruitment there. Isolation halts assembly; destruction
loses the investment. One assembling, stored or launched payload per faction.

Select a ready Works → Launch atomic bomb → tap a currently visible map location.
A fixed 150m radius warning appears on the map/minimap, with an 18-second countdown
in the operations HUD. Both sides see all launch warnings. The target does not
track units or follow them through fog. No hidden units or buildings are exposed.
Failed targeting consumes nothing. Escape or another order cancels aiming.

Counterplay: evacuate, spread forces, or destroy/isolate the launching Works during
the warning. Losing its command link aborts the launch and spends the payload.
Normal attack rules apply to damaging the launcher. Both sides inside the blast
receive damage: 900 base at center, linearly falling to 450 at the radius edge,
with existing cover/protection/armor modifiers. A full-health palace survives one
blast. Commander recovery, casualties and victory checks use the existing engine.
There is no persistent radiation effect or full-screen flash/camera shake.

Rhino planning considers this technology after eight simulated minutes, using its
normal prerequisites and paid economy. It retains 120 Supplies beyond assembly
cost. Every five seconds a ready launcher evaluates currently visible targets,
prioritizing buildings/clusters and avoiding nearby friendly troops. It does not
read hidden positions. Killing scouts can deny targeting; destroying quarries or
workers starves the resource-intensive progression. Enemy AI can use the feature,
but it is not guaranteed a free bomb or a scripted launch each mission.

atomic.js owns assembly, launch, AI selection and warning drawing. game.js owns
research definitions and command/UI hooks; combat-roles.js enforces the extra
research prerequisite; production/economy prevent queue overlap. Reset clears all
strikes and targeting. Original Canvas rings/smoke and existing local sounds are
used; no new external artwork or assets are required.

Validation: tests/atomic-checks.js runs in Node and the real-browser fixture
atomic-browser.html. Coverage includes faction parity, tech gates, costs, assembly,
supply loss, visibility, enemy targeting, warning delay, friendly fire, launcher
counterplay, pause/end/reset and touch activation at phone/desktop sizes.
