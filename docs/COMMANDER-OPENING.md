# A defensive Commander opening

This is one automated, earned-resource winning line, not a guarantee or the only
viable strategy. Match timing varies. The test uses normal purchases, placement,
repair, movement, deployment and Babar's command; it changes no unit stats or
starting funds. See QA.md for observed results and remaining balance limits.

1. Recruit a Forest Scout and keep it with the defensive force. Its sight lets
   field guns engage enemy artillery beyond ordinary infantry vision. Replace it
   if lost; unsupported guns cannot fire on targets they cannot see.
2. Build the northwestern Materials Quarry. Grow toward eleven provisioners;
   assign two to Materials and keep the others delivering Supplies.
3. Reserve 240 Supplies and 50 Materials for Artillery Works. Constantly buying
   guards can delay this indefinitely even while Materials accumulate.
4. Build homes before population blocks recruitment. Start producing guns;
   keep enough Supplies reserved that infantry queues do not starve artillery.
5. Add a Lookout Tower on clear ground near the eastern approach after the
   economy and early army are established. Hold guards and Babar ahead of the palace. Deploy guns behind them, within
   friendly sight. Use Stand together during an assault and assign a provisioner
   to repair damaged fortifications. Recovery buildings help wounded troops.
6. Advance with a screened gun force rather than sending new recruits alone.
   The reference policy waits for five guns and roughly 28 combatants, attacks
   the depot, then the fortress. Reinforce that offensive through moderate losses;
   regroup only after falling below twelve combatants or two guns. Requiring a
   full initial army after every casualty can stall an otherwise winning siege.

Press **F3**, or tap the attack report, to inspect raids while production remains
selected. Repeated presses cycle recent fronts. The marker records the attacked
friendly position, not an unseen enemy's location. Reports expire after 15 seconds.

Run `npm run test:commander` for the repeatable simulation. The local browser QA
page has **Defensive Commander ×20** for an accelerated rendered run. This is not
a substitute for human playtesting or a promise that one opening handles every
future balance change.
