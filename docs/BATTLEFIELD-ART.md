# Battlefield art, 0.41.0

The authored renderer now uses textured earth, worn twin-track roads, angular
irregular forest silhouettes, static shell scars, deeper unit contact shadows,
jagged damaged-building breaches with rubble, and directional shell-impact debris.
The interface uses squared field-equipment panels, brass edges and charcoal green.
Babar's green uniform and crown, all character identities and tactical faction
markers remain unchanged. This is an environment/effects pass, not a replacement
of all existing character sheets.

`dist/battlefield-art.js` caches the static ground at world resolution, rebuilding
only once when the image decodes. It draws below fog, buildings and units. Road
paths and obstacle rectangles retain their original simulation meaning; scars
are decoration, not cover. Reduced motion disables the new impact flash/debris.
Fallback ground works if the texture does not load. The cache costs W×H×4 bytes.

## Asset provenance

`dist/assets/battlefield-earth.png` is an original generated 1254×1254 opaque PNG,
created with the built-in image-generation tool on 2026-09-20. It was inspected,
then copied unchanged into the repository. Existing character crops were not
modified. The renderer blends the texture at 48% and repeats it at 420 world units.

Final generation prompt:

> Use case: stylized-concept. Asset type: seamless repeating ground texture for a top-down Canvas military-fable RTS. Generate one square 1024x1024 opaque image, edge-to-edge, of trampled forest earth: compacted charcoal-brown mud, tiny angular slate fragments, sparse dead ochre grass and subdued moss, fine wheel-worn scuffs. Crisp etched ink and hand-painted gouache detail, gritty early twentieth-century battlefield illustration. Flat overhead orthographic view, even diffuse overcast lighting, no perspective, no horizon, no buildings, no characters, no large props, no text, no borders, no dramatic shadows. Restrained desaturated olive-grey and umber palette, medium-dark but legible, low contrast overall so green and burgundy soldiers remain readable. Small-scale consistent detail throughout, seamlessly tileable opposite edges. This is terrain surface material, not a landscape scene.

The tool returned 1254px rather than the requested 1024px. No equal-cell crops or
alpha processing apply to this opaque terrain asset.

## Verification

`tests/field-art-browser.html` verifies decoding, world cache dimensions and reuse,
reduced-motion rendering and overflow at 390×844, 844×390 and 1280×900. It records
browser CPU command-submission timings; these are not GPU frame-time or physical
iPhone measurements. The initial run measured rebuilding at 0.76–4.13ms versus
cached submission below 0.01ms. PNG exports of the real Canvas were inspected in
`artifacts/field-{390,844,1280}.png`. These exclude HTML controls, so they are not
full-page screenshots. Full-page capture remains unavailable in this preview.
