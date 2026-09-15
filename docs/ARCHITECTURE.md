# Architecture and balance — 0.3

Classic scripts share one simulation state, preserving the prototype’s dependency-free deployment. Script order in index.html matters: cast, game declarations and controls, navigation, tactics, audio, court, then renderer/startup. No ES-module server requirement.

| File | Responsibility |
|---|---|
| game.js | Definitions, economy, construction, recruitment, combat, recovery, controls and UI |
| navigation.js | 30m grid A*, clearance, corner rules, rerouting and safe separation |
| tactics.js | Supply graph, depot, visibility/intelligence, morale and enemy decisions |
| court.js / cast.js | Roster and support mechanics; relationship metadata |
| render.js | Terrain, atlas crops, directional facing, guns, smoke, damage, fog, minimap |
| audio.js | Original synthesized rifle/cannon/percussion effects, gesture startup and mute |

## Rules

World: 1800 × 1260. Navigation: 60 × 42 cells, 30m each. Forest blocks north/south edges and a middle segment, leaving northern and southern roads. A* uses eight neighbors with diagonal corner checks and a binary heap. Static buildings have clearance; approach points stop at a target’s perimeter. Routes refresh when the destination moves, buildings change, or a two-second timer elapses. Mobile separation checks static collision before displacement. Construction cannot overlap units or terrain. Crowds can briefly queue at a narrow passage; this is local separation, not reservation-based multi-agent planning.

Visibility is sampled once each simulation step, symmetric for both armies. Hidden enemies cannot be acquired or tracked as focus-fire targets. Terrain and cache locations are strategic map knowledge. Both armies know the starting capital coordinates; AI chooses individual combat targets only within current sight. Reconnaissance updates its capital memory. Public enemy reserve totals represent intercepted convoy reports.

| Unit | Cost | HP | Speed | Range | Damage / interval | Role |
|---|---:|---:|---:|---:|---:|---|
| Provisioner | 50 | 85 | 84 | — | — | Gather, deliver, repair |
| Guard | 60 | 145 | 77 | 145 | 12 / 0.9s | Infantry screen |
| Scout | 55 | 75 | 125 | 95 | 7 / 1.1s | 410m vision |
| Artillery | 160 | 240 | 43 | 270 | 48 / 2.8s | 1.8× building damage |
| Commander | 100 to recover | 640 | 72 | 100 | 24 / 0.85s | Officer aura and rally |

Palace/Guard School/Artillery Works/home/tower costs: 400/150/240/100/160; starting structures are free. Tower range 190; artillery can engage beyond it. Population: palace 20, home 10, maximum 100. Training queue maximum 5. See `defs` for construction and training times.

Supply graph: completed buildings within 360m; a hostile combatant within 85m of a segment cuts that edge. Disconnected queues run at 0.25 speed; resources are not refunded or lost. Only connected homes/palaces receive deliveries and heal troops. Workers divert deliveries to another linked receiver. Repair: 18 health/s, 0.3 supplies per health, stops when funds run out.

Depot: one side must hold within 90m for 8 uncontested seconds. Capture progress moves toward the capturing side; opposing pressure reverses it. Player ownership grants 2 supplies/s and stops enemy income. Enemy reserves start at 480 Story / 650 Commander. While the depot is not player-held and barracks survive, income is 0.8 / 1.3 per second, capped at 900. Recruitment spends normal costs, every 18 / 12 seconds, with army caps 20 / 28. Barracks destruction stops recruitment. Basil accelerates the interval by 20% from wave two.

Story: enemy damage ×0.7, first assault 120s, later interval 100s. Commander: full damage, first assault 85s, later interval 72s. Enemy scouts start at 22s, main assaults alternate with a northern flank every third wave. Wounded enemies retreat below 27% health and regroup at aid stations; fit units rejoin on a subsequent assault. Rataxes joins from wave two. Louise fortifies the fortress after wave one; Victor adds 20s after wave three; Rhudi boosts speed from wave four.

