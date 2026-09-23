# Character roster and continuity

This game intentionally combines generations. The roster now includes 22 book characters, identified by representative book appearances, within a 33-entry crossover. The original 23 entries remain; Badou, Periwinkle and Rhudi come from the later series. Three family-history cards refer to earlier family members. The cards’ powers and numerical effects are original game design.

## Celesteville

| Character | Relationship or office | Game role |
| --- | --- | --- |
| Babar | King | Recovering field commander; nearby health/morale rally |
| Celeste | Wife and queen | Healing near palace and homes |
| Pom | Son | Faster construction |
| Flora | Daughter | Wider vision |
| Alexander | Son | Delay a wave |
| Isabelle | Youngest child | Extra health |
| Arthur | Celeste’s brother; Babar’s brother-in-law in TV continuity | Faster movement |
| Cornelius | Chief adviser | Building discount |
| Pompadour | Finance and protocol adviser | Improved supply deliveries |
| Troubadour | Pompadour’s assistant | Faster recruitment |
| Zephir | Monkey friend | Temporary map reveal |
| Madame | The Old Lady who raised Babar | Population allowance |
| Chef Truffles | Palace cook | Whole-army health recovery |
| Periwinkle | Pom’s wife; Badou’s mother | 25-second paid commander recovery |
| Badou | Babar’s grandson; Pom’s son | Discover a supply cache |
| Babar’s mother | Family history | Provisioner health tribute |
| Celeste’s mother | Movie family history | Village population tribute |
| Old Tusk | Celeste’s grandfather in the movie | Artillery health tribute |

## Rhinoland

| Character | Relationship or office | Game role |
| --- | --- | --- |
| Lord Rataxes | Ruler | Recovering field commander; joins from wave two |
| Lady Rataxes / Louise | Wife | Fortress strength after wave one |
| Basil | Chief adviser | 20% shorter training after wave two; paid worker replacement, production rebuilding and expansion; raids disrupt his economy |
| Victor | Son | Friendship with elephant children delays the next wave after wave three |
| Rhudi | Grandson | Faster rhinos after wave four |

Victor is portrayed as friendly toward Babar’s children. His support effect preserves that connection. The roster calls Rhudi Rataxes’s grandson without inventing a parent relationship. Arthur’s card now distinguishes Babar’s cousin in the books from Celeste’s brother in the television continuity. Deceased or earlier-generation family members appear as history tributes, not revived battlefield characters.

This covers the central book family and friends, principal guests from selected book adventures, and the established animated families and councils; it is not an exhaustive genealogy across every book or adaptation. Uncorroborated extended relatives have not been added.

## Sources checked

