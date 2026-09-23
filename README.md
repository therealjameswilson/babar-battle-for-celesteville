# Babar: The Siege of Celesteville

A static, single-player Canvas RTS: a storybook kingdom caught in a border war. Protect the palace, keep supplies moving, capture the contested depot, and break Rataxes’s fortress. One skirmish map, two approaches, Story and Commander difficulties, and the original 33-character family/council crossover.

## Play locally

Run `npm start`, then open http://localhost:8000. Or open `dist/index.html` directly. No install, build, backend, API key, or sign-in is needed to play. Requires Node 20+ for checks and Python 3 for the optional local server.

- Click or drag to select; Shift-click adds or removes a unit. Double-click or Ctrl/Command-click selects all friendly units/buildings of the same type across the map. Touch: double-tap the same unit within 0.4 seconds, or choose **Same type** in the actions list. This selects matching friendly units across the map. Right-click a location to move or a visible enemy to focus fire.
- **A** attack-move, **M** move, **G** gather, **E** repair, **S** hold, **R** retreat. **F2** selects the army, **F3** cycles recent attack reports, **H** returns to the palace, **I** selects idle provisioners, **Space** pauses. Arrow keys/minimap pan; wheel or +/− zoom.
- Ctrl/Command + 0–9 saves a control group; the digit recalls it. Groups offers four touch slots. Shift-command or Queue appends waypoints. Production buildings accept rally points, including supply caches for provisioners. Recruitment can be cancelled with a full refund.
- **Q** activates Babar’s Stand together: 50 energy, 35s cooldown, +20 morale and 25% damage reduction for nearby troops for 8s.
- Touch uses explicit orders, then a map target. Toggle **Pan map** to drag the camera. No gesture on the battlefield scrolls the page.
- The field manual (`?`) explains supply lines, suppression, cover and recovery. Family & council pauses the simulation and restores the previous pause state on close. Sound starts only following interaction; mute is stored locally.

## Tactical loop

Provisioners physically collect supply caches and deliver to connected palaces or homes. Recruit guards and scouts at the Guard School, artillery at Artillery Works, and provisioners at the palace. Homes raise population and extend supply. Construction needs an assigned provisioner on site. The nearest free worker is assigned automatically, preferring selected workers. If the builder falls or leaves, use Repair with another provisioner to resume. Unfinished construction can be cancelled for a 75% refund. Hold **Shift** when placing another building, or enable **Queue** on touch, to give a selected provisioner consecutive construction jobs (up to 16 queued orders). Each foundation is paid immediately and can be attacked while waiting. The worker completes the chain and returns to its original gathering assignment unless you queue another explicit order. Gathering advances after a delivery, or when it cannot continue. A full queue rejects placement without spending resources.

Buildings link within 360m; hostile soldiers within 85m of a link interrupt it. Isolated recruitment operates at 25%. Clear raiders or add connecting buildings. Selecting a building shows visible supply links. The depot requires eight uncontested seconds with soldiers: ownership grants 2 Supplies/s to either faction. Enemy workers gather the rest. Raid gatherers, cut their routes, and destroy production; Basil can pay workers to rebuild, so scout his recovery.

Guards screen long-range guns; scouts are fast and see farther. Sandbags reduce incoming damage by 35% for both sides. Fire suppresses units; low morale causes withdrawal. Commanders and supplied aid stations recover morale, and aid stations heal wounds after five seconds without fire. Commander returns require time and 100 supplies. Losses therefore consume both time and logistics.

Idle Guard Schools can research Cornelius’s coordinated volleys (+20% infantry damage); Artillery Works can calibrate shells (+25% gun damage). Research costs supplies and occupies the producer; shell calibration also costs 60 Materials. Isolation slows it to 25%; cancellation refunds 75%. These upgrades affect existing and future units.

## Materials and production (0.10.1)

