# Development handoff

## User goal

James wants a StarCraft-like game featuring Babar and the elephants versus Lord Rataxes, including their relatives and seconds-in-command, with the project living on his GitHub account `therealjameswilson`.

## Implemented

- Complete playable static browser skirmish with original Babar-themed interface and two generated transparent atlases.
- Fruit gathering, construction, recruitment, population, waves, fog, combat, win/loss and recovering commanders.
- 23 named roster entries: two field commanders, family and adviser powers, rhino court progression, and three family-history tributes. See CHARACTERS.md.
- Mobile command buttons, camera pan/zoom controls, minimap and desktop shortcuts.
- A deterministic smoke test covering all player powers, economy, battle, court effects and end states.
- GitHub Pages deployment workflow and local instructions.

## Outstanding publication step

At the time of this handoff the connected GitHub toolset could read/write existing repositories but could not create repositories. No game repository or GitHub Pages deployment was created. Have the user supply a new or explicitly selected repository before uploading. Prefer a dedicated repository named `babar-battle-for-celesteville`. Preserve any existing content and read repository guidance first.

## Validation commands

`npm test`

`npm run check`

For a local development environment, `npm start` serves `dist` on port 8000. The game also opens directly from `dist/index.html`.

## Recommended next tasks

1. Browser playtest on desktop and iPhone-sized screens. Check sprite framing, court dialog focus, touch orders, panning, map movement and a complete easy-mode win.
2. Improve pathfinding around buildings. Current direct steering plus collision separation can crowd units at structures.
3. Add named family sprites and map units if requested. Currently council characters use initial badges, and their mechanics run through the council panel; only Babar and Rataxes are named battlefield units.
4. Add multi-direction animation and sound if requested.
5. Expand into campaigns or multiplayer only after the skirmish loop has been playtested. Multiplayer requires an authoritative server and a larger architecture decision.

The project has no dependency installation or build step. Keep it simple unless a specific requested feature requires a change. All artwork is in `dist/assets/`; do not substitute remote hotlinks.

## Continuity

The roster is an intentional crossover between the classic TV series, the Badou generation and the movie’s family history. Abilities are original game rules. Do not present new game lore as franchise canon. The game does not claim exhaustive coverage of every relative in all Babar books, films and adaptations.

## Current-source integrity

`dist` is both authored source and deployable output; keep it tracked. `package.json` contains no external dependencies. The GitHub export omits the private Sites identity. Do not carry any temporary archive or credentials into GitHub.