- [Babar TV series — character roster](https://en.wikipedia.org/wiki/Babar_%28TV_series%29): classic family, court, Rataxes family and Basil.
- [Babar: Les Aventures de Badou — personnages](https://fr.wikipedia.org/wiki/Babar_%3A_Les_Aventures_de_Badou): Pom, Periwinkle/Pervenche, Badou and Rhudi.
- [Le Triomphe de Babar — cast and plot](https://fr.wikipedia.org/wiki/Le_Triomphe_de_Babar): Celeste’s mother and grandfather, Old Tusk.
- [Babar character entries](https://www.behindthevoiceactors.com/characters/Babar/): supporting character-name cross-check.

## Artwork

Two built-in image-generation requests created the transparent 1254×1254 atlases. Character brief: 4×2 atlas of Babar, fruit gatherer, elephant guard, elephant champion, Rataxes, rhino gatherer, rhino guard, rhino champion; full-body storybook figures with readable silhouettes. Building brief: 4×2 atlas of palace, guard school, academy, home, rhino fortress, barracks, champion hall and lookout tower. Both use custom crop boundaries in `render.js` because generated cells are not exactly equal. No reference book illustrations or television frames were copied into the assets.

## Siege version roles

Only Babar and Rataxes are named battlefield units. All children remain civilian planners, messengers, scouts in the story, or family morale support; buying a card never deploys a child soldier. Cornelius and Celeste remain advisers/support leaders rather than recruitable frontline units. History tributes change doctrine statistics without reviving characters. The full card descriptions and cooldowns in `dist/cast.js` are authoritative for current game powers. See ARCHITECTURE.md for numerical rules and ASSETS.md for the revised military artwork.

Cornelius also sponsors the invented coordinated-volley research at the Guard School:
this adds a production and supply decision to his role as chief adviser. It is an
optional game doctrine, separate from canonical relationships and his council power.

Babar and Rataxes now also have battlefield commands with regenerating energy,
documented in ARCHITECTURE.md and their roster descriptions. Stand together emphasizes
Babar's protective leadership; forced advance emphasizes Rataxes's aggressive command.
These are invented abilities, separate from canonical personalities and family ties.


## Book expansion (0.8)

Use **Family & council → Book characters** to browse the book cast, or search by
name, relationship or book title. The central book cast already present comprises
Babar, Celeste, Pom, Flora, Alexander, their youngest daughter Isabelle, Arthur,
Cornelius, Zephir, the Old Lady, Babar’s mother and Rataxes. Madame is now displayed
as **The Old Lady (Madame)**. Book labels identify an appearance, not necessarily a
debut. The following ten entries are new:

| Character | Book and canonical connection | Invented game function |
| --- | --- | --- |
| Professor Grifaton | *Babar and the Professor*; Old Lady’s brother | 100 supplies / 80s: restore 120 HP to completed friendly buildings |
| Colin | Same book; professor’s son | 60 supplies, once: mark an 800-supply physical cache |
| Nadine | Same book; professor’s daughter, cave explorer | 45 supplies / 60s: reveal map for 18s; never shorten existing intelligence |
| Princess Isabelle (monkey) | *Babar and Zephir*; princess rescued by Zephir | 65 supplies / 70s: restore 30 morale to friendly mobile units |
| Eleonore | Same book; young mermaid who helps Zephir | 55 supplies / 65s: restore 80 HP to provisioners |
| Crustadele | Same book; elderly mermaid aunt | 70 supplies / 80s: restore 200 HP to completed Village Homes |
| Father Christmas | *Babar and Father Christmas*; Babar’s guest | Free, once: 200 supplies from civilian donations |
| Duck | Same book; dog who helps Babar find Father Christmas | 40 supplies / 55s: scouts recover 60 HP and 20 morale |
| Old Elephant King | *The Story of Babar*; deceased predecessor | Historical account; no purchase or battlefield resurrection |
| Polomoche | *Babar and Zephir*; book antagonist | Zephir’s archive dispatch; not a member of the rhino army |

All healing and morale are capped at the recipient’s maximum. Buildings under
construction cannot be repaired by these powers. They do not replace worker
construction or supply links. Children remain civilian supporters. The monkey
princess and Babar’s elephant daughter have separate IDs, relationships and books.
The fantasy characters contribute story-inspired support; no new combat species
or fantasy campaign has been added. Cards use existing typographic monograms,
not new character illustrations. Only Babar and Rataxes remain named field units.

### Book sources

- [Morgan Library: Babar and Arthur manuscripts](https://shop.themorgan.org/products/babar-plush) identifies *Babar’s Cousin: That Rascal Arthur*.
- [Dartmouth Library’s Babar essay](https://www.dartmouth.edu/library/Library_Bulletin/Apr1994/Pickering.html) identifies Arthur as Babar’s cousin and Rataxes in *The Travels of Babar*.
- [Kirkus: Babar and the Professor](https://www.kirkusreviews.com/book-reviews/laurent-de-brunhoff/babar-and-the-professor/) verifies Grifaton, Colin, Nadine and their relationships.
- [Common Sense Media: Babar and Zephir](https://www.commonsensemedia.org/book-reviews/babar-and-zephir) verifies the monkey princess, Eleonore, Crustadele and Polomoche.
- [Random House: Babar and Father Christmas](https://www.penguinrandomhouse.com/books/38382/babar-and-father-christmas-by-jean-de-brunhoff/) verifies Father Christmas and Duck.
- [Publishers Weekly: Babar’s Little Girl](https://www.publishersweekly.com/9780394886893) verifies Babar and Celeste’s youngest daughter Isabelle.
- [Babar: first-book synopsis](https://en.wikipedia.org/wiki/Babar_the_Elephant) cross-checks the former king’s death and Babar’s succession.

This is a principal-cast roster with selected adventure guests, not a claim to
catalogue every incidental character in Jean and Laurent de Brunhoff’s books.

As of 0.59.0, Madame (The Old Lady) is also a unique recruitable flamethrower unit
at the palace or Field Headquarters. Her battlefield role and weapon are fictional
game inventions; the relationship and existing council entry are unchanged.
