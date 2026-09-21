# Munitions — 0.44.0

A third resource supplements Supplies and Materials. This is a player command
reserve: 24 at mission start, capped at 100. Basic combat and recruitment remain
available without it. Rhino depot control denies the reserve while retaining its
existing Supplies income; AI does not cast these player command abilities.

Owning the central depot produces 0.5 Munitions per simulation second. Living
armed enemy mobile units within 90m interrupt production, including while capture
is in progress. Killing or displacing them restores production. Supplies retain
their existing ownership-based income. The HUD, depot status and map label report
income or interruption. Income does not bank above the cap.

A completed, supplied Guard School or Artillery Works can immediately pack 20
Munitions for 60 Supplies and 20 Materials, with a 30-second cooldown per building.
This consumes gathered resources and competes with army production. Packing does
not occupy the training queue. Insufficient room, funds, isolation, construction
or cooldown prevents payment. Multiple workshops provide more packing capacity.

Select armed mobile units and open Build / skills:

- Heavy rounds: 8 Munitions per eligible unit, +50% attack damage for 15 seconds.
  Includes commander strikes and artillery; normal armor/cover modifiers apply.
- Smoke cover: 6 per eligible unit, 25% damage reduction for 12 seconds. Shares
  the protection effect with Babar’s command and cannot stack it. The commander
  cannot shorten an existing smoke effect. Smoke does not block vision.

Already affected units are excluded from payment and cannot refresh their effect.
Remaining eligible units receive an all-or-nothing purchase; select fewer if the
reserve is insufficient. Buttons show the exact price and eligible count. Unit
status shows expiry, brass cartridge marks indicate heavy rounds, and restrained
static haze indicates smoke. No new animation is required for reduced motion.
Pause and modal guards prevent accidental purchases; restart resets reserves and
effects. All assets remain local and authored Canvas/CSS.

Implementation: munitions.js owns income, purchases and action definitions;
game.js calls its tick/UI hooks and applies the damage multiplier. Render code
only displays status. Shared tests run in Node and munitions-browser.html.
