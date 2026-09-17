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

Visibility is sampled once each simulation step, symmetric for both armies. Hidden enemies cannot be acquired or tracked as focus-fire targets. Terrain and cache locations are strategic map knowledge. Both armies know the starting capital coordinates; AI chooses individual combat targets only within current sight. Reconnaissance updates its capital memory. Exact enemy funds are hidden. Economy planning reads resource quantities only in friendly sight and responds to visible threats.

| Unit | Cost | HP | Speed | Range | Damage / interval | Role |
|---|---:|---:|---:|---:|---:|---|
| Provisioner | 50 | 85 | 84 | — | — | Gather, deliver, repair |
| Guard | 60 | 145 | 77 | 145 | 12 / 0.9s | Infantry screen |
| Scout | 55 | 75 | 125 | 95 | 7 / 1.1s | 410m vision |
| Artillery | 160 | 240 | 43 | 270 | 48 / 2.8s | 1.8× building damage |
| Commander | 100 to recover | 640 | 72 | 100 | 24 / 0.85s | Officer aura and rally |

Palace/Guard School/Artillery Works/home/tower costs: 400/150/240/100/160; starting structures are free. Tower range 190; artillery can engage beyond it. Population: palace 20, home 10, maximum 100. Training queue maximum 5. See `defs` for construction and training times.

Supply graph: completed buildings within 360m; a hostile combatant within 85m of a segment cuts that edge. Disconnected queues run at 0.25 speed; resources are not refunded or lost. Only connected homes/palaces receive deliveries and heal troops. Workers divert deliveries to another linked receiver. Repair: 18 health/s, 0.3 supplies per health, stops when funds run out.

Depot: one side must hold within 90m for 8 uncontested seconds. Ownership grants
2 Supplies/s to either faction. All other rhino Supplies are physical worker
deliveries. Starting funds are 480 Story / 650 Commander. Recruitment now uses
real paid building queues and shared population limits (see enemy economy below).

Story: enemy damage ×0.7, first assault 120s, later interval 100s. Commander: full damage, first assault 85s, later interval 72s. Enemy scouts start at 22s, every third assault may detach a scouted economic raid (see 0.29.1 below). Wounded enemies retreat below 27% health and regroup at aid stations; fit units rejoin on a subsequent assault. Rataxes joins from wave two. Louise fortifies the fortress after wave one; Victor adds 20s after wave three; Rhudi boosts speed from wave four.

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

Worker construction (0.7): placement reserves the cost and assigns the nearest free
provisioner, preferring selected workers. Workers already assigned to another site
are excluded. A site progresses at normal build speed only with a live assigned
worker in footprint range; extra workers do not accelerate it. Builders move with
the same navigation rules as other units. Repair can assign a replacement builder.
The original gather order resumes after completion when no queued follow-up exists.
Site cancellation refunds 75% once and releases builders. Destroyed sites refund
nothing. Construction adds health progressively; completion does not erase damage.

## Book roster (0.8)

`cast.js` preserves all 23 crossover IDs and adds ten book entries. `book` is a
representative title; `storyOnly` prevents charges, power use and battlefield
spawns for historical/story cards. `court.js` filters by faction or book membership
and searches names, relationships and book titles. Eight new civilian effects use
the existing supply, health, morale, resource-node and reveal systems; numerical
values are documented in CHARACTERS.md. `tests/book-checks.js` runs unchanged in
the deterministic VM and the real-browser fixture, including effect exclusions,
costs, cooldowns, restart and original-roster preservation.

## Field artillery deployment (0.9.3)

`artillery.js` owns deployment and weapon geometry. Mobile guns retain 270m range,
48 damage / 2.8s. Deploy (D, or selection-panel button) takes 3s, clears the old
route and holds position. Deployed guns use 90–390m range, 72 damage / 3.6s and a
65m splash radius. Impacts do full damage within 22m, half within 43m and quarter
within 65m, including allies. Cover, Babar's protection, research, difficulty and
building vulnerability apply per victim. Only enemies visible to the shooter's
faction may be the primary target, so long-range artillery needs forward scouts.
Splash can incidentally hit concealed nearby units; it does not reveal them.

