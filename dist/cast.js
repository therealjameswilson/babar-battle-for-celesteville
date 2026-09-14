/* Family relationships follow the animated series, with the later Badou generation.
 * All gameplay roles, prices and powers below are original game design.
 * The storybook roster deliberately combines generations. See docs/CHARACTERS.md.
 */
const COURT = [
  {id:'babar',name:'King Babar',relation:'King of Celesteville',group:'Royal family',team:0,initials:'B',title:'Royal rally',text:'Restore 80 courage to nearby elephants. Babar leads from the field.',cost:0,cooldown:45},
  {id:'celeste',name:'Queen Celeste',relation:'Babar’s wife',group:'Royal family',team:0,initials:'C',title:'Care for the kingdom',text:'Palaces and homes restore 3 courage per second to nearby elephants.',cost:100},
  {id:'pom',name:'Pom',relation:'Babar and Celeste’s son',group:'Royal family',team:0,initials:'P',title:'The royal architect',text:'New buildings finish 30% faster.',cost:100},
  {id:'flora',name:'Flora',relation:'Babar and Celeste’s daughter',group:'Royal family',team:0,initials:'F',title:'Explorer’s map',text:'Every elephant can see 25% farther into the fog.',cost:90},
  {id:'alexander',name:'Alexander',relation:'Babar and Celeste’s son',group:'Royal family',team:0,initials:'A',title:'A clever distraction',text:'Delay the next rhino wave by 25 seconds. Once per mission.',cost:70},
  {id:'isabelle',name:'Isabelle',relation:'Babar and Celeste’s youngest child',group:'Royal family',team:0,initials:'I',title:'A little encouragement',text:'Every elephant gains 20 maximum courage, including future recruits.',cost:90},
  {id:'arthur',name:'Arthur',relation:'Celeste’s brother; Babar’s brother-in-law',group:'Royal family',team:0,initials:'A',title:'Uncle Arthur’s shortcuts',text:'Elephants travel 15% faster.',cost:120},
  {id:'cornelius',name:'Cornelius',relation:'Babar’s chief adviser',group:'Royal council',team:0,initials:'Co',title:'Wise preparations',text:'New buildings cost 15% less fruit.',cost:100},
  {id:'pompadour',name:'Pompadour',relation:'Finance and protocol adviser',group:'Royal council',team:0,initials:'Po',title:'An orderly treasury',text:'Gatherers bring home 25% more fruit per basket.',cost:120},
  {id:'troubadour',name:'Troubadour',relation:'Pompadour’s assistant',group:'Royal council',team:0,initials:'T',title:'Everything in order',text:'Training takes 20% less time.',cost:110},
  {id:'zephir',name:'Zephir',relation:'Babar’s monkey friend',group:'Royal council',team:0,initials:'Z',title:'Treetop lookout',text:'Reveal the entire map for 25 seconds.',cost:50,cooldown:55},
  {id:'madame',name:'Madame',relation:'The Old Lady who raised Babar',group:'Royal council',team:0,initials:'M',title:'A generous welcome',text:'Add 10 permanent places to your population limit.',cost:90},
  {id:'truffles',name:'Chef Truffles',relation:'Celesteville’s palace cook',group:'Royal council',team:0,initials:'CT',title:'The royal picnic',text:'Restore 100 courage to every elephant on the map.',cost:90,cooldown:65},
  {id:'periwinkle',name:'Periwinkle',relation:'Pom’s wife; Badou’s mother',group:'Next generation',team:0,initials:'Pe',title:'A well-stocked infirmary',text:'Recovering commanders return in 12 seconds instead of 25.',cost:80},
  {id:'badou',name:'Badou',relation:'Babar and Celeste’s grandson; Pom’s son',group:'Next generation',team:0,initials:'Ba',title:'A new trail',text:'Discover a fresh orchard near the palace.',cost:60},
  {id:'babar-mother',name:'Babar’s mother',relation:'Remembered in the family story',group:'Family history',team:0,initials:'BM',title:'Lessons in kindness',text:'A family tribute: gatherers gain 30 extra courage.',cost:50},
  {id:'celeste-mother',name:'Celeste’s mother',relation:'Family elder from Babar: The Movie',group:'Family history',team:0,initials:'CM',title:'Village solidarity',text:'Village Homes provide 5 additional population places each.',cost:90},
  {id:'old-tusk',name:'Old Tusk',relation:'Celeste’s grandfather in Babar: The Movie',group:'Family history',team:0,initials:'OT',title:'An elder’s resolve',text:'Royal Champions gain 60 extra courage.',cost:110},
  {id:'rataxes',name:'Lord Rataxes',relation:'Ruler of Rhinoland',group:'Rhinoland',team:1,initials:'R',title:'The rhino charge',text:'Leads the assault personally from wave two. Returns to his fortress when tired.',cost:0},
  {id:'lady',name:'Lady Rataxes',relation:'Rataxes’s wife, Louise',group:'Rhinoland',team:1,initials:'LR',title:'Fortress first',text:'After wave one, the rhino fortress gains 250 extra strength.',cost:0},
  {id:'basil',name:'Basil',relation:'Rataxes’s chief adviser',group:'Rhinoland',team:1,initials:'Bs',title:'Efficient reinforcements',text:'After wave two, rhino training is 20% faster.',cost:0},
  {id:'victor',name:'Victor',relation:'Lord and Lady Rataxes’s son',group:'Rhinoland',team:1,initials:'V',title:'Friends across the border',text:'His friendship with the elephant children buys 20 seconds after wave three.',cost:0},
  {id:'rhudi',name:'Rhudi',relation:'Lord and Lady Rataxes’s grandson',group:'Next generation',team:1,initials:'Rh',title:'A competitive prince',text:'After wave four, rhinos move 10% faster.',cost:0}
];
