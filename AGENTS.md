# Project conventions

This is a static Canvas RTS. `dist/` is authored source and must stay tracked.
Run `npm run check`, `npm test`, and `npm start` (Python HTTP server, port 8000).
No npm install or build is needed. Use project-relative, local assets only.
Keep simulation rules separate from rendering. Navigation uses a 30px grid.
Add deterministic rule checks for tactical changes; these are not browser tests.
Run real browser QA for controls/layout and record evidence in docs/QA.md.
Preserve the 23-character crossover roster and distinguish invented powers from canon.
Never commit credentials, ZIP archives, unrelated repositories, or .openai/hosting.json.