Deploying, deployed and packing guns cannot be displaced by movement or unit
separation. Setup/packing disables firing. Move, attack-move and Retreat pack
automatically for 2s and preserve the issued destination. Focus-fire and Hold
retain the emplacement; threats inside 90m require infantry defense or packing.
The explicit Pack command takes the same 2s. Morale-driven retreat pays that cost.

Rhino artillery uses the same transitions and ranges. It deploys for visible
targets at 170m or farther, provided no visible attacker is inside 140m and morale
is at least 45. It packs for close threats, retreat, or four seconds without a
visible siege target, then resumes its earlier advance. Range rings, outriggers,
setup countdowns and shell-impact circles are procedural Canvas additions.

`shoot()` now validates visibility and range even when invoked directly. Tests
that previously fired across the entire map now put the attacker in range and
explicitly verify commander death before recovery; cover tests verify the .65
ratio with a spotter. `tests/siege-checks.js` runs in the VM and real browser.


## Materials economy — 0.10.1

`economy.js` loads after game.js and before artillery/navigation. It owns Materials
stocks, quarry lookup and supply gating, per-tick extraction reservations,
idle-worker selection and producer allocation. Rules stay independent of render.js.
Three finite deposits at (275,650), (1070,770), (1260,610) each hold 1,600 Materials.
Quarries cost 100 Supplies, take 12s of on-site construction, have 600 HP and snap
to an unoccupied deposit. Extraction requires a completed, supplied quarry.
Provisioners use the existing physical 10-unit cargo and delivery loop; cargo kind
separates the two stockpiles. Three concurrent slots limit Materials extraction,
two limit each Supplies cache. Partial final cargo is conserved. Resource inventory
is shown only under current friendly vision/reveal, including enemy mining changes.

Factory: completed Guard School prerequisite, 240 S / 50 M. Gun: 160 S / 25 M.
Shell calibration: 180 S / 60 M. Cancel construction/research refunds 75% of both;
recruitment cancellation refunds both in full. Ready producers exclude hostile,
dead, unfinished, researching or full-queue buildings and rank expected next-unit
completion time with remaining progress and isolation included.

Rhinos start with 60 Materials and three quarry workers. Their physical deliveries
fund artillery and depletion prevents new guns; Supplies economy was subsequently replaced in 0.11.0 (below). The normal-order balance bot
now builds/staffs a quarry using starting funds and must produce at least one gun
from earned resources before its victory counts as passing balance evidence.


## Enemy economic base — 0.11.0

`enemy-economy.js` loads after tactics.js. `enemySpawn` now schedules macro decisions
every three seconds, not instant recruitment. Six initial Supplies workers and
three Materials workers use the shared extraction/delivery loop. Worker targets
are 9 Story / 12 Commander. Recruitment pays normal costs into completed producer
queues (up to two waiting units), reserves population, and emerges at that building.
Both teams use supply(team)/cap(team), with commander/council benefits player-only.
Basil accelerates real queue progress by 1.25 from wave two (20% less training time).

AI priorities: resume unfinished construction, allocate workers, replace losses,
rebuild missing barracks, provide population homes, replace quarry/factory, expand,
repair safe damaged buildings, scout and recruit infantry/artillery. Builder loss
pauses work; reassignment keeps the same paid foundation. Repairs deduct 0.3 enemy
Supplies per HP. No worker, unit or building is granted free when funds run out.
Story/Commander army targets are 16/24 combat units with queued overflow limited by
population. Homes are added up to 40/60 population, and two forward sites at
(1120,620), (1100,890) become candidates after 150/100 seconds with sufficient funds.
Workers use visible stocks within 520m of supplied delivery buildings, avoiding
currently observed hostile troops. Strategic site coordinates are known map data;
hidden hostile positions do not enter threat decisions. Shared placement collision
rules still prevent overlapping unseen entities, as they do for player placement.

