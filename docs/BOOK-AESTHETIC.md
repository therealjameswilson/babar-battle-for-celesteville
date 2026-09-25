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
