# Book-reference art direction — 0.65.0

The five owner-supplied photographs of *Babar and the Wully-Wully* and
*Babar's Mystery* supersede the earlier military-rendered palette for this pass.
They guide fine black contours, simple dot eyes, flat watercolor washes, cream
paper, green suits, red epaulettes and teal architectural details. The photographs
and page text are not included in the deployed client.

## Assets and provenance

New raster illustrations generated with the built-in image-generation tool:

- `dist/assets/book/units.png`: eight inspected figures, 1536×1024 RGBA. Babar in
  a green suit; Rataxes in yellow with red epaulettes; both factions' workers,
  guards and artillery crew. Elephant green and rhino cream/red remain distinct.
- `dist/assets/book/buildings.png`: eight inspected buildings, 1536×1024 RGBA.
  Green-roof palace/school/works, a red-roof cottage, ochre rhino fortress and works,
  red-roof barracks, and a teal lighthouse-inspired lookout tower.
- `dist/assets/book/council.png`: six figures, 1181×1332 RGBA. Celeste, Cornelius,
  the Old Lady, Pompadour, Troubadour and Basil. Together with the two commander
  figures, these replace eight principal council/intro/gallery illustrations.
- `dist/assets/book/cover.png`: 1536×1024 title/briefing/share illustration.

`book-art.js` records measured, irregular crops and native dimensions. Alpha-bound
checks reject clipped outlines; no equal-cell assumptions or image resampling.
The first building generation was rejected for cramped gutters. The council
revision removed an unwanted crown from Troubadour. Original generated files are
retained outside the export; only selected outputs are included here.

## Prompt set

Shared direction: illustration-story; owner photographs are style/character
references only. Fine slightly uneven black ink, flat watercolor, dot eyes,
rounded ears and long trunks, minimal shading. No photographic/3D rendering,
glossy armor, gradients, labels, watermarks or copied page text.

1. Units: transparent four-column/two-row full-body atlas, right-facing three-quarter
   figures, transparent padding. Top: Babar in green three-piece suit, white shirt,
   bow tie and crown; cream-shirt/blue-trouser provisioner with crate; green-coated
   rifle guard; green-coated artillery crew. Bottom: crowned yellow-uniformed
   Rataxes with red epaulettes; cream-shirt rhino worker; cream/red rhino guard;
   cream/red artillery crew. Black shoes, wood-stock rifles, no ground shadows.
2. Buildings: transparent four-column/two-row atlas with matching mild elevation,
   cream plaster, green/teal/red/ochre roofs, simple rounded arches and sparse
   foliage. Buildings listed above. Revision: shrink each complete drawing into
   its cell with generous transparent gutters, retaining style and alpha.
3. Cover: original landscape composition; green-suited Babar left, yellow-clad
   Rataxes right facing across a winding pale road; cream/green palace, teal
   lighthouse, red-roof houses, loosely inked trees and small faction guards.
   Serious rivalry with the books' warmth; generous cream paper; no lettering.
4. Council: transparent three-column/two-row full-body atlas. Celeste in cream
   floral dress; Cornelius spectacles, tusks, black jacket, red trousers; petite
   white-haired human Old Lady in red; Pompadour dark tailcoat; Troubadour green
   waistcoat and rolled message; Basil cream coat/red epaulettes, pointed dark cap
   and staff map. Revision: replace Troubadour's erroneous crown with a plain
   dark bowler; preserve other figures and transparency.

## Rendering and scope

`book.css` changes surfaces and text colors without altering responsive geometry.
`battlefield-art.js` caches pale roads, grass strokes and scalloped tree canopies
once. Collision, forest rectangles, cover, fog information and simulation RNG are
unchanged. Resource/cover labels retain high contrast on the lighter map.

Book battlefield figures use mirrored profiles with a distance-driven lean/lift
and retained firing feedback. These are not new four-facing, multi-frame gait
atlases; legacy directional sheets remain fallback assets. All combat mechanics
and reduced-motion support remain. The Old Lady's book clothing is drawn beneath
her existing game-only flamethrower equipment.

The other 25 roster illustrations and specialist vehicles/nuclear assets retain
the earlier art; their game roles are unchanged. Extending the book treatment to
those secondary illustrations and adding matching four-direction gait sheets is
the next art task. Costumes/equipment are game interpretations, not new claims
about book canon. No rules, costs, abilities or nuclear mechanics changed.

## Directional infantry — 0.66.0

`dist/assets/book/infantry-walk.png` is a new 1254×1254 RGBA atlas generated with
the built-in image tool from `units.png` as the character/style reference. It
contains 16 figures: elephant and rhino infantry, east/south/west/north, two stride
poses. Actual output size differs from the requested 2048 square; crop coordinates
use the real native size. Rows and columns were measured from alpha gutters, not
assumed equal cells. All 16 outlined figures pass crop-edge checks.