Limitations: fixed expansion corridor, no economic research decisions yet, and
broad army composition remains rule-based. Capturing the depot removes its income
from the other side; it no longer magically stops physical worker deliveries.


## Combined arms and faction research — 0.12.1

`combat-roles.js` loads after game.js, before economy.js. It defines armor classes,
anti-armor bonus, sapper tech prerequisite, role descriptions, shared research
purchase validation, enemy counter choice and research planning. Existing damage
scales (cover, discipline, Story enemy modifier, splash) remain multiplicative.
The sapper's 20 armored bonus is added before research and damage scaling. Guns
and all structures are armored; mobile infantry and commanders are light. This
classification adds no flat damage reduction to existing units.

Sapper: 90 S / 20 M, 105 HP, 14 radius, 83 speed, 170 range, 10 base damage,
20 bonus against armor, 1.2s reload, 10s recruitment, one population. Produced at
Guard Schools after a completed Artillery Works. Recruit cancellation returns both
resources. Infantry research upgrades the full anti-armor hit by 20%. Gun research
continues to affect artillery only.

Research ownership is separate: technologies / enemyTechnologies. Both use
purchaseResearch validation, actual producer progress, supply isolation and loss
on destruction. Enemy planning begins after 100s with six combat units, selects
shells when it fields two guns (otherwise infantry), and retains 120 S / 25 M
beyond research cost before reserving a building. Paid existing queues finish;
new recruits stop appending at the reserved site. Falling below the army/funds
threshold clears that reservation. Research completion is faction-specific.

Enemy counter recruitment consults only intel[1] gun sightings younger than 60s.
It aims for two sappers per scouted gun, at most six, subject to cost, tech,
producer availability and population. It does not read hidden live unit counts.
Composition study uses normal player orders and earned resources; checks assert
scenario resolution and actual sapper fielding, not that each opening must win.


## Attack reports — 0.13.4

alerts.js loads after game.js. damageUnit records only hostile hits on team zero;
it stores the victim position and a base/army label, never hidden attacker data.
Reports merge within 200m, live 15 seconds, and are capped at five. Nearby building
hits take label/position priority over mobile units. Audio is throttled to eight
seconds per front and three seconds globally, honors mute and suspended audio,
and never creates an AudioContext. Two original triangle-wave notes are synthesized
by audio.js. Alert text updates only when changed to avoid repeated live-region
announcements. Minimap rings remain static under reduced motion.

F3/touch cycles report coordinates. Selection, existing orders, camera zoom and
pause are retained. Council, group and help modals block the shortcut. Restart
clears all reports; the actionable banner is hidden on defeat/victory.

The defensive Commander policy exists only in tests/defense-strategy.js. It
uses public player actions and earned resources, with no difficulty/stat changes.
test:commander requires actual fortification, artillery deployment and victory.

Restart also resets the unit ID allocator: formation and repath tie-breaks no
longer depend on how many previous games ran. Accelerated browser fixtures now
own simulation time; RAF renders but does not add a second physics step while an
automated interval is active. Ending/resetting a fixture restores the normal loop.

### Selection subgroups
`selection.js` retains object references for a mixed selection. The selected subgroup
is the actual `selected` command target; All restores surviving members. A changed map
selection or control-group recall invalidates the retained pool. Death removes members;
loss of the last active member restores the surviving pool. T/Shift+T cycles without
intercepting Tab, which remains available for keyboard focus. Reset clears all state.