Build a **Materials Quarry (100 Supplies)** on a blue-gray deposit, keep its supply
line connected, and assign provisioners with Gather. They carry Materials back to
a connected palace or home. Each finite deposit starts with 1,600 Materials and
has three extraction slots; supply caches have two. Additional workers help cover
travel time, but cannot multiply extraction without limit. The Idle button or
**I** finds unemployed provisioners, including those waiting at an interrupted quarry.

Artillery Works requires a completed Guard School and **240 Supplies + 50
Materials**. Each field gun costs **160 Supplies + 25 Materials**. Choosing when to
redirect workers from Supplies to Materials now affects infantry strength and
artillery timing. Building/research cancellation returns 75% of both paid resources;
recruit cancellation returns all of both. Select multiple production buildings to
distribute recruitment to the eligible site that can finish the next unit soonest.
Enemy quarry workers use the same extraction/delivery rules and their guns consume
Materials. Their Supplies now come from physical gatherers and an owned depot, with no scheduled income.

## Enemy base economy (0.11.0)

Basil trains units in real building queues, obeys population limits, replaces lost
workers and rebuilds destroyed barracks using paid construction and worker labor.
Killing an engineer stops a foundation until another worker arrives. A bankrupt
rhino base gets no free replacements. Expansion homes connect the eastern road to
the central stocks. Enemy repairs consume enemy Supplies. After wave two, Basil’s
command reduces production time by 20%; isolation still slows it to one quarter.
Scouting reveals workers and buildings; exact enemy funds are no longer exposed.

## Combined arms (0.12.1)

**Field Sappers** train at Guard Schools after a completed Artillery Works: 90
Supplies, 20 Materials, 10 seconds. They have 105 HP, speed 83, range 170 and a
1.2-second weapon interval. Hits deal 10 damage to light troops, plus 20 against
armored guns/buildings. Guards win the direct infantry matchup; artillery wins
through range, spotting and splash. Sappers make an unprotected gun vulnerable.
Their brass demolition pack distinguishes them from ordinary guards.

Cornelius’s infantry research also upgrades sappers. Rhinos pay the same research
costs and times using their own economy; visible researching buildings show a
progress bar. Basil recruits anti-armor troops after scouting your guns, and his
reports expire after 60 seconds. Protect production and deny reconnaissance.

`npm run test:compositions` compares siege and mixed openings in both difficulties.
The siege and mixed rush openings win Story but lose Commander. A separate
[defensive Commander opening](docs/COMMANDER-OPENING.md) wins with ordinary
resources, fortification, a larger workforce and screened artillery. Run
`npm run test:commander` to verify it. These are automated cases, not exhaustive
human balance evidence.

## Attack reports (0.13.4)

Enemy hits on your forces create a named attack banner and static minimap ring.
Tap it or press **F3** to cycle recent fronts without changing your selection,
orders or pause state. Reports merge within 200m, expire after 15 seconds, and
retain at most five fronts. A short original dispatch tone respects mute and
starts only after audio has been enabled by user interaction. No camera shake.

## Development and verification

```
npm run check
npm test
npm start
```

No `npm install` is required. `dist/` is both source and client output; keep it tracked. Code is formatted with Prettier, but formatting is not a runtime/test dependency.

For browser QA, serve the **repository root** separately with `python3 -m http.server 8001`, then visit http://localhost:8001/tests/browser.html. Its fixtures are local test tools and are excluded from Pages. They include real Canvas checks, a repeatable accelerated Story victory, unattended loss, a 60-unit battle, and frame measurement. Responsive fixtures are under `tests/responsive.html?width=390&height=844` and `?width=844&height=390`.

See [architecture and balance](docs/ARCHITECTURE.md), [character continuity](docs/CHARACTERS.md), [asset provenance](docs/ASSETS.md), [QA evidence](docs/QA.md), and [publication handoff](docs/CODEX-HANDOFF.md).

## GitHub Pages

