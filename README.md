# Babar: Battle for Celesteville

A playable browser real-time strategy fan game. Gather fruit, build Celesteville, train an elephant army, and capture Lord Rataxes’s fortress.

## Play

Open `dist/index.html` directly, or run `npm start` and open `http://localhost:8000`. The game uses plain HTML, CSS and JavaScript with local image assets. There are no npm dependencies, API keys, sign-in requirements or server-side services.

- **Desktop:** click or drag to select; right-click to command. Arrow keys or the minimap move the camera. Scroll or use +/− to zoom.
- **Touch:** select an elephant or building; choose Move, Attack or Gather; tap the target. Pan map enables drag-to-pan. The minimap jumps to another part of the world.
- **Economy:** gatherers automatically collect fruit. The palace trains gatherers; the Guard School trains guards; the Champion Academy trains champions. Village Homes increase the population cap.
- **Family & council:** open the paused roster to activate support powers. The roster includes 23 family members, advisers, commanders and family-history entries. Babar and Rataxes are battlefield commanders; other named characters have council or support roles.
- **Commanders:** Babar and Rataxes return home to recover when defeated. A captured palace or fortress ends the game.

## GitHub Pages

Upload this project into a repository. In repository **Settings → Pages**, choose **GitHub Actions** as the source. The included `.github/workflows/pages.yml` checks the game and publishes `dist/` whenever `main` changes. The workflow can also be run manually. The source is ready for GitHub, but repository creation and Pages enablement are separate account actions.

The GitHub export deliberately excludes `.openai/hosting.json` and source credentials. Every game asset is local and paths work beneath a GitHub project subdirectory.

## Development

Run `npm test` for the deterministic simulation checks. Run `npm run check` for JavaScript syntax validation. Neither command requires `npm install`.

| File | Responsibility |
| --- | --- |
| `dist/game.js` | Economy, movement, combat, waves, selection and controls |
| `dist/cast.js` | Character relationships and power descriptions |
| `dist/court.js` | Council interface and support powers |
| `dist/render.js` | Canvas terrain, sprites, fog, effects and minimap |
| `dist/style.css` | Desktop and mobile layout |
| `dist/assets/` | Generated character and building atlases |
| `tests/smoke.cjs` | Engine checks with a minimal DOM/canvas harness |
| `docs/CHARACTERS.md` | Roster, sources and continuity choices |
| `docs/CODEX-HANDOFF.md` | Current state and next development steps |

## Current scope

One skirmish map, two difficulties, an opponent that trains reinforcements and attacks in waves, construction and recruitment queues, fog of war, a family/council upgrade system, and mouse/touch controls. No multiplayer, saved campaigns, speech, or complete directional sprite animation yet. Unit movement uses direct steering and separation rather than navigation-mesh pathfinding. Browser playtesting has not yet been performed; the included checks exercise the simulation, not a real browser.

This is an unofficial fan game based on Babar. Character names and settings belong to their respective rights holders. All gameplay powers are inventions for this game, not claims about events in the books or television series.