### Adaptive enemy expansion (0.15.0)
`enemy-economy.js` snapshots visible resource quantities and hostile positions every
three seconds. Threat reports expire after 60s; resource values contribute to scoring
for 120s. Six map-known sites compete on delivery-distance savings, weighted by observed
remaining stock (Materials weight .45). Unscouted central stocks get no invented quantity;
a central-road scouting bonus can justify a bridge. Observed empty stocks remove that
bonus. Construction requires current sight, a legal connected footprint, normal funds
and a real worker. At most two surviving marked forward homes can be built. A recent
hostile report within 270m excludes a site; hidden movement never updates its location.

### Resource memory (0.16.0)
`economy.js` stores each faction's last-seen quantities by resource node. Simulation
updates record stocks in friendly vision; current sightings supersede memory. Queries
and rendering do not modify that memory. Both factions' depleted-stock fallback and
new-worker assignments choose only known nonempty stocks of the same resource type;
automatic Materials reassignment also requires a completed, supplied quarry. An explicit
rally to a remembered stock persists until observation confirms it is empty. Final
cargo is delivered before a new stock is sought. With no known stock, the worker idles.
The player must scout and issue a Gather order to restart work. Map labels use `?` for
unscouted and `~` for last-seen quantities. Depleted markers disappear only when their
emptiness is known. Reset starts fresh memories from initial friendly vision.
Broad long-match AI fairness still needs auditing beyond these covered economic paths.

### Live production report (0.17.0)
`production.js` presents completed and unfinished player production sites. F4 or the
mission's Production button toggles a nonmodal live panel; it never changes pause state.
Rows retain their DOM nodes while progress updates, avoiding focus loss. Selecting a
row closes the report, selects that site and centers the camera; the all-producers
button selects all completed sites, including those currently researching. Existing
recruit/research/cancel/rally controls then apply. Destroyed sites are removed; object
identity distinguishes reset sites that reuse IDs. Mission end and reset close the panel.

`productionRate` in economy.js is shared by simulation and report estimates. Recruitment
includes the mobilization bonus, research does not; isolation multiplies both by .25.
Construction reports labor remaining rather than inventing a travel-time prediction.

### Housing raids and population (0.18.0)
`livingPopulation` counts living mobile units; `supply` retains its existing living-plus-
queued reservations for admitting new queue entries. `populationBlocked` compares living
units to completed capacity. Every producer checks it before advancing training, so a
freed slot can release only one unit even when several queues are ready in the same tick.
Blocked queues retain progress/payment and cancellation still refunds normally. An
unfinished home supplies no population; completion permits automatic resumption. Existing
units are not removed if homes are destroyed. Research proceeds independently.
Commander recovery checks capacity before charging 100 Supplies and spawning. The court
explains a ready commander's wait. Production report and selected-site text explain blocks;
the report separately lists deployed units and queued reservations.

### Blocked coordinate destinations (0.19.0)
A* already redirected blocked goals to a free navigation cell, but arrival previously
compared against the original blocked click. `move` now resolves coordinate orders to
that free cell before arrival checks. The resolution is cached per order and navigation
version and invalidated when foundations change the grid. Replacing/completing orders
clears it. This applies to move/attack-move/retreat coordinate destinations; combat,
construction, gathering and repair target-distance checks keep their existing semantics.

### Directional infantry rendering
`infantryDirection` quantizes the movement/firing bearing to east, south, west or north.
`drawDirectionalInfantry` uses per-frame crop rectangles with proportional scaling.
It falls back to the existing atlas until the new sheet is loaded, and only affects
infantry/scout/sapper rendering. No simulation state, firing arc, collision radius or
movement rule changes. Reduced motion continues to suppress bobbing and dust.

## Infantry protection progression (0.21.2)

