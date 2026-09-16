# Asset provenance and generation

Original `characters.png` and `buildings.png` were supplied in the source archive and preserved in the imported baseline. The character notes describe them as generated artwork, with custom irregular crop coordinates. No franchise frames or book scans were introduced.

Final runtime assets:

- `dist/assets/characters-siege.png`: eight military-fable sprites, generated with the built-in image tool using the original atlas as an edit target, then padded and alpha-cleaned. True RGBA transparency, 1254 × 1254.
- `dist/assets/buildings-siege.png`: eight weathered buildings, generated with the built-in image tool using the original atlas, then padded to 85% and alpha-cleaned. True RGBA transparency, 1254 × 1254.
- `dist/audio.js`: original synthesized noise percussion for rifle/cannon effects and low drum pulses. No downloaded music or sound recordings.
- `dist/render.js`: original Canvas supply crates, roads, forest obstacles, sandbags, gun carriages, muzzle flashes, dust, smoke and breached-building overlays.

No API keys, external asset URLs, fonts, or runtime services. Unsuccessful checkerboard-backed variants remain outside the repository. The final files were inspected for transparency, entire sprite framing, and crop boundaries. Two-way mirrored art and rotating guns indicate direction; there is no eight-direction walk cycle.

## Prompt set used (built-in tool)

**Character redesign:** “Edit this eight-character Babar RTS atlas into a serious late nineteenth/early twentieth century military fable. Preserve the exact 4 columns by 2 rows composition and identities, entire bodies with clear empty gutters and no clipping. Transparent background. Top row Babar with crown and forest-green field greatcoat, elephant provisioner carrying closed canvas supply satchel, elephant infantry in green field uniform carrying a rifle, heavy elephant artillery officer in charcoal green carrying rangefinder. Bottom row imposing Lord Rataxes with crown and burgundy greatcoat, rhino supply worker, rhino infantry rifleman in burgundy uniform, heavy rhino officer. Side-facing three-quarter views facing right. Readable hand-painted ink and gouache silhouettes, dusty boots, leather belts, brass fittings. Serious dignified faces. No gore, no text, no backdrop, no bright blue parade uniforms, no fruit.”

**Building redesign:** “Preserve original eight building types and original placement, each entire building contained within its own cell, generous transparent padding no clipped flags or walls. Transform to somber military-fable architecture with muted forest-green and charcoal slate roofs, weathered stone, sandbags and boarded lower windows, brass banners, supply crates. Babar's elephant palace remains recognizable with green domes and crown flag; guard school becomes military barracks, academy is an artillery workshop with small field gun outside, house is a civilian aid station. Bottom row rhino fortress, barracks, military hall, wooden lookout tower: retain horn insignia and burgundy banners. Restrained ink and gouache, matching the Babar military field-uniform character atlas. No text, no shadows outside each cell, actual transparent background. No terrain or backdrop. Retain 1254 square atlas scale and irregular columns of reference.”

**Padding correction:** “Keep all eight military Babar elephant and Rataxes rhino characters, faces, uniforms, equipment, poses, colors and row/column order exactly. Each sprite needs more transparent margin: shrink each individual entire character about 12 percent around its own center, keeping it centered in the same original cell, and restore complete outer cape and boot edges if touching the canvas. Keep 1254x1254 atlas and true transparent alpha backdrop. No new objects, no text, no checkerboard. There must be at least 18 pixels of fully transparent empty space at all outer canvas edges and between neighboring characters. Preserve irregular column centers matching original. Do not crop or clip crown, trunk, horn, rifle, cape, or boots.”

**Final alpha correction:** “Remove ONLY the gray-and-white checkerboard background from this padded eight-character atlas and export true RGBA transparent background. The checkerboard must not be drawn in the output. Keep all eight characters, sizes, entire bodies, positions, uniforms, and transparent padding exactly as in this input. Preserve 1254 by 1254 canvas. No clipping, no other changes. Actual transparent alpha pixels outside the characters.” The building atlas received the equivalent background-extraction instruction, preserving all buildings and flags.

These images are original generated fan-game assets; the underlying character names and setting remain the property of their respective rights holders.

**Final building alpha correction:** “Remove the background. Isolate these eight buildings on a transparent background. Keep the exact image dimensions, building positions and all empty padding. Deliver a PNG with transparency, with no backdrop of any color or pattern. Remove all gray and white checkerboard pixels outside the buildings. Preserve the buildings.”


### Materials economy visuals (0.10.1)
Quarry platform, braced derrick, bucket, faction stripe, mineral outcrops and cargo
crates are original Canvas geometry in render.js. Existing damage overlays apply.
No new external or generated raster asset was introduced in this increment.


### Field Sapper (0.12.1)
Reuses each faction's existing infantry atlas crop, with an original Canvas brass
cross-braced demolition-pack overlay. No additional generated sprite sheet was
created; this is a visible role variant rather than a unique full-body illustration.

### Attack reports (0.13.4)
Static Canvas minimap rings and a CSS dispatch button use existing faction colors.
The original two-note triangle-wave tone is synthesized in audio.js; no audio
sample, external asset or generated artwork is added.

### Directional infantry (0.20.0)
`dist/assets/infantry-directions.png` is a new built-in image-generation output, copied
without pixel edits. The existing military atlas served as a style/character reference.
It contains elephant infantry in green and rhino infantry in burgundy, with east, south,
west and north views. Generated dimensions are 1254×1254 RGBA (not the requested 1024);
60.05% of pixels have zero alpha. The renderer uses eight individually inspected crop
rectangles in `infantryFrames`; it does not assume equal cells. Browser pixel checks
require transparent margins around every frame and substantial visible artwork.

Prompt: “Create a production-ready directional infantry atlas for the Babar military-fable
RTS, using the reference's elephant and rhino infantry. Four columns: east/right profile,
south/front, west/left profile, north/back; elephant row above rhino row. Same uniforms,
brass helmets and rifles, grounded neutral ready poses, full bodies, consistent scale,
true transparent RGBA background and generous gutters. Muted ink/gouache silhouettes
readable at 55px. No crowns, children, scene, text, grid, checkerboard or clipping.”

Guards, scouts and sappers use these views; existing role overlays remain. Commanders,
workers and artillery officers retain the previous mirrored artwork. Facing selects a
static frame; this release does not introduce a four/eight-direction walk cycle. Existing
reduced-motion behavior is retained. Original supplied and earlier generated atlases
remain tracked and unchanged.
