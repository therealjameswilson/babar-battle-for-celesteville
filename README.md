# Babar: The Siege of Celesteville

A static, single-player Canvas RTS: a storybook kingdom caught in a border war. Protect the palace, keep supplies moving, capture the contested depot, and break Rataxes’s fortress. One skirmish map, two approaches, Story and Commander difficulties, and the original 33-character family/council crossover.

## Play locally

Run `npm start`, then open http://localhost:8000. Or open `dist/index.html` directly. No install, build, backend, API key, or sign-in is needed to play. Requires Node 20+ for checks and Python 3 for the optional local server.

- Click or drag to select; Shift adds units. Right-click a location to move or a visible enemy to focus fire.
- **A** attack-move, **M** move, **G** gather, **E** repair, **S** hold, **R** retreat. **F2** selects the army, **H** returns to the palace, **Space** pauses. Arrow keys/minimap pan; wheel or +/− zoom.
- Ctrl/Command + 0–9 saves a control group; the digit recalls it. Groups offers four touch slots. Shift-command or Queue appends waypoints. Production buildings accept rally points, including supply caches for provisioners. Recruitment can be cancelled with a full refund.
- **Q** activates Babar’s Stand together: 50 energy, 35s cooldown, +20 morale and 25% damage reduction for nearby troops for 8s.
- Touch uses explicit orders, then a map target. Toggle **Pan map** to drag the camera. No gesture on the battlefield scrolls the page.
- The field manual (`?`) explains supply lines, suppression, cover and recovery. Family & council pauses the simulation and restores the previous pause state on close. Sound starts only following interaction; mute is stored locally.

## Tactical loop

Provisioners physically collect supply caches and deliver to connected palaces or homes. Recruit guards and scouts at the Guard School, artillery at Artillery Works, and provisioners at the palace. Homes raise population and extend supply. Construction needs an assigned provisioner on site. The nearest free worker is assigned automatically, preferring selected workers. If the builder falls or leaves, use Repair with another provisioner to resume. Unfinished construction can be cancelled for a 75% refund.

Buildings link within 360m; hostile soldiers within 85m of a link interrupt it. Isolated recruitment operates at 25%. Clear raiders or add connecting buildings. Selecting a building shows visible supply links. The depot requires eight uncontested seconds with soldiers: ownership grants 2 supplies/s and cuts enemy reserve shipments. Destroy Basil’s barracks to stop his recruitment.

Guards screen long-range guns; scouts are fast and see farther. Sandbags reduce incoming damage by 35% for both sides. Fire suppresses units; low morale causes withdrawal. Commanders and supplied aid stations recover morale, and aid stations heal wounds after five seconds without fire. Commander returns require time and 100 supplies. Losses therefore consume both time and logistics.

Idle Guard Schools can research Cornelius’s coordinated volleys (+20% infantry damage); Artillery Works can calibrate shells (+25% gun damage). Research costs supplies and occupies the producer. Isolation slows it to 25%; cancellation refunds 75%. These upgrades affect existing and future units.

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