Guard Schools offer Field protection I (140 Supplies, 40 Materials, 30s) and II
(220 Supplies, 80 Materials, 45s). Tier II requires completed tier I and a completed
Artillery Works at purchase time. Both compete with recruitment and weapon research
at that producer, follow supply slowdown, and refund 75% on cancellation. Completed
research persists if its prerequisite building is later destroyed. Existing and future
guards/scouts/sappers absorb 2 or 4 damage per incoming hit, after cover and command
reductions. Tiers replace rather than stack. Hits retain at least 1 damage, or their
original amount if below 1; suppression remains unchanged. Workers, commanders, guns
and buildings receive no infantry armor. Protection therefore helps more against
repeated small arms than heavy shells, without erasing composition counters.

Both factions use researchRequirement(), purchaseResearch() and infantryArmor().
Basil considers armor after 180s and earlier weapon priorities, only with six mobile
combatants and reserves for replacement troops; no free upgrades or hidden-player
information is used. The normal queue must drain before research can start.
Research cards show effects and missing prerequisites, and wrap inside scrollable
command panels. Damage protection appears in selected infantry status.

## Patrol orders (0.22.3)

`patrol` is a coordinate order using normal pathfinding, combat acquisition and fog.
Its returnPoint is captured when the order becomes active, so a patrol queued behind
a move starts from the new position. Reaching an endpoint swaps the two legs without
accumulating an unbounded order queue. A queued follow-up takes priority at the next
endpoint. Hold, retreat and direct replacement orders clear the patrol as normal.
Automatic combat does not replace the route; units resume it when no visible target
is in acquisition range. Each selected unit has an independent origin and spaced
destination. Explicit patrol clicks ignore resource/focus-fire/rally contextual orders.
Blocked endpoints reuse the existing free-cell navigation resolution. Deployed guns
remain stationary until packed, as for all movement orders.

P and the touch button select patrol mode. The renderer shows a dashed connection
and rings at both endpoints; this indicates intent rather than a guaranteed straight
path through obstacles. Compact layouts use three columns for all seven field orders.

## Reconnaissance memory (0.23.1)

Every 0.5s refreshIntelligence snapshots only observed enemy id, type, position and
observation time for each faction. Mobile composition reports expire after 60s;
building reports persist until the stored location is observed without that building.
Hidden destruction therefore cannot erase a report. No health, research or queue
reference is stored. Location visibility uses the same unit vision distances and
player reveal power as live sight, without requiring the remembered object to exist.

The renderer displays remembered buildings at their recorded coordinates, after fog,
as faded atlas silhouettes with dashed footprints and LAST SEEN age. Hollow minimap
marks differ from current solid sightings. Memories provide no targeting or vision;
orders into that location still use the ordinary visible-enemy acquisition rule.
A quarry memory uses its dashed footprint; no live machinery or production is shown.

## Infantry gait (0.24.0)

Successful navigation steps increment the visual walkDistance counter. The renderer
selects stride/passing poses every 14 world units; faster units therefore animate
faster, stationary units do not march in place, and pause freezes the pose naturally.
This counter has no effect on collision, speed, attacks or economy. Infantry uses
the inspected walk atlas only while moving; old idle frames are retained, including
the image-load fallback. Reduced-motion mode retains static directional artwork.
Walk poses use a fixed foot baseline without the prior extra vertical bob.

## Researched infantry burst (0.25.1)

combat-roles.js owns RAPID_ADVANCE, eligibility, activation and enemy use. Paid
research requires drill and uses the ordinary producer queue, isolation and refund
rules. Activation changes health and absolute simulation timestamps, preserving
orders. navigation.js applies one 1.3 speed multiplier shared with command advance;
shoot applies a 0.7 reload multiplier. Pause freezes duration and cooldown.

Eligibility requires infantry, researched doctrine, health >20, morale >=35 and an
expired 24s cooldown. AI additionally requires health above 55%, morale >50, no
retreat order and a visible armed target near weapon range. AI considers buying
the doctrine after 240s through its normal paid research policy. The renderer adds
a static brass ring; selected status and the button expose duration and cooldown.

## Camera locations (0.26.1)

