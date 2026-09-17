# Field Headquarters — 0.33.0

A Field Headquarters costs **400 Supplies**, takes **30 seconds** of on-site
provisioner work, has **1,100 health** and grants **10 population** when finished.
Unlike a Village Home it can start on clear ground currently seen by friendly
forces, without a nearby building. It independently supplies linked structures,
accepts both cargo types and recruits provisioners. Existing 360m supply links
can still be interrupted. The palace remains the mission's loss condition.
Cancellation returns 75%; a foundation grants neither supply nor population.

This offers a costly alternative to a connected chain of 100-Supply homes.
A home is still the cheaper delivery point where a protected connection exists.
Workers have to reach and finish the headquarters; a distant foundation is not
an instant teleport, income source or recruitment point.

## Controlled delivery comparison

`npm run test:expansion` starts each case with the same 500 Supplies and four
provisioners beside the same central caches. Combat, enemy macro and depot income
are disabled. The expansion pays 400 and removes one provisioner from gathering
while it builds. No workers are added. The third case destroys the completed
headquarters at 90 seconds to measure loss of local deliveries, not combat DPS.

| Time | Home delivery: available Supplies | Protected HQ: available Supplies | HQ destroyed at 90s: available Supplies |
| --- | ---: | ---: | ---: |
| 30s | 580 | 160 | 160 |
| 60s | 650 | 420 | 420 |
| 120s | 820 | 1,010 | 790 |
| 240s | 1,140 | 2,200 | 1,120 |

Four-minute delivered income is 640 / 2,100 / 1,020 respectively. The protected
camp repays its cost between 60 and 120 seconds; losing it reverses the advantage
in this comparison. These timings depend on this location, crew and route.
A real Chromium rendered run of the protected case also delivered 2,100 by 240s.
This is economic evidence, **not a full-match expansion win or universal build
order recommendation**. Full-match expansion timing versus military spending
remains the next balance comparison.

## Enemy and presentation

Rhino camps use the same production, construction, supply and delivery rules.
The macro planner considers one headquarters only when it has at least 550
Supplies, recent reports show home stocks below 900, and current scouting reveals
a safe candidate near a reported cache with at least 400 remaining. Missing or
stale reports cannot imply depletion. Remembered threats can veto candidates.
Scouted player headquarters are valuable economic raid targets.

The command tent is original procedural Canvas artwork (weathered canvas, timber
windows and a faction HQ flag), stored in render.js. It participates in normal
construction, damage, selection, fog-memory and minimap rendering. No external
asset or runtime dependency is required.
