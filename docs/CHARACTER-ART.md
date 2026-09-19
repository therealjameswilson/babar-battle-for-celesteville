# Character artwork — 0.37.0

All 33 existing roster members now have a portrait crop and a complete, single-pose sprite. The family/council displays the portraits; `dist/characters.html` shows both views with search and sheet downloads. These assets do not add battlefield units or change support powers. Historical characters remain tributes, and children remain civilian support.

## Files and integration

Six new 1536×1024 RGBA PNGs are authored assets under `dist/assets/roster/`: `leaders.png`, `children.png`, `allies.png`, `history.png`, `books.png`, `archive.png`. They are preserved directly from the built-in image-generation output, including real alpha. No runtime network service is used.

`dist/character-art.js` maps every `COURT` id to its sheet, full-body `frame`, and `portrait`, each `[x, y, width, height]` in source pixels. The generated rows and columns are irregular: do not divide them into equal cells. The SVG viewport helper crops these PNGs without modifying them. A renderer can also pass `frame` to Canvas `drawImage`. Existing battlefield atlases and their crop coordinates remain intact.

Portraits are head/upper-body crops of the same artwork, rather than separate illustrations. Full-body figures are idle poses, not walk/fire animation cycles. Images load only when the council/gallery uses them; there is no new animation loop or backend.

## Internet references and interpretation

The online pictures were used to inspect visual identity, not copied into the published asset set. Reference downloads and rejected generated sheets remain outside `dist/` and Git. Babar characters remain the property of their respective rights holders; generated fan art is not an official or licensed character pack. No claim is made that an Internet image is public domain.

- [Classic television cast image](https://babar.fandom.com/wiki/File%3AThe_class_of_Babar_Madame_Babar_Rataxes_Cornelius_Pompadour_Celeste_Lady_Rataxes_Basil_Arthur_Victor_Zephir_Alexander_Flora_Pom_The_Little_Baby_Elephant_and_Isabelle.png): inspected for Babar's green suit/crown/red bow, Celeste's rose dress, Cornelius's blue tricorne/spectacles, Pompadour's wig, Madame's purple dress, Basil's shirt/tie, and the children. Fan-page captions were not used to establish new relationships.
- [Babar et le professeur Grifaton cover](https://www.abebooks.fr/Babar-professeur-Grifaton-Brunhoff-Laurent-Hachette/30185461681/bd): inspected red expedition clothing, rounded hat and human silhouette. The generated notebook and styling are adaptations.
- [BnF exhibition essay, pages 1–6](https://cnlj.bnf.fr/sites/default/files/revues_document_joint/PUBLICATION_8434.pdf): book-art context, original black-line/gouache medium, and the Zephir archive. This is not evidence for every generated costume.
- [Babar's Mystery interior listing](https://www.bookxcess.com/products/babars-mystery), [Badou cast reference](https://www.getradical.in/babar.html), and [Babar and Father Christmas listing](https://www.jonkers.co.uk/rare-book/5027/babar-and-father-christmas/jean-de-brunhoff) were located during image research. Availability varies; these are supplementary leads, not proof of exact costume fidelity.

The set intentionally interprets the cast for this game's setting. Rataxes's burgundy greatcoat, Celeste's green shawl, maps, satchels, medical bags and civilian equipment are invented. Troubadour, Periwinkle, the movie elders, Colin, Nadine, the mermaids, Princess Isabelle, Duck and Polomoche use original costume/anatomy interpretations where a definitive usable visual reference was not established. In particular, Duck's terrier appearance and Polomoche's shaggy horned form are game designs, not assertions about the precise book illustrations. Relationship/source notes remain in `CHARACTERS.md` and `cast.js`.

## Generation recipe

Tool: built-in image generation, not the API/CLI fallback. Each sheet was generated independently; no browser images are embedded in the final files. The following prompt set records the final direction and exact sheet order, with the shared output constraints:

> Transparent PNG game sprite atlas, 1536×1024; six isolated full-body characters in three columns and two rows (archive: three characters in one row). Muted gouache and black ink Babar storybook style, complete heads/tusks/tails/feet, generally facing right. Wide transparent gutters, no labels, borders, scenery or ground shadows. Preserve recognizable identity; children are noncombat support and historical figures are archive tributes.

| Sheet | Top row / left-to-right | Bottom row |
|---|---|---|
| leaders | Babar: crown, green suit, red bow; Celeste: crown, rose dress, green shawl; Cornelius: spectacles, blue tricorne, navy coat | Pompadour: powdered wig, monocle, orange coat, ledger; Troubadour: smaller wig, plum coat, documents; Arthur: sailor cap, white shirt, red shorts, satchel |
| children | Pom: blue-collar shirt, plans; Flora: pink dress, map; Alexander: tousled hair, yellow collar, message bag | Isabelle: green romper/bonnet, toy; Badou: blue explorer jacket, red scarf, binoculars; Victor: purple-white shirt, friendship letter |
| allies | Rataxes: burgundy command coat/crown; Louise: purple dress, pearls, plans; Basil: white shirt, red tie, suspenders, clipboard | Rhudi: green-white shirt/shorts; Zephir: red cap/yellow shirt, binoculars; Madame: white bun, purple dress, civilian register |
| history | Truffles: chef toque/apron, bread; Periwinkle: lavender dress/teal cardigan, medical bag; Babar's mother: unadorned quadruped elephant | Celeste's mother: green shawl; Old Tusk: elderly long-tusk elephant, staff/brown cloak; Old King: crown/purple robe |
| books | Grifaton: red expedition hat/coat, notebook; Colin: blue shirt/brown shorts; Nadine: yellow dress/green cardigan, message | Princess Isabelle: monkey princess/pink dress/crown; Eleonore: young mermaid, teal tail/ivory blouse; Crustadele: elderly mermaid, spectacles/lavender shawl |
| archive | Father Christmas: red coat, gift sack; Duck: small tan dog/dark ears/red collar; Polomoche: shaggy horned story monster | None |

The first leaders draft was replaced to improve spacing. Hidden RGB colors in transparent pixels can appear like a painted backdrop in some raw image previews; the alpha channel is real and has been decoded and checked. Crop bounds were inspected individually and are regression-tested for opaque edge clipping.

## Verification

`tests/character-art.cjs` runs from `npm run check`: decodes all PNG scanlines, verifies the exact roster mapping, real transparency, image sizes, valid crops and no opaque pixels cut at full-body crop edges. `tests/art-browser.html` exercises actual browser image decodes, Canvas alpha, gallery search and all council tabs at desktop/mobile widths. See `QA.md` for the observed run and remaining screenshot limitation.