camera-views.js owns four mission-local snapshots of x, y and zoom. Save clamps
coordinates to map bounds and zoom to the existing 0.4–1.8 range. Recall changes
only camera state and closes the panel, preserving selection, queued orders,
pending command mode and pause. The module handles F5–F8 before normal command
keys; Shift saves, repeated keydowns cannot replace a view, and Ctrl/Meta/Alt
combinations remain available to the browser. Council/help/group dialogs block
view actions. Reset clears slots; mission end closes and disables the panel.

Views and production reports are mutually exclusive live overlays. The compact
panel scrolls within the battlefield, keeps its close header visible and starts
at the top whenever reopened. No simulation update or persistent storage is added.

## Workforce reporting and grouped builders (0.27.2)

resourceWorkReport in economy.js reads own gathering orders, cargo and proximity.
Extraction occupancy comes from current-tick canHarvest claims; displaying the
report never allocates a slot or changes gathering. Claims are filtered to living
nearby workers of the reporting faction, excluding those already carrying cargo.
The report separates assigned, extracting, hauling, approaching and waiting counts.
It reads inventory through knownResourceAmount, preserving fog-memory semantics.
Own quarry construction/supply and available delivery buildings provide actionable
blocker messages. No harvest rates or assignment rules are changed.

selectionResource identifies a selected quarry's deposit or a common gathering
assignment across selected provisioners. These selections use economic status
instead of generic army instructions. Canvas workload labels appear only for
currently observed sites while workers/quarries are selected. Grouped workers
receive the same building buttons as a single worker. The existing construction
command chooses one available selected builder and preserves other workers' orders.
Action-cache identity now includes every selected ID, so changing group membership
without changing its size cannot leave stale construction buttons.


## Queued worker construction (0.28.1)

construction.js selects a builder with queue capacity before command spends either
resource or creates a foundation. Shift/Queue uses the selected worker's existing
order list; no selected worker with a full queue is silently replaced by another
worker. Queue capacity remains sixteen future orders. Foundations are paid and
vulnerable immediately, but only an active builder on site contributes labor.

finishConstructionOrder advances through consecutive build orders, retaining the
original gathering fallback until the chain ends. Explicit follow-up orders take
priority over that fallback. Cancellation removes references to the site from
current and future orders, with the existing one-time 75% refund. Destroyed future
sites are skipped when reached; dead builders leave paid sites halted for Repair
reassignment. Deliberately queued orders now follow retreat completion. Depleted
gathering without a known replacement, or cargo-free Materials gathering blocked
by a missing/isolated quarry, yields to queued work. Carried resources are delivered
first. constructionCrew provides active/queued counts for production and quarry
reports without altering orders or progress. Foundation status no longer describes
unfinished buildings as active isolated recruitment sites.

Shared build-queue-checks.js covers lifecycle and resource accounting in Node and
Chromium. The browser suite separately uses the real construction controls, touch
Queue and Shift-pointer input. No production costs or construction times changed.


## Scouted economic operations and building approaches (0.29.1)

enemy-operations.js separates attack planning from the wave timer. enemyRaidTarget
reads intel[1] snapshots only: quarries score 6, homes 4, and workers 2. Worker
positions expire for raid selection after 30s. Within 260m of a candidate, known
towers count as three threats, guns two, other armed units one; each threat deducts
two points. Three threats or a nonpositive score rejects the target. Static defense
reports persist until re-observation; mobile threats expire after 60s. Candidates
are ordered by score, recency and ID. Hidden hp, movement and destruction are never
read by this planner.

Every third wave can detach 2–3 troops in Story or 2–4 in Commander, preserving four
main-column troops. Scouts, sappers, then guards are selected; heroes and guns stay
in the main column. Raiders queue a southern (950,1050) or northern (950,430) staging
point, followed by the target snapshot. Shared attack-move/pathfinding acquires
only currently visible enemies. The main column attacks its remembered capital
location, or the public starting capital coordinate. Commands go through issueOrder
and replace obsolete queues. Retreating or below-40%-health units retain their orders.
The specific raid dispatch message requires currently visible raiders.

