# Ballistic missiles and missile defense — v0.56.0

These are abstract RTS rules, not real weapon performance.

| Item | Unlock / build | Operation |
| --- | --- | --- |
| Ballistic command | Artillery Works research: 220 Supplies, 80 Materials, 45s | Unlocks Ballistic Launchers |
| Ballistic Launcher | 280 Supplies, 120 Materials, 26s; 900 HP | Each conventional shot costs 120 Supplies + 40 Materials; 900m range, 10s warning, 35s reload |
| Missile Defense Battery | Damage Limitation research; 220 Supplies, 100 Materials, 22s; 800 HP | 260m coverage around the impact point; each interceptor costs 20 Supplies + 10 Materials; 12s reload |

Conventional missiles require a currently observed, in-range ground target and a
completed, supplied launcher. Select the launcher, choose Launch ballistic missile,
then tap the target. Up to three conventional missiles may be in flight per faction.
They deal 300 base damage in a 60m radius, falling off with distance, with friendly
fire and existing combat modifiers. They do not consume Uranium, trigger nuclear
worker evacuation, or require the king's authorization. Destroying or isolating the
launcher aborts the guided strike, preserving the game's existing command-link rule.

Batteries automatically engage enemy conventional, atomic and H-bomb missiles in
the final four seconds before impact. One interceptor destroys a conventional or
atomic missile; an H-bomb requires two. This is deterministic, with no hidden random
roll. A single battery cannot fire twice in that window. Overlap coverage to counter
H-bombs, or launch simultaneous conventional salvos to exploit reload gaps. A battery
must be completed, alive, supplied and able to pay its shot cost. It never intercepts
friendly missiles. Arthur's local neutron payload bypasses ballistic defense.

Atomic/H-bomb assembly and leader-only launch authorization are unchanged. They now
have public missile trajectories and can be intercepted. Conventional missiles do
not occupy the separate one-nuclear-payload limit. Civil Defense continues to handle
nuclear warnings; an interception ends that warning and permits the usual all-clear.

Both factions use the same prices, coverage and interception rules. Rhino command
can research Ballistic command after seven minutes, build a battery after 450s and a
launcher after 480s, subject to its normal budget, workers and prerequisites. Its
launch decisions use current visibility and avoid nearby friendly units.

Art: original local Canvas launcher and radar-battery silhouettes; dashed flight
paths, projectile markers and interceptor traces. Selected batteries show coverage.
Reduced motion holds the projectile marker still while preserving path/countdown.
No new external assets or services. Rules live in missiles.js, shared strike timing
in atomic.js, and Canvas integration in render.js.
