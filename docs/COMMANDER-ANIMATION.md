# Commander animation — 0.38.0

Babar and Rataxes now use four-direction idle, two-pose walking and firing art: 16 frames each, 32 total. Cardinal directions are east, south, west and north; diagonals use their nearest cardinal facing. Children and support characters remain in the council roster.

## Assets and playback

`dist/assets/commanders/babar.png` and `rataxes.png` are 1254×1254 RGBA outputs from the built-in image-generation tool, saved without pixel edits. The generated size differed from the requested size; code and validation use the actual dimensions. Existing portraits and atlases remain intact. Style/identity references were the local roster leaders and allies sheets documented in CHARACTER-ART.md. Officer pistols and military roles are game inventions.

`dist/commander-animation.js` keeps inspected crop rectangles, foot anchors and muzzle coordinates separate from simulation. Do not divide the sheets into equal cells. The renderer uses a constant source-to-world scale and foot registration, avoiding width changes when a pistol extends. Walking alternates every 16 world units actually traveled. Stopping returns to idle; a successful shot displays its firing pose for 0.24 seconds, with a 0.09-second muzzle flash. The stored shot angle prevents a later movement bearing from turning the firing pose. Pause uses frozen simulation time. Reduced motion keeps walking on the idle pose and disables flashes; the short firing stance remains a combat status cue. Missing images fall back to the existing commander art.

This is a compact two-pose gait, not a fluid eight-frame cycle or eight-direction animation. Combat values, recruitment and AI are unchanged.

## Final generation prompts

Built-in image generation, not CLI/API fallback. The following exact prompts were used; the selected Babar atlas includes the targeted correction below.

### Babar

Create production game sprite atlas, TRUE transparent PNG alpha, 1536x1536, strict FOUR columns and FOUR rows,16 separate full-body poses of ONLY BABAR. Reference image top-left Babar is identity/style reference; do not include other characters. Preserve grey elephant, crown, green uniform, red bow, dark shoes, ink/gouache. Every sprite same body scale and baseline within384square, generous30px transparent gutters, entire crown trunk feet and pistol inside cell. Columns always EAST (right profile), SOUTH (front), WEST (left profile), NORTH (back). Row1: idle standing, small brass officer pistol lowered. Row2: walking left foot forward right arm forward. Row3: opposite walking phase right foot forward left arm forward. Row4: firing officer pistol in facing direction, arm extended, slight recoil, no muzzle flash baked in. North views must show back of head and coat, front views face viewer; do not substitute side views. No scenery shadows labels text grids or other characters. This is military-fable fan-game artwork, no gore. Precise sixteen-frame layout and consistent silhouette.

### Rataxes

Create transparent RGBA PNG game sprite atlas EXACT16 full-body poses of LORD RATAXES only, 4columns4rows. Reference top-left rhino is identity/style reference, do not include any other characters. Preserve brown rhinoceros horn crown burgundy greatcoat brass epaulettes cream trousers black boots. Ink/muted gouache matching reference. Uniform size eachcell, generous empty gutters no clipping. Columns left-to-right EAST right profile, SOUTH front facing viewer, WEST left profile, NORTH fully rear facing away. Rows:1idle pistol lowered;2walking left leg forward;3walking right leg forward opposite arms;4firing small brass officer pistol with slight recoil. IMPORTANT NORTH firing pose back to viewer, weapon aims AWAY into screen foreshortened mostly obscured by body, never points sideways. All north frames show back of head and coat. No baked muzzleflash no text no grid no scenery no shadows truealpha. 1536x1536 requested. Exactly sixteen recognizable same-character frames.

### Babar correction

Precise edit to transparent Babar sixteen-frame sprite atlas. Change ONLY bottom-right frame (row4 column4). He faces NORTH with his back to viewer. His pistol must aim AWAY from viewer into screen, foreshortened barrel almost hidden above his right shoulder, not point to the right. Keep rear-facing coat/head/crown and stance. Preserve all other15frames identically, alltransparent alpha, existing canvasdimensions and layout, no added backgrounds text shadows flashes. Keep entire sprite within its existing cell.

## Checks

`tests/commander-animation.cjs` checks all decoded PNG crops, anchors, four-direction pose mapping, distance cadence, shot bearing/expiry, reduced motion, stop/pause-compatible pure selection and missing-image fallback. It runs through `npm run check`. `tests/commander-browser.html` uses the real game iframe and Canvas renderer at phone portrait, landscape and desktop sizes. It produces an inspectable frame review and tests actual movement/shooting and pause; see QA.md for observed results.