The controlled outpost comparison exposed an unreachable nearest approach cell
between a home, tower and forest. If normal routing fails for a stand-off destination,
move tries eight other approach points at stop-distance + one navigation cell.
A successful alternate approach is retained until reached, so direct steering cannot
cut back into the same pocket. It is invalidated when the target, stop distance or
target position changes. Both armies share this navigation rule. The fixture checks
legal structure placement and clear unit starts, then proves repeated deliveries.


## Recurring reconnaissance (0.30.0)

enemy-recon.js reserves one recruited scout (recon flag) independently of wave
orders. Recruitment first becomes eligible at 22s and calls enemyQueue, so normal
cost, prerequisites, population and production time apply. A living scout or queued
scout prevents duplicate spending. Successful purchases defer the next opportunity
by 75s in Story or 55s in Commander; failure leaves the opportunity available.
Mission reset restores the initial time. A completed replacement receives the role.

Every macro tick the scout chooses the least recently visited safe route from
(650,880), (650,440), (1040,900), (1100,430). Arrival within 35m records a visit.
Route risk uses intelligence snapshots only: static weapons persist; mobile reports
expire after 60s. The exclusion radius is the known type's range + body radius +70m;
artillery is conservatively assumed capable of its deployed range. Immediate
withdrawal checks live weapons only after sees confirms visibility. Scouts retreat
below 60% health or 60 morale, then wait at least eight seconds and recover to 80%
health/80 morale before returning. If all routes are threatened they withdraw.
They use Move to observe rather than stopping to attack; existing fog and navigation
rules still apply. Dedicated scouts are excluded from main assault/raid selection.

The autonomous resource accounting test now measures income from owned-depot ticks
in addition to physically gathered Supplies. Recurring reconnaissance can change
depot ownership; omitting that legitimate income would falsely report free funds.
The equality assertion remains strict. Shared recon-checks covers paid recruitment,
replacement denial, fog memory, withdrawal/recovery, mission reset and a two-minute
physical circuit that discovers the player capital through normal vision.


## Battery reports and staged-offensive evidence (0.31.0)

batteryReport in artillery.js reads living guns, transitions, cooldowns and visible
in-arc targets. It mirrors focus-target priority, then nearest-target selection,
without issuing orders or applying damage. Allies within the splash radius of that
likely target produce a warning. Visible armed enemies inside the 90m blind spot
are reported separately; hidden units never enter the report. A no-target message
means no currently visible target is in the gun's firing arc, not that no enemies
exist nearby. Summaries update through the existing UI cadence.

Single guns and all-gun selections retain siege range, transition times and morale.
Their information panel allows wrapping in compact layouts. Generic combat-role
text previously overwrote the detailed artillery description; the battery report
now has its own final selection branch. Mixed selections keep their existing group
interface. No damage, costs, fire-control behavior or movement rules change.

tests/push-strategy.js shares the paid defense economy via manageArmy=false;
repairs and recruitment remain enabled while the comparison owns troop orders.
Before 120s both policies use the same defense. They commit after reaching the
chosen mobile combat-unit count and at least three guns. The staged policy uses
scouts, infantry screens and deployed guns along successive map positions; the
march policy issues combined attack-move. Both preserve withdrawals and can regroup.
The browser fixture owns fixed simulation steps, pauses an unresolved 900s window,
and never labels it a win. Default test:push runs in CI alongside earlier balance
comparisons. See PUSH-COMPARISON.md for the results and their limitations.

`minimap-input.js` owns pointer capture and camera drag state. It passes orders
to `command()` instead of duplicating targeting or formation rules. It loads
after game.js/camera-views.js and clears gestures on reset, cancellation or blur.
Shared minimap checks run in the VM and browser; browser-only checks additionally
dispatch mouse/touch PointerEvents through the registered listeners.
