# Siege release handoff

## Current result

Version 0.7.0 continues the supplied prototype; baseline commit `4109fb621b93a626fdb5cfcb1c04d8497ce66c5a` is preserved. The client has worker construction, supplies and delivery, recruitment and research, control groups, rally points and queued orders, A* navigation, suppression, cover, disrupted supply, finite enemy reserves, active Babar/Rataxes abilities, and all 23 roster entries. See RELEASE-AUDIT.md and QA.md for evidence and limitations.

## Verified GitHub connection and source

GitHub CLI now authenticates as `therealjameswilson`. Repository lookup under the authenticated owner returned not found, then this dedicated repository was created privately (subsequently made public with explicit user approval):

https://github.com/therealjameswilson/babar-battle-for-celesteville

The account has ADMIN permission. `origin` points to that repository. The initial push to main was verified through the GitHub commits API as `59b307adf7c37bfcfed0844dd9d0382a61a24c9d`. Subsequent documentation commits record the publication blocker. No force push occurred. Public visibility was later explicitly authorized by the user.

## Public source and Pages

The user explicitly approved making the repository public. Visibility was changed
through the authenticated GitHub CLI, then the Pages API accepted
`build_type=workflow` and returned this destination:

https://therealjameswilson.github.io/babar-battle-for-celesteville/

The initial private-plan restriction is resolved. The workflow publishes only dist.
Deployment verified: Actions run 35037872195 completed successfully, including all
checks and deploy. The public URL was opened in a real browser; skirmish start,
Babar’s active command, pause, artwork and empty warning/error logs were verified.
All 13 public client files matched local bytes over HTTPS. The .nojekyll marker is
not served as a public asset and is not required by this Actions deployment.

## Validation

Run `npm run check`, `npm test`, `npm run test:balance`, `npm start`. No installation/build is needed. Only dist is deployed. The local browser suite has 70 base checks and 10 expansion checks; rendered Story victory, mobile layout evidence and measured battle performance are documented in QA.md. These do not imply physical iPhone, every browser engine, subjective audio verification, or extended human Commander balancing.

## Recommended next development work

After publication, expand directional walk/fire animations and perform physical iPhone Safari and hands-on Commander balance testing. There is no campaign, multiplayer, save system, or eight-direction character animation.

## Book expansion, 0.8

The original 23 crossover characters are preserved within a 33-entry roster.
Ten book-adventure/history entries add eight tested civilian powers and two
non-purchasable story archives. Book characters can be filtered and searched;
Arthur’s book/TV relationships and the two Isabelles are distinguished. Sources
and exact values are in CHARACTERS.md; browser evidence is in QA.md.
