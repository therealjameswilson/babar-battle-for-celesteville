# Babar: The Siege of Celesteville

A static, single-player Canvas RTS: a storybook kingdom caught in a border war. Protect the palace, keep supplies moving, capture the contested depot, and break Rataxes’s fortress. One skirmish map, two approaches, Story and Commander difficulties, and the original 33-character family/council crossover.

## Play locally

Run `npm start`, then open http://localhost:8000. Or open `dist/index.html` directly. No install, build, backend, API key, or sign-in is needed to play. Requires Node 20+ for checks and Python 3 for the optional local server.

- Click or drag to select; Shift adds units. Right-click a location to move or a visible enemy to focus fire.
- **A** attack-move, **M** move, **G** gather, **E** repair, **S** hold, **R** retreat. **F2** selects the army, **F3** cycles recent attack reports, **H** returns to the palace, **I** selects idle provisioners, **Space** pauses. Arrow keys/minimap pan; wheel or +/− zoom.
- Ctrl/Command + 0–9 saves a control group; the digit recalls it. Groups offers four touch slots. Shift-command or Queue appends waypoints. Production buildings accept rally points, including supply caches for provisioners. Recruitment can be cancelled with a full refund.
- **Q** activates Babar’s Stand together: 50 energy, 35s cooldown, +20 morale and 25% damage reduction for nearby troops for 8s.
- Touch uses explicit orders, then a map target. Toggle **Pan map** to drag the camera. No gesture on the battlefield scrolls the page.
- The field manual (`?`) explains supply lines, suppression, cover and recovery. Family & council pauses the simulation and restores the previous pause state on close. Sound starts only following interaction; mute is stored locally.

## Tactical loop

Provisioners physically collect supply caches and deliver to connected palaces or homes. Recruit guards and scouts at the Guard School, artillery at Artillery Works, and provisioners at the palace. Homes raise population and extend supply. Construction needs an assigned provisioner on site. The nearest free worker is assigned automatically, preferring selected workers. If the builder falls or leaves, use Repair with another provisioner to resume. Unfinished construction can be cancelled for a 75% refund.

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