Final generation prompt: new transparent four-column/four-row infantry atlas;
match the existing green elephant rifle guard and cream/red rhino rifle guard,
pointed black caps, black shoes, thin ink and flat watercolor. Columns east,
south, west, north; paired rows alternate forward foot for each faction. Slightly
elevated RTS view, consistent body scale and anatomy, diagonal wood-stock rifles,
full figures with padding, no scenery/shadows/text/crowns/other characters. The
selected output is unresampled and its generated alpha is preserved.

`bookInfantryPose` chooses a heading from movement or the latest shot and switches
stride every 14 traveled pixels. Idle and reduced-motion infantry hold pose zero;
firing briefly holds a matching direction with restrained recoil. Scouts and
sappers share the infantry atlas. This is a two-pose walk, not a full gait cycle.
The existing profile and legacy sprite paths remain loading/error fallbacks.
The artwork changes no simulation rules, target selection or unit costs.

## Book commanders — 0.67.0

Two new built-in image-generation outputs are stored locally as
`dist/assets/book/babar-motion.png` and `dist/assets/book/rataxes-motion.png`,
each 1254×1254 RGBA with 16 figures. They use `units.png` as the character/style
reference. `book-commanders.js` records measured native crop/foot/muzzle anchors.
The renderer reuses `commanderPose`: idle, two walking poses switching every 16
traveled pixels, and a 0.24-second firing pose in four directions. Recent shots
control facing; the short muzzle flash respects reduced motion. The book profile
and original commander atlases remain loading fallbacks.

Prompt set (built-in tool, no API fallback):
- Babar: 4×4 transparent atlas; grey elephant, dot eyes, round ears, long trunk,
  yellow crown, green three-piece suit, white shirt, black bow tie/shoes. Columns
  east/south/west/north, rows idle/left-foot stride/right-foot stride/pistol firing.
  Full-body consistent scale, ink/flat watercolor, generous alpha gutters, no
  background/shadows/text, no painted muzzle flashes. North shot aims away/up.
- Rataxes: same layout/style, pink-grey rhino, prominent white horn, round-tipped
  crown, yellow ornate tunic/trousers, red epaulettes, black boots. Pistol only in
  firing row, foreshortened front/back aim. Preserve his broad silhouette.
- Babar revision: change only the bottom-right firing arm/pistol from sideways to
  raised, foreshortened northward aim. Keep the other figures and transparency.

The generated sprites are copied unresampled. Alpha-edge tests cover every crop;
visual Canvas inspection covers stances, muzzle placement and selection-ring
alignment. This is a two-stride animation with separate idle/fire poses, not a
full many-frame gait. Worker/support/vehicle art extension remains open.

## Provisioner cargo and direction — 0.68.0

Built-in image generation produced `dist/assets/book/elephant-worker.png` and
`dist/assets/book/rhino-worker.png`, both native 1254×1254 RGBA. Each contains 16
figures: four facings, two empty-handed strides and two loaded strides. Measured
irregular crops and foot anchors are recorded in `book-workers.js`. Files were
copied unresampled, preserving generated alpha.

Prompt set: use existing `units.png` provisioners as identity/style references;
four columns east/south/west/north, paired rows empty-handed walking followed by
paired rows carrying a compact wood crate in both hands. Alternate forward foot,
consistent full-body scale, generous alpha gutters, no shadows/background/text.
Elephants: grey skin, cream short-sleeved shirt, blue trousers, black shoes, no hat.
Rhinos: pink-grey skin, white horn, cream short-sleeved shirt, charcoal trousers,
black shoes and pointed black cap, no epaulettes. Fine ink and flat watercolor;
back-facing cargo is occluded naturally by the body, never painted onto the back.

`bookWorkerPose` uses actual `carrying > 0`, facing and traveled distance. There
is no crate on an empty worker. Loaded workers retain a colored S/M/U badge above
the head, including from behind. Delivery removes both crate and badge. Reduced
motion freezes stride while preserving cargo; existing profile art remains the
image-loading fallback. Rules and extraction/delivery values are unchanged.

## Central supply yard — 0.69.0

- Final asset: `dist/assets/book/depot.png`, 1254×1254 RGBA, generated with the
  built-in image-generation tool. Original retained as
  `exec-cd78c2a3-e907-4518-946a-eb77bdadeda3.png` in the session's generated-images
  directory. Reference: the game's existing `assets/book/buildings.png` atlas.
- Native alpha crop `[116,290,1056,718]` has transparent margins and no clipped
  opaque outline. The renderer draws it at 112×76 world pixels; the faction flag
  and capture ring are Canvas overlays. No photographed book page is deployed.
