'use strict';
// Original book-style roster art. Crops are measured alpha bounds, not equal cells.
// Historical figures remain tributes; these portraits do not create combat units.
const BOOK_ROSTER_ART = {
 "pom": {"sheet":"assets/book/roster-children.png","frame":[108,41,328,464],"portrait":[108,41,328,274],"width":1536,"height":1024},
 "flora": {"sheet":"assets/book/roster-children.png","frame":[617,31,309,473],"portrait":[617,31,309,279],"width":1536,"height":1024},
 "alexander": {"sheet":"assets/book/roster-children.png","frame":[1146,39,301,466],"portrait":[1146,39,301,275],"width":1536,"height":1024},
 "isabelle": {"sheet":"assets/book/roster-children.png","frame":[137,590,290,404],"portrait":[137,590,290,238],"width":1536,"height":1024},
 "badou": {"sheet":"assets/book/roster-children.png","frame":[624,527,312,470],"portrait":[624,527,312,277],"width":1536,"height":1024},
 "victor": {"sheet":"assets/book/roster-children.png","frame":[1124,537,313,460],"portrait":[1124,537,313,271],"width":1536,"height":1024},
 "arthur": {"sheet":"assets/book/roster-friends.png","frame":[202,54,292,465],"portrait":[202,54,292,274],"width":1536,"height":1024},
 "zephir": {"sheet":"assets/book/roster-friends.png","frame":[602,140,288,375],"portrait":[602,140,288,221],"width":1536,"height":1024},
 "truffles": {"sheet":"assets/book/roster-friends.png","frame":[1048,16,333,504],"portrait":[1048,16,333,297],"width":1536,"height":1024},
 "periwinkle": {"sheet":"assets/book/roster-friends.png","frame":[156,532,339,473],"portrait":[156,532,339,279],"width":1536,"height":1024},
 "lady": {"sheet":"assets/book/roster-friends.png","frame":[613,527,325,487],"portrait":[613,527,325,287],"width":1536,"height":1024},
 "rhudi": {"sheet":"assets/book/roster-friends.png","frame":[1096,606,230,400],"portrait":[1096,606,230,236],"width":1536,"height":1024},
 "babar-mother": {"sheet":"assets/book/roster-history.png","frame":[53,164,351,287],"portrait":[184,164,220,186],"width":1536,"height":1024},
 "celeste-mother": {"sheet":"assets/book/roster-history.png","frame":[480,84,257,393],"portrait":[480,84,257,232],"width":1536,"height":1024},
 "old-tusk": {"sheet":"assets/book/roster-history.png","frame":[797,102,327,381],"portrait":[906,102,218,226],"width":1536,"height":1024},
 "old-king": {"sheet":"assets/book/roster-history.png","frame":[1168,68,321,410],"portrait":[1168,68,321,242],"width":1536,"height":1024},
 "grifaton": {"sheet":"assets/book/roster-history.png","frame":[106,541,206,428],"portrait":[106,541,206,253],"width":1536,"height":1024},
 "colin": {"sheet":"assets/book/roster-history.png","frame":[497,562,176,408],"portrait":[497,562,176,241],"width":1536,"height":1024},
 "nadine": {"sheet":"assets/book/roster-history.png","frame":[864,581,183,390],"portrait":[864,581,183,230],"width":1536,"height":1024},
 "princess-isabelle": {"sheet":"assets/book/roster-adventures.png","frame":[163,17,300,458],"portrait":[163,17,300,270],"width":1536,"height":1024},
 "eleonore": {"sheet":"assets/book/roster-adventures.png","frame":[592,24,342,464],"portrait":[592,24,342,274],"width":1536,"height":1024},
 "crustadele": {"sheet":"assets/book/roster-adventures.png","frame":[1092,24,316,470],"portrait":[1092,24,316,277],"width":1536,"height":1024},
 "father-christmas": {"sheet":"assets/book/roster-adventures.png","frame":[111,475,407,538],"portrait":[111,475,407,317],"width":1536,"height":1024},
 "duck": {"sheet":"assets/book/roster-adventures.png","frame":[607,686,307,317],"portrait":[720,686,194,185],"width":1536,"height":1024},
 "polomoche": {"sheet":"assets/book/roster-adventures.png","frame":[1063,493,408,520],"portrait":[1063,493,408,307],"width":1536,"height":1024},
};
Object.assign(BOOK_CHARACTER_ART, BOOK_ROSTER_ART);
