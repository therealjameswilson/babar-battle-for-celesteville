# Hero combat — 0.43.0

`dist/hero-combat.js` loads before tactics.js and keeps active combat rules separate
from rendering. Babar and Rataxes retain their normal 24-damage, 100m attacks.
Babar gains a Fight control (releases Hold fire and arms attack targeting) and
Royal strike (F): 60 base damage, 35 command energy, 12-second cooldown. Retreat,
pause, dialogs and death prevent activation. A missing visible in-range target
costs nothing. Explicit strike preserves Hold fire. Energy is shared with defense.

Madame gains Iron Parasol in her council card: 90 supplies, 45-second cooldown,
160 base damage to a visible enemy unit within 220m of Babar; 70 splash damage to
visible enemy units within 90m of the target, with 30 additional morale loss.
Both abilities prefer Babar’s eligible focus target, then the nearest target.
Normal damage modifiers, armor, cover and commander recovery apply. Iron Parasol
cannot hit buildings, allies or unseen units. No valid target means no payment or
cooldown. It works during the council’s deliberate pause. Cooldowns use simulation
time and reset with the mission. Her population benefit stays a separate purchase.

Iron Parasol is an invented council combat intervention, not a newly recruitable
Madame unit or a canonical book ability. The existing impact, smoke and sound
systems provide feedback. No children are added to frontline combat.

Run `npm run check`, `npm test`; serve the repository root and open
`tests/hero-combat-browser.html` for real-browser functional checks.
