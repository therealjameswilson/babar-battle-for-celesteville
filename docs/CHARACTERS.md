# Character roster and continuity

This game intentionally combines generations. The main roster follows the animated Babar series; Badou, Periwinkle and Rhudi come from the later series. Three family-history cards refer to earlier family members. The cards’ powers and numerical effects are original game design.

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
| Basil | Chief adviser | Faster reinforcements after wave two; destroy his barracks to stop recruitment |
| Victor | Son | Friendship with elephant children delays the next wave after wave three |
| Rhudi | Grandson | Faster rhinos after wave four |

Victor is portrayed as friendly toward Babar’s children. His support effect preserves that connection. The roster calls Rhudi Rataxes’s grandson without inventing a parent relationship. Arthur’s relationship differs across adaptations; this game uses the television version. Deceased or earlier-generation family members appear as history tributes, not revived battlefield characters.

This covers the principal animated families and councils plus selected later-generation and film relatives; it is not an exhaustive genealogy across every book or adaptation. Uncorroborated extended relatives have not been added.

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
