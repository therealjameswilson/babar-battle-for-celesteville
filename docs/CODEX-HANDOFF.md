# Siege release handoff

## Current result

Version 0.7.0 continues the supplied prototype; baseline commit `4109fb621b93a626fdb5cfcb1c04d8497ce66c5a` is preserved. The client has worker construction, supplies and delivery, recruitment and research, control groups, rally points and queued orders, A* navigation, suppression, cover, disrupted supply, finite enemy reserves, active Babar/Rataxes abilities, and all 23 roster entries. See RELEASE-AUDIT.md and QA.md for evidence and limitations.

## Verified GitHub connection and source

GitHub CLI now authenticates as `therealjameswilson`. Repository lookup under the authenticated owner returned not found, then this dedicated repository was created privately:

https://github.com/therealjameswilson/babar-battle-for-celesteville

The account has ADMIN permission. `origin` points to that repository. The initial push to main was verified through the GitHub commits API as `59b307adf7c37bfcfed0844dd9d0382a61a24c9d`. Subsequent documentation commits record the publication blocker. No force push or public visibility change occurred.

## Pages requires a visibility or account-plan decision

Creating an Actions-based Pages site via GitHub's API returned HTTP 422: “Your current plan does not support GitHub Pages for this repository.” The repository is private. No Pages URL has been returned or verified.

The user must choose whether to make this source public or retain private source and use a plan that supports private-repository Pages. Do not change visibility without explicit approval. Account billing/upgrades must be completed by the user.

After the decision, recheck the account/repository and enable Pages with build_type=workflow. Watch the workflow to a terminal result, resolve genuine failures, respect environment protections, obtain the actual page_url, and verify it in a browser. The initial push created Actions run 35037722075; inspect its current status rather than treating a workflow file as proof of deployment.

## Validation

Run `npm run check`, `npm test`, `npm run test:balance`, `npm start`. No installation/build is needed. Only dist is deployed. The local browser suite has 70 base checks and 10 expansion checks; rendered Story victory, mobile layout evidence and measured battle performance are documented in QA.md. These do not imply physical iPhone, every browser engine, subjective audio verification, or extended human Commander balancing.

## Recommended next development work

After publication, expand directional walk/fire animations and perform physical iPhone Safari and hands-on Commander balance testing. There is no campaign, multiplayer, save system, or eight-direction character animation.