- Prompt: “Use case: illustration-story. Create ONE new game sprite, using the
  attached existing game building atlas ONLY as style reference. Subject: a small
  open-sided quartermaster supply yard, cream canvas awning with restrained
  teal-green stripes, four timber posts, a few wooden supply crates and beige
  provision sacks clustered at front-right, with ample open walk-through space.
  Match the reference's fine black ink outlines, simple watercolor flat fills,
  vintage French children's-book charm and slightly elevated front three-quarter
  view. Readable clean silhouette at 110 pixels wide. No characters, no fixed
  faction flags, no text or logos, no weapons, no surrounding landscape, no cast
  shadow or glow. One whole object centered with generous transparent margins,
  no cropping. Genuinely transparent RGBA background. This is an open walk-through
  objective, not an enclosed building. Keep palette cream, teal and ochre wood.
  Square output.”

## Specialist structures — 0.70.0

Final local asset: `dist/assets/book/specialist-buildings.png`, 1536×1024 RGBA.
Built-in image-generation output `exec-7ed17fd7-42cb-4c71-a021-fc207eccbf50.png`,
retained in the session generated-images folder. The existing book buildings atlas
was the style reference. Six independently measured crops in `book-specialists.js`
have clear alpha margins; Canvas supplies the faction pennants and status labels.

Prompt: create a 3-column × 2-row atlas, thin black ink contours and simple flat
watercolor in a vintage French storybook aesthetic; 1536×1024 transparent RGBA,
35px gutters, whole sprites, slightly elevated front three-quarter view, readable
at 90px. Top: timber quarry gantry/hanging stone bucket/ore pile/cream shed; cream
field headquarters with green pitched roof, arched entry and staff maps; low rounded
ochre civil-defense bunker, broad reinforced doorway and small blue triangle.
Bottom: fictional single upright ivory rocket on a low cream hatch platform;
prominent oval teal radar dish with two short interceptor tubes on a platform;
empty wide WWI earth trench with sandbag parapet, duckboards and open interior.
Neutral cream, teal, ochre and warm grey; no faction flags, characters, labels,
logos, background, cast shadows or glow. Reference used only for style.

`drawBookSpecialist` shares the same atlas for live and remembered structures.
Building damage, construction opacity, selection footprints, defense range and
six trench slots retain their existing rules/overlays. Loading falls back to the
previous procedural drawings. Unknown types now explicitly return false from the
base book-building renderer instead of accidentally selecting an unrelated frame.

## The Old Lady and Arthur — 0.71.0

Built-in image generation produced these final local assets:

- `dist/assets/book/old-lady-motion.png`: 1254×1254 RGBA, 16 measured crops. Source
  `exec-aab1a347-9682-4a2e-bf2a-daf0fb6c7984.png`, corrected north-fire version
  `exec-751106e3-ce44-4745-84d4-a715b846ec23.png` (the latter is deployed).
- `dist/assets/book/arthur-bike.png`: 1536×1024 RGBA, eight irregular measured crops.
  Source `exec-c410139e-8d8a-4cfa-8e8a-0059ffa27cea.png`.

Old Lady prompt: use the top-right human in the existing book council atlas as
identity/style reference. Four columns E/right, S/front, W/left, N/back; four rows
idle, left-foot stride, right-foot stride, braced firing. Preserve white curls,
red dress, black shoes; compact olive pack, hose and fictional nozzle held at waist
height. Fine ink/flat watercolor, consistent full-body scale, transparent gutters,
no fire, shadow, caption or background. Correction prompt: preserve the other 15
figures; make only the bottom-right figure rear-facing, braced and firing due north,
nozzle pointing twelve o'clock close to her head, not diagonally right. Final
native crops were remeasured and alpha-checked after correction.

Arthur prompt: identity from bottom-right Arthur in the existing leaders atlas;
book unit atlas for ink/watercolor style. Complete grey elephant riding a vintage
teal motorbike, two black wheels, brass lamp, brown saddle and luggage; white/blue
sailor shirt and cap, red shorts, messenger bag. Four columns E, S, W, N and two rows
parked / slight forward riding lean with changed wheel spokes. Front/rear views
have narrow aligned wheels; profile shows both. 1536×1024 transparent RGBA, full
wheels/cap and generous gutters; no weapon, nuclear marking, blur, background,
shadow or text. No detached portrait collage.

`book-specialist-heroes.js` owns pose and feet/nozzle anchors. The Old Lady holds
her actual shot bearing for the 0.4-second flame lifetime. Arthur uses parked and
riding silhouettes. Reduced motion freezes movement pose. Original loading
fallbacks remain; the book-profile fallback for the Old Lady now faces her weapon.
Canvas draws original ink-edged flame layers, fading without moving the camera.
Effect target coordinates are presentation metadata; combat damage/range/costs
are unchanged. Generated originals remain in the session generated-images folder.

## Complete council and archive roster — 0.72.0

Four new alpha sheets reconcile the remaining 25 entries with the book treatment;
all 33 portraits/full figures and source downloads now share one art resolver.
The archive interface uses cream paper/green ink. Measured crop manifests, source
IDs, prompt set and interpretation limits are in CHARACTER-ART.md. This closes
the secondary roster-art gap; directional gun-crew animation remains unfinished.
