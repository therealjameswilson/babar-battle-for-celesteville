'use strict';
// Pixel crops inspected per figure; generated sheets do not have equal cells.
const CHARACTER_ART = {
  "babar": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      133,
      43,
      283,
      452
    ],
    "portrait": [
      137,
      47,
      275,
      234
    ]
  },
  "celeste": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      641,
      67,
      273,
      427
    ],
    "portrait": [
      645,
      71,
      265,
      225
    ]
  },
  "cornelius": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      1167,
      68,
      296,
      430
    ],
    "portrait": [
      1171,
      72,
      288,
      245
    ]
  },
  "pompadour": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      106,
      565,
      307,
      414
    ],
    "portrait": [
      110,
      569,
      299,
      254
    ]
  },
  "troubadour": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      655,
      604,
      248,
      375
    ],
    "portrait": [
      659,
      608,
      240,
      204
    ]
  },
  "arthur": {
    "sheet": "assets/roster/leaders.png",
    "frame": [
      1217,
      633,
      228,
      347
    ],
    "portrait": [
      1221,
      637,
      220,
      187
    ]
  },
  "pom": {
    "sheet": "assets/roster/children.png",
    "frame": [
      108,
      40,
      328,
      462
    ],
    "portrait": [
      112,
      44,
      320,
      272
    ]
  },
  "flora": {
    "sheet": "assets/roster/children.png",
    "frame": [
      632,
      32,
      289,
      463
    ],
    "portrait": [
      636,
      36,
      281,
      239
    ]
  },
  "alexander": {
    "sheet": "assets/roster/children.png",
    "frame": [
      1147,
      35,
      300,
      466
    ],
    "portrait": [
      1151,
      39,
      292,
      248
    ]
  },
  "isabelle": {
    "sheet": "assets/roster/children.png",
    "frame": [
      143,
      599,
      273,
      390
    ],
    "portrait": [
      147,
      603,
      265,
      225
    ]
  },
  "badou": {
    "sheet": "assets/roster/children.png",
    "frame": [
      632,
      541,
      296,
      456
    ],
    "portrait": [
      636,
      545,
      288,
      245
    ]
  },
  "victor": {
    "sheet": "assets/roster/children.png",
    "frame": [
      1145,
      543,
      282,
      450
    ],
    "portrait": [
      1149,
      547,
      274,
      233
    ]
  },
  "rataxes": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      101,
      9,
      330,
      583
    ],
    "portrait": [
      105,
      13,
      322,
      274
    ]
  },
  "lady": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      585,
      22,
      362,
      558
    ],
    "portrait": [
      589,
      26,
      354,
      301
    ]
  },
  "basil": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      1067,
      39,
      351,
      536
    ],
    "portrait": [
      1071,
      43,
      343,
      292
    ]
  },
  "rhudi": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      128,
      624,
      292,
      377
    ],
    "portrait": [
      132,
      628,
      284,
      241
    ]
  },
  "zephir": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      582,
      614,
      312,
      394
    ],
    "portrait": [
      586,
      618,
      304,
      258
    ]
  },
  "madame": {
    "sheet": "assets/roster/allies.png",
    "frame": [
      1115,
      576,
      264,
      443
    ],
    "portrait": [
      1119,
      580,
      256,
      218
    ]
  },
  "truffles": {
    "sheet": "assets/roster/history.png",
    "frame": [
      115,
      1,
      347,
      497
    ],
    "portrait": [
      119,
      5,
      339,
      288
    ]
  },
  "periwinkle": {
    "sheet": "assets/roster/history.png",
    "frame": [
      597,
      38,
      328,
      454
    ],
    "portrait": [
      601,
      42,
      320,
      272
    ]
  },
  "babar-mother": {
    "sheet": "assets/roster/history.png",
    "frame": [
      1001,
      94,
      518,
      375
    ],
    "portrait": [
      1005,
      98,
      510,
      367
    ]
  },
  "celeste-mother": {
    "sheet": "assets/roster/history.png",
    "frame": [
      126,
      507,
      307,
      504
    ],
    "portrait": [
      130,
      511,
      299,
      254
    ]
  },
  "old-tusk": {
    "sheet": "assets/roster/history.png",
    "frame": [
      562,
      512,
      432,
      491
    ],
    "portrait": [
      566,
      516,
      424,
      360
    ]
  },
  "old-king": {
    "sheet": "assets/roster/history.png",
    "frame": [
      1052,
      495,
      444,
      516
    ],
    "portrait": [
      1056,
      499,
      436,
      371
    ]
  },
  "grifaton": {
    "sheet": "assets/roster/books.png",
    "frame": [
      178,
      8,
      229,
      524
    ],
    "portrait": [
      182,
      12,
      221,
      188
    ]
  },
  "colin": {
    "sheet": "assets/roster/books.png",
    "frame": [
      676,
      56,
      196,
      471
    ],
    "portrait": [
      680,
      60,
      188,
      160
    ]
  },
  "nadine": {
    "sheet": "assets/roster/books.png",
    "frame": [
      1163,
      67,
      207,
      458
    ],
    "portrait": [
      1167,
      71,
      199,
      169
    ]
  },
  "princess-isabelle": {
    "sheet": "assets/roster/books.png",
    "frame": [
      119,
      573,
      263,
      434
    ],
    "portrait": [
      123,
      577,
      255,
      217
    ]
  },
  "eleonore": {
    "sheet": "assets/roster/books.png",
    "frame": [
      559,
      528,
      354,
      473
    ],
    "portrait": [
      563,
      532,
      346,
      294
    ]
  },
  "crustadele": {
    "sheet": "assets/roster/books.png",
    "frame": [
      1087,
      527,
      329,
      492
    ],
    "portrait": [
      1091,
      531,
      321,
      273
    ]
  },
  "father-christmas": {
    "sheet": "assets/roster/archive.png",
    "frame": [
      10,
      149,
      494,
      754
    ],
    "portrait": [
      14,
      153,
      486,
      413
    ]
  },
  "duck": {
    "sheet": "assets/roster/archive.png",
    "frame": [
      528,
      487,
      364,
      407
    ],
    "portrait": [
      532,
      491,
      356,
      303
    ]
  },
  "polomoche": {
    "sheet": "assets/roster/archive.png",
    "frame": [
      944,
      114,
      590,
      798
    ],
    "portrait": [
      948,
      118,
      582,
      495
    ]
  }
};

// SVG viewports crop the original local PNG losslessly and retain its alpha.
// No image manipulation, remote fetch, or animation loop is needed.
function characterArtFor(id) {
  return (typeof BOOK_CHARACTER_ART!=="undefined" && BOOK_CHARACTER_ART[id]) || CHARACTER_ART[id];
}
function characterArtMarkup(id, portrait = false) {
  const art = characterArtFor(id);
  if (!art) return '';
  const crop = portrait ? art.portrait : art.frame;
  return '<svg class="character-art" aria-hidden="true" viewBox="' + crop.join(' ') +
    '" xmlns="http://www.w3.org/2000/svg"><image href="' + art.sheet +
    '" width="'+(art.width||1536)+'" height="'+(art.height||1024)+'" /></svg>';
}