[Source repository](https://github.com/therealjameswilson/babar-battle-for-celesteville) · [Play](https://therealjameswilson.github.io/babar-battle-for-celesteville/)

The workflow checks pull requests and publishes **only `dist/`** from `main`. Enable **Settings → Pages → GitHub Actions** after the repository exists. It preserves branch and environment protection rules. Current account/deployment status is recorded in the handoff; a workflow file by itself is not proof of a successful deployment.

This is an unofficial fan game. Names and setting belong to their respective rights holders. The game’s wartime roles, powers, dialogue and numerical rules are original inventions, not franchise canon. The crossover is not an exhaustive family tree.

### Book characters (0.8)

The council now includes 33 characters, with a searchable **Book characters** view,
representative book titles and explicit continuity notes. Ten book-adventure and
history entries add eight civilian support powers and two story archives. See
[the roster and sources](docs/CHARACTERS.md).

### Siege artillery (0.9.3)

Select a field gun and press **D** or **Deploy artillery**. After 3 seconds it
holds position and fires long-range shells with splash damage—including allies.
Keep scouts ahead and infantry outside the impact area. Guns cannot hit enemies
inside their 90m blind spot. Move, attack-move or Retreat packs the gun for 2s.
Rhino artillery follows the same rules. The broader StarCraft-style gameplay
work remains active; see [the current gap audit](docs/STARCRAFT-GOAL.md).

Mixed armies now have unit-type buttons: isolate artillery or Babar for specialist
orders, then choose **All** to restore the surviving army. **T / Shift+T** cycles types.

Enemy forward bases now respond to scouting: recent threats redirect construction,
and observed empty stocks can cancel an expansion. Watch the alternative approaches
after denying a road; the enemy still pays for buildings and sends workers to construct them.

Resource gathering respects scouting for both sides. **?** means unscouted; **~** marks
last-seen stock. When known supplies run out, use **Idle (I)**, scout another cache,
and give a Gather order. Workers deliver their final load before seeking another stock.

**Production (F4)** opens a live report of idle buildings, recruiting queues, research,
and interrupted supply. Select a site to manage it, or select all completed producers.
The report leaves the battle running and preserves an existing pause.

Destroying homes can now interrupt recruitment: queues pause when living units fill
the remaining population cap. Payments and progress are retained. Complete a replacement
home or free population to resume; research continues, and returning commanders wait for room.

Queued movement now resolves clicks inside buildings or forest to nearby clear ground,
then continues the route. New construction blocking a destination triggers re-resolution.

Infantry, scouts and sappers now show front, back, left and right facing artwork for
both factions, following their movement and firing bearing.

Guard Schools now offer two tiers of **Field protection** alongside weapon research.
Spend Materials and production time to protect infantry against repeated light fire;
tier II also needs a completed Artillery Works. Artillery and suppression remain
dangerous, and Basil pays for the same upgrades.

Use **Patrol (P)**, then choose the far endpoint, to repeatedly guard a route.
Units engage visible threats and resume the route afterward. Hold/retreat or a new
order cancels patrol; a queued follow-up leaves at the next endpoint. Touch has the
same Patrol button, and selected patrols show their two endpoints on the battlefield.

Scouted enemy buildings remain as faded **LAST SEEN** silhouettes and hollow minimap
markers after leaving vision. They carry no current health or production information.
Return a scout to confirm whether the site still exists.

`npm run test:raids` runs matched quarry-harassment comparisons. See
[the raid findings](docs/RAID-COMPARISON.md) for measured economic disruption and
the remaining gap between lost production and military capacity.

`npm run test:earned-raids` adds paid full-match Commander comparisons with enemy
assaults enabled. Early specialist investment and later commitments are measured
separately; neither the tests nor the findings claim every strategy should win.

Infantry now uses a two-pose, four-direction walk animation driven by distance
travelled. It returns to the existing idle pose when stopped; reduced-motion mode
keeps static facing frames.

## Rapid advance (0.25.1)

Research coordinated volleys, then **Rapid advance doctrine** at a Guard School
(180 Supplies, 60 Materials, 35 seconds). Select guards, scouts or sappers and use
**V** or the Rapid advance button: each eligible troop spends 20 health for six
seconds of 30% faster movement and 30% shorter firing intervals. The cooldown is
24 seconds from activation. Troops need over 20 health and at least 35 morale.
Current orders remain intact. Use the burst to close distance or withdraw, then
recover at a supplied aid station; repeated use without recovery is costly.
The rhinos can research and use the same ability against visible threats.
This is an invented wartime game mechanic, not a canonical character power.

`npm run test:burst` compares activation versus normal orders in eight controlled
infantry fights and withdrawals. See [the results](docs/BURST-COMPARISON.md) for
health costs, damage gains and situations where the burst makes losses worse.

`npm run test:doctrine` compares paid research against continued recruitment in
eight full matches, including a paid second school. [Opening results](docs/DOCTRINE-OPENINGS.md) record the production
delay and distinguish simulated comparisons from the rendered browser playthrough.

## Saved camera views (0.26.1)

Use **Shift+F5–F8** to save four positions and zoom levels, then **F5–F8** to return.
The **Views** button beside the map controls offers Save/Replace and Go on touch.
Jump between the base, quarry and front while keeping your army selected and its
orders intact. The panel is live; pausing beforehand keeps it paused. Views reset
when the mission restarts. Some keyboards require Fn for function keys; the
on-screen controls provide the same actions.

## Workforce feedback (0.27.2)

Select a gathering provisioner, several provisioners assigned to the same site,
or a quarry to see assigned workers, occupied extraction slots, hauling, approach
and nearby waiting. Visible resource sites show your workforce counts while workers
or quarries are selected. A cache has two extraction slots; a quarry has three.
Assigned workers include carriers, so more workers than slots can still help on a
long delivery route. Persistent waiting is a reason to consider another site.

The report explains missing/unfinished quarries, cut supply links and depleted
stocks without exposing unseen depletion. You can also construct from a selected
provisioner group: one available worker builds while the others keep their orders.


## Scouted economic raids (0.29.1)

Every third rhino assault can split off a small squad against an economic target
it has observed: a quarry, home or worker sighted within the last 30 seconds.
Known towers and concentrations of defenders deter these raids. Story sends up to
three raiders; Commander up to four, while keeping at least four troops in the main
column. Scouts and sappers take priority; guns and Rataxes remain with the main
army. No vulnerable known site means a concentrated assault. The enemy keeps its
memory of hidden buildings rather than learning about unseen destruction.

Defend expansions, deny reconnaissance and withdraw provisioners when raiders
appear. Retreating troops and units below 40% health are excluded from new assault
orders. Navigation also tries another side of a building if the nearest approach
is trapped between terrain and structures, preserving repeated supply deliveries.


## Sustained reconnaissance (0.30.0)

The rhinos reserve one paid scout for repeated reconnaissance of both approaches.
It revisits the least recently checked safe route, avoids remembered defenses,
withdraws from visible weapon threats and returns after recovery. Main assaults
leave this scout on reconnaissance duty. Kill it to deny fresh information, or
destroy the Guard School to stop replacement training. A replacement uses normal
Supplies, queue time and population; purchases are separated by at least 75 seconds
in Story or 55 in Commander. No hidden unit positions feed these decisions.


## Battery control and offensive timings (0.31.0)

Select one or more guns to see deployed/mobile counts, readiness, reloads, close
threats and friendly-fire risk. The report uses current vision and actual firing
range. It warns when allies are near a likely impact, but does not hold fire for
you. Keep infantry ahead, use scouts to reveal distant targets, and command them
separately while deployed guns fire. Move the battery forward after clearing its
current position; attack-move also packs deployed guns.

`npm run test:push` compares a direct march with a staged Commander offensive from
the same paid economic opening. Use `-- --size=14` or `-- --size=24` to compare
other commitment sizes. See docs/PUSH-COMPARISON.md for wins, an unresolved browser
run and timing tradeoffs. These are repeatable tactical examples, not a guarantee
that staged artillery always wins or that larger forces always perform better.

### Minimap command controls (0.32.0)

Drag the minimap to move the camera. Right-click it to issue a contextual order
or set selected production buildings’ rally points. Shift or Queue appends
waypoints. On touch, choose Move, Attack-move, Patrol, Gather or Repair and tap
the minimap. These use the same visibility, formation and queue rules as the
battlefield. An order tap leaves the camera in place; releasing outside cancels
the tap. While placing a building, the minimap only pans: confirm its footprint
on the main battlefield. Pausing prevents orders but allows camera movement.

### Independent expansion bases (0.33.0)

Select a provisioner or palace and build **Field Headquarters** on clear ground
currently seen by your scouts. It costs 400 Supplies and 30 seconds of builder
work. Once complete it accepts deliveries, recruits provisioners, grants ten
population and supplies nearby buildings without a palace connection. Defend it:
losing the camp lengthens delivery trips and isolates its local production.
Village Homes remain a cheaper option along protected connected routes. Losing
the original palace still ends the mission. See [measured expansion costs and
income](docs/EXPANSION-COMPARISON.md); run `npm run test:expansion` to reproduce them.

### Expansion timing and delivery reports (0.34.0)

A selected Field Headquarters reports the Supplies and Materials physically
delivered there. These are gross receipts, including supply-efficiency bonuses,
not profit after construction, recruitment or casualties. Scout and protect the
route before diverting money and troops from the palace. Three normal-resource
Commander openings compare army-first, early camp and depot-secured camp in
[EXPANSION-OPENINGS.md](docs/EXPANSION-OPENINGS.md). Run
`npm run test:expansion-openings` to reproduce the Node comparisons.

### Consistent simulation timing (0.35.0)

Gameplay now uses fixed 50ms ticks independently of display refresh, with smooth
interpolation for moving units. Pause discards elapsed time; a stalled frame has
a bounded catch-up budget. Node and Chromium now match the tested full Commander
replay at all recorded checkpoints. See
[SIMULATION-CONSISTENCY.md](docs/SIMULATION-CONSISTENCY.md) for the tested scope,
performance measurements and updated balance results. Run `npm run test:clock`.

The field manual (`?`) includes a persistent Battlefield motion setting. System
follows your device preference; Reduced disables walking poses, bob and drifting
dust without changing gameplay. Closing the manual restores the prior pause state.

### Character gallery (0.37.0)

Family & council now includes portraits for all 33 roster entries. Open the linked [character gallery](https://therealjameswilson.github.io/babar-battle-for-celesteville/characters.html) to browse full-body sprites and download their transparent sheets. See [art provenance and crop conventions](docs/CHARACTER-ART.md). These are single-pose character assets; existing battlefield animation remains separate.

### Commander animation (0.38.0)

Babar and Rataxes now face four directions, alternate walking poses with distance traveled, and show a firing stance and aligned muzzle flash after a shot. Reduced motion disables the walking cycle and flashes. See [animation assets, prompts and tests](docs/COMMANDER-ANIMATION.md).

### Fire discipline (0.39.0)

Select soldiers or commanders and press **C**, or use **Hold fire / Weapons free**. Silent units scout and follow routes without automatically engaging. A new focus-fire command permits only its chosen target; weapons free releases the selected force. This enables deliberate ambushes and artillery volleys, but provides no invisibility. [Rules and tests](docs/FIRE-DISCIPLINE.md).

## iPhone controls (0.40.0)

Phone layouts use **Orders**, **Build / skills**, and **Unit status** tabs with
44px or larger primary touch buttons. Drag two fingers to pan; pinch to zoom.
The entire gesture, including the last finger lifting, cannot issue an order.
One finger still selects, box-selects, or applies the chosen order; Pan map
switches it to camera movement. Switching apps pauses the match. Resume manually.
The layout accounts for safe-area insets and changing browser-toolbar height.
Restart remains available from the field manual (`?`). No installation required.

## Rivalry opening (0.42.0)

A five-scene, roughly 40-second illustrated opening introduces the border war and its nuclear endgame.
Choose Begin opening to enable its original synthesized score, or Skip to briefing.
Pause, Next scene, mute and Escape remain available. Reduced motion uses static,
manually advanced scenes. Returning from another app requires Resume opening.
Watch opening replays it from the briefing; combat begins only with Take command.

### Hero combat

Select Babar → Build / skills → Fight, then tap an enemy or ground. Royal strike
(F) spends 35 energy for 60 base damage with a 12-second cooldown. Energy is shared
with Stand together. In Family / council, Madame’s separate Iron Parasol button
spends 90 supplies to hit a visible enemy within 220m of Babar for 160 base damage,
plus 70 splash within 90m and 30 additional morale loss. Cooldown: 45 seconds.
Her original permanent population bonus remains independent. These are invented
game abilities. See [combat rules](docs/HERO-COMBAT.md).

### Munitions

The third resource funds Heavy rounds (+50% damage, 8 per unit for 15s) or Smoke
cover (25% protection, 6 per unit for 12s). Start with 24; hold the central depot
for +0.5/s up to 100. Enemy soldiers interrupt its output. Supplied Guard Schools
and Artillery Works can pack 20 for 60 Supplies + 20 Materials every 30s. Select
troops or a workshop → Build / skills. [Full rules](docs/MUNITIONS.md).

Rendering now uses bounded Retina-resolution sprite caching, subtle sprite contrast,
and offscreen unit culling. [Rendering measurements](docs/RENDERING.md).

On iPhone, tap troops then ground to move or an enemy to attack. Tap a building to
open Build / train; Production selects other sites. Army / move collapses the
panel. Menu holds pause, sound and council. Touch focus changes no longer pause
play; switching away from the app still does. [Phone controls](docs/PHONE-DIRECT.md).

### Atomic endgame

Both armies can research Atomic command after Field protection II and Calibrated
field shells, then assemble one costly bomb at Artillery Works. Launch at a visible
location; the opponent gets 18 seconds to evacuate or destroy/isolate the launcher.
Friendly fire applies. [Technology, costs and counterplay](docs/ATOMIC.md).

After Atomic command, both factions can research **H-bomb command**. The larger
payload costs more and takes longer, with a 28-second warning. Both bomb types
share one payload slot. [H-bomb progression and balance](docs/H-BOMB.md).

Atomic and H-bomb impacts now have distinct illustrated mushroom-cloud effects,
with reduced-motion support. [Visual references and provenance](docs/MUSHROOM-CLOUDS.md).

## Uranium — v0.50.0

Three finite deposits (120 U each) now supply nuclear production. Completed Artillery Works unlock gathering: two extraction slots, 4 U per worker per 3 seconds, physical delivery to a supplied base. Uranium starts at zero for both factions. Atomic assembly consumes 40 U; H-bomb assembly consumes 80 U, in addition to Supplies and Materials. Research prices are unchanged. The AI assigns up to two observed-site haulers after 420 seconds and stops stockpiling at 80 U. Deposits and cargo have distinct ochre markings; the phone HUD includes the current stock. These are fictional game balance units.

## Civil Defense — v0.51.0

Build a reinforced Civil Defense shelter for 180 Supplies and 80 Materials (22s, 1,800 HP). Any public nuclear launch warning—including friendly fire—automatically evacuates both factions' provisioners to completed friendly shelters, preferring sites outside the blast warning. Navigation distributes workers around the shelter. Workers within 110m receive 95% nuclear damage reduction; this does not protect them against ordinary weapons. Protection is sampled before each blast so unit iteration order cannot change survival. Supply links are not required. Incomplete or destroyed shelters provide no protection, and distant workers must arrive in time.

Evacuation temporarily overrides movement and pauses work without discarding cargo or queued orders. Work resumes three seconds after the last active warning disappears, including aborted strikes. New orders issued during an alert take effect after all-clear. Without a usable shelter workers continue their orders. Rhino command can pay to build a shelter after seven minutes. Local Canvas bunker art uses concrete walls, a reinforced entrance and a civil-defense triangle; no new external assets.

## Damage Limitation skill — v0.52.0

Civil Defense now requires **Austin Long: Damage Limitation** at the Guard School
(150 Supplies + 50 Materials; 40 seconds). Both factions must finish the research
before constructing shelters. See [attribution and rules](docs/DAMAGE-LIMITATION.md).

## Arthur’s Motorbike — v0.53.0

Recruit Arthur at Artillery Works (180 S / 60 M, 20s). After completing your first
atomic or H-bomb, his neutron strike unlocks: 400 S / 120 M / 30 U, 360m targeting
range, 12s warning and 120s cooldown. It affects both armies and favors unit damage
over building damage. Civil Defense remains effective. See [rules and artwork](docs/ARTHUR-MOTORBIKE.md).

## Leader nuclear authority — v0.54.0

Select **Babar** to launch atomic/H-bombs or authorize Arthur's neutron strike.
He must personally see a completed friendly Palace or Field Headquarters, within
his vision range and without intervening forest/buildings. Rataxes follows the same
rule for rhino launches. Allied vision does not substitute. See [full rules](docs/NUCLEAR-AUTHORITY.md).

## Nuclear prologue — v0.55.0

The opening now foreshadows Uranium, atomic/H-bomb escalation, Arthur’s neutron payload, Damage Limitation and Civil Defense, and Babar/Rataxes’s personal headquarters-sight requirement. Local mushroom-cloud art and shelter/command-button silhouettes accompany the new scenes. All five scenes remain skippable; reduced motion uses manual advancement.

## Missiles and defense — v0.56.0

Research **Ballistic command** at Artillery Works, then build a **Ballistic Launcher**
for conventional long-range strikes. **Damage Limitation** also unlocks **Missile
Defense Batteries**. Supply and fund batteries to intercept incoming missiles;
overlapping batteries are needed against H-bombs. Reload gaps allow saturation.
Nuclear launch authorization remains with the faction leader. See [costs and rules](docs/MISSILES.md).

### Nuclear reference card (0.56.2)
Austin Long's supplied photograph now accompanies the nuclear decision briefing for
Babar and observed Rataxes projects. Open Build / train on phones to read it.
The card does not pause play or reveal hidden enemy research.

### Easier Materials mining (0.56.3)
Build a Materials Quarry on a marked deposit for 100 Supplies. Its builder begins
mining when construction finishes, unless you queued another order. On touch,
select provisioners and tap a quarry to mine; tapping an unfinished quarry sends
them to finish construction. Keep the quarry linked to your palace or headquarters.
Materials enter your stockpile when workers deliver their cargo.

### Elephant shotguns (0.57.0)
Research **Elephant shotgun kit** at an idle Guard School: 160 Supplies,
40 Materials, 30 seconds. Existing and newly recruited Elephant Guards switch to
buckshot within 95m: 24 base damage to the target and 10 to up to two visible enemies
inside a narrow forward cone, with a 1.5-second reload. Rifles remain available at
longer range. Cover, armor, suppression and infantry upgrades apply normally.
Friendly units are excluded from pellet damage. Guards carry an original Canvas
shotgun overlay with pellet trails and an original synthesized firing sound.

### Field trenches (0.58.0)
Select provisioners or the palace and choose **Field Trench** in Build / train.
Each section costs 80 Supplies and 20 Materials, has 700 health and takes 16 seconds
of worker construction. Move infantry into the 112×52m interior to gain 35% damage
reduction. On touch, select troops and tap a friendly trench to enter it.
Either faction can use an intact completed trench; artillery and motorbikes receive
no trench bonus. Cover does not stack with existing sandbags. Trenches can be
repaired and destroyed, remain traversable, and do not relay supply or block the
ruler's sight to headquarters. The original Canvas artwork depicts earth berms,
sandbags, timber revetments, duckboards and traverses. Sections have a fixed orientation.

### Occupying trenches (0.58.1)
Select infantry, choose **Enter trench** in Build / train, then tap a completed
friendly trench. Ordinary Move/right-click orders to a trench work too. Up to six
troops receive distinct interior positions and automatically Hold after arrival,
firing at targets in range without chasing out of cover. Occupied/reserved positions
are skipped; excess selected troops keep their previous orders. Move or Retreat
releases a position. Explicit queued orders still take precedence over holding.

### The Old Lady's flamethrower (0.59.0)
Recruit **The Old Lady** at the Royal Palace or Field Headquarters for 200 Supplies,
60 Materials and 25 seconds. One can be deployed or queued at a time; she uses one
population place and can be recruited again after falling. Her 220 health and 72m/s
speed make her a short-range support fighter: 100m range, 26 base damage to the
primary target and 14 to up to three visible enemies in a forward cone, every 1.2s.
Normal armor/cover apply; allies are excluded. Move, attack-move, focus fire,
Hold fire, retreat and trench entry use the normal controls. Her welcome and Iron
Parasol council powers remain separate. This combat role is invented for the game.
Artwork reuses the existing inspected Madame crop from `assets/roster/allies.png`,
with original Canvas fuel pack, hose/nozzle and flame effects; sound is synthesized.

### Sharper resources (0.59.1)
Supplies, Materials and Uranium use original local SVG sprites in
`dist/assets/resources/`: provision crates/sacks, faceted stone/steel bars and
ore with ochre veins and a marked container. Vector assets retain detail at zoom
and high device resolution; larger high-contrast name/quantity plates improve phone
readability. Gathering rules, resource stock and fog-of-war knowledge are unchanged.

### Attack-move by default (0.59.2)
Ordinary ground taps/right-clicks now attack-move armed troops: they engage enemies
along the route. The phone tab reads **Army / attack**. Choose **Move** under More
orders (desktop M) to travel without stopping to fight, including when clicking over
an enemy. Clicking an enemy normally still gives focus fire. Default rally points
send recruits on attack-move; a rally set with explicit Move remains passive.
Workers/couriers keep their normal movement and gathering, and Enter trench still
positions infantry then holds inside cover. Hold fire remains an explicit stance.

## Mac command-panel polish (0.59.3)
Narrow windows up to 950px use the compact command dock. Mouse-click a production
building to open Build / train; quarries and foundations open their status report.
On wider screens, Mission orders expands the objective while the default compact
report leaves the starting Materials deposit visible. The minimap stays visible
while scrolling production and research. Deploy again returns directly to the
briefing with the same difficulty; Watch opening replays the prologue.

Choosing a building or a map-target order closes the compact command sheet so the
whole battlefield is available for placement and commands.

## Command readiness (0.59.4)

The nuclear briefing lists research, committed or missing Uranium, payload assembly,
launch-site supply, the king's personal headquarters sight and target visibility
requirements. **Position at headquarters** selects Babar, finds a reachable clear
approach to a completed friendly headquarters, and queues Move then Hold. It does
not launch a weapon or replace reconnaissance. Launch checks still apply at targeting.
Navigation connects each unit's exact position to a clear grid point and checks
continuous clearance before skipping corners, avoiding stalls beside buildings.
