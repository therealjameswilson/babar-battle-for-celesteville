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