Morale: 100 maximum, ordinary hits remove 12, artillery removes 26. Below 25, automatic retreat. Below 45, movement ×0.7 and firing intervals ×1.5. After 3s without damage: recover 4/s, 12/s within 190m of an officer, or 10/s within 160m of a supplied aid station. Retreat speed ×1.2 and no attacks until reaching recovery ground. Hold fires without pursuing. Aid stations restore 2 HP/s after 5s without damage; Celeste increases this to 6. Commander recovery: 45s and 100 supplies/reserves, or 25s with Periwinkle.

## Rendering and performance

Faction base rings, health/morale bars, facing ticks, mirrored unit art and rotating field guns provide direction and identification. Moving units produce restrained dust; firing has muzzle flashes and projectile feedback. Damaged buildings show cracks, a dark breach below 35% HP, and smoke. Reduced motion removes idle/walk bobbing and drifting dust/smoke animation; there is no camera shake.

Visibility sets and static collision candidates are cached once per simulation step. The measured 60-unit browser fixture improved average update cost from 2.60ms to 0.75ms after those changes; see QA.md for scope. The renderer caps device pixel ratio at 2.

## Expansion boundary

No campaign, accounts, multiplayer, paid APIs, save system, or backend. Characters other than Babar and Rataxes retain council/civilian/history roles. Full eight-direction animation and additional named officer sprites are future work.

Control groups and rally points: Ctrl/Command + digit stores friendly living unit IDs;
adding Shift appends. A digit recalls surviving members. Reset clears the groups.
Production buildings retain a world-space rally point set through normal orders;
new provisioners gather if it references a nonempty cache, otherwise recruits move
there. Selected buildings draw a dashed brass line and pennant. Ground rallies
replace the provisioner's default automatic gathering behavior.

Recruitment can be cancelled from a selected producer's action list. Full supply
cost is refunded; cancelling the active item resets its elapsed training, while
cancelling a waiting item leaves active progress intact. Index and ownership guards
prevent duplicate refunds. The actions list scrolls when a queue expands it.
The Groups button exposes four saved selection slots through a paused dialog for
touch users; closing restores the prior pause state. Keyboard users retain ten slots.

Orders: Shift-command or the Queue toggle appends up to 16 orders per mobile unit.
The current order finishes before the next starts. Gathering yields after a delivery
when a follow-up exists; repair yields on completion or destruction. Lost/dead focus
fire targets release their order. Hold and retreat discard pending routes. Order
paths are drawn on the map, and status reports pending count. Script URLs are
versioned with the release to avoid mixed HTML/engine caches.

Research progression (0.5): an idle Guard School researches Cornelius's coordinated
volleys for 150 supplies over 25s, multiplying friendly guard/scout damage by 1.2.
An idle Artillery Works researches calibrated shells for 180 supplies over 35s,
multiplying friendly artillery damage by 1.25. Upgrades affect existing and future
units, once per match. Research occupies its producer; other buildings can continue
recruiting. Isolated research runs at 25%. Cancellation refunds 75%; destruction
loses unfinished work without refund. Restart clears upgrades. These doctrines are
invented gameplay, not canonical character claims.

Active commanders (0.6): heroes start with 60 command energy, capped at 100,
regenerating 1.25/s. Both skills cost 50 energy and have a 35s cooldown; affected
units are friendly mobile units within 180m at activation, including the officer.
Babar's Stand together (Q or action button) restores 20 morale and applies 25% damage
reduction for 8s, multiplicative with cover. Rataxes applies 30% movement speed and
6 additional suppression per hit for 8s. AI activation requires a visible enemy
within 300m, another friendly mobile unit in range, and no retreat order. Effects
are static colored rings and explicit unit status; no camera shake. These abilities
are distinct from the existing council powers and are invented game mechanics.
