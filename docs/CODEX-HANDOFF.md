# Siege release handoff

## Verified local result

Version 0.3.0 continues the supplied prototype. Original imported baseline: `4109fb621b93a626fdb5cfcb1c04d8497ce66c5a`. It contains the unmodified archive content; commit author metadata was changed to the verified account’s GitHub noreply identity before any push.

The revised source adds clearance-aware A*, formations, two roads around forest obstacles, cover, scouts and artillery, suppression/retreat, a supply graph, paid repair, wounded recovery, paid commander returns, a capturable depot, enemy recruitment reserves, scouting/flanking/regroup decisions, grittier generated art and damage feedback, original synthesized audio, and a command-post interface. The 23-member roster remains intact. See QA.md for what was actually tested.

## Publication is blocked on account authorization

The connected GitHub integration identifies `therealjameswilson` (account ID 30484292). It exposes repository read/write operations but no repository creation or Pages configuration operation. The intended repository lookup returned 404 and it was absent from the accessible repository listing. A 404 alone cannot rule out a private repository outside the integration’s access.

There is currently **no verified repository URL, remote commit, Pages Actions run, or Pages URL** for this game. The local repository has no remote. No repository visibility was changed.

GitHub CLI was installed from the official cli/cli release into `~/.local/bin/gh`; it is not yet authenticated. Both browser/device authorization attempts expired without consent. Restart the official flow when the user is ready:

```
~/.local/bin/gh auth login --hostname github.com --git-protocol https --web
```

The user must perform the real GitHub sign-in/consent step as `therealjameswilson`. Never ask for a password or token in chat. Verify afterwards:

```
~/.local/bin/gh auth status --hostname github.com
~/.local/bin/gh api user --jq .login
```

## Resume publication after authorization

1. Recheck `therealjameswilson/babar-battle-for-celesteville` through the authenticated CLI. Inspect contents, visibility, default branch, permissions and guidance. Distinguish a true absence from a network/permission failure.
2. If an existing substantive repository is found, work on a feature branch and preserve its unrelated changes. Do not push this local history over it blindly.
3. If absent, create a dedicated **private** repository from this correctly initialized local project after verifying remotes. Push the validated commit without force. Verify the remote SHA.
4. Enable Actions-based Pages using an authorized operation, or ask the user for **Settings → Pages → GitHub Actions** if configuration is unavailable. GitHub Free only supports Pages from public repositories; private source requires a supported paid plan. Do not change visibility without an explicit account decision.
5. Watch the actual workflow through completion, respect any review/environment gate, fix failures, obtain the URL from GitHub, and load that URL in the real browser. Check assets under the project subpath. Only then report publication as complete.

## Validation commands

`npm run check`, `npm test`, `npm run test:balance`, `npm start`.

No npm installation or runtime dependencies. Node 20+ and Python 3 suffice. `dist/` is the only deployable client directory. The root-served browser harness, review screenshots, archives, credentials, `.git` directories and `.openai` metadata are not deployed.

## Next development task

After publication, expand directional walk/fire animations and conduct hands-on Commander balancing and physical iPhone Safari testing. Current mobile verification uses real browser iframe viewports and synthesized touch pointer events, not physical hardware. There is no campaign, multiplayer, save system, or full eight-direction character animation.

Official references: [GitHub CLI login](https://cli.github.com/manual/gh_auth_login), [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Follow-up: saved control groups and production rally points implemented; deterministic
and balance checks pass. Browser QA of these additions remains pending (see QA.md).
The most recent device-login session no longer exists and gh auth status still reports
unauthenticated. Do not reuse earlier device codes or claim GitHub publication.
Next RTS work: queued waypoint orders, touch-accessible control-group UI, production
queue cancellation, then broader tech progression and officer differentiation.

Further progress: cancellable recruitment with full refunds and four touch-accessible
control groups now implemented. New cancellation checks pass. Desktop preview
recovered; keyboard groups, modal assignment, queue cancellation and rally pennant
were tested through real UI. See latest QA section for remaining mobile checks.

0.4.0 adds queued move/attack/gather/repair orders and visual routes. Tests and desktop
UI verification pass; detailed evidence in QA.md. Next work remains mobile Groups/
Queue layout verification, fuller production progression and detailed officer roles.
GitHub publication is still pending authentication.
