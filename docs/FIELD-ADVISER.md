# Cornelius’s field adviser

The optional briefing checkbox enables six lessons during a normal skirmish:
20 Supplies physically delivered, a newly recruited guard, 20 Materials delivered,
a scout reaching sight range of the central depot, capturing that depot, and
fielding artillery. The compact mission button shows the current lesson. Open it
for instructions and a contextual selection/placement shortcut. Dismiss guidance
at any time; Field manual → Show field adviser restores it.

Lessons observe actual state, not clicks or elapsed time. Recruiting a guard means
a completed new unit, not an unpaid selection or unfinished queue. Scout progress
requires a player's scout to reach its own sight range; knowing the map location
is insufficient. Milestones can complete out of order and remain complete after
losses. Recovery advice for missing provisioners or population blockage takes
priority. Completed milestones survive checkpoints. Older checkpoints without
adviser state load with it disabled until explicitly enabled.

Show-me controls select existing friendly units or buildings, open normal paid
placement, or centre the map. They do not purchase, build, recruit, issue movement
orders, grant resources, reveal fog, slow the enemy or pause the simulation.
Opening quarry placement centres a known map deposit; the player still places and
pays for the building. Production shortcuts show the recruitment category.

`field-guide.js` owns disposable UI plus the small checkpointed progress record:
`enabled`, `done`, and `startUid` (distinguishes reinforcements from starting units).
`resetFieldGuide` runs after initial spawning. The renderer refreshes guidance at
four updates per simulation second; it performs no navigation searches or drawing.
Controller menus recognise the adviser panel and Back closes it without pausing.
Keyboard Escape also closes it. The panel stays scrollable on small screens.

Run `npm run test:guide`. Serve the repository root and open
`tests/field-guide-browser.html`, with optional `?size=phone` or `?size=landscape`.
The browser fixture uses real simulation for deliveries, recruitment and quarry
construction/mining. It places a scout and gun and assigns depot ownership to
check later lesson detection; that portion is a fixture, not a manual victory.
