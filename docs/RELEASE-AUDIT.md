# Release audit

This is an evidence map, not a claim that the complete project is published.

| Requirement | Current evidence / status |
| --- | --- |
| Preserve supplied prototype | Imported baseline commit 4109fb6; authored dist remains tracked |
| Static deployable client | Local scripts/assets; no runtime API, server or npm dependency |
| Gritty art and command UI | Local siege atlases, damage states, effects, command-post UI; screenshots in artifacts |
| Core RTS economy | Physical gathering/delivery, worker construction, recruitment queues, population, repairs |
| Tactical movement and commands | 30px A*, obstacle clearance, formations, move/attack/focus/hold/retreat, queued waypoints and control groups |
| Tactical map and supply | Two roads, contested depot, cover, disruptible supply links and finite enemy reserves |
| Army differentiation | Guards, scouts, artillery and commanders have distinct numerical roles |
| Character depth | 23-entry crossover roster retained; all support effects checked; distinct Babar/Rataxes active abilities and Cornelius doctrine |
| Progression | Optional infantry/artillery research occupies producers and uses supplies |
| Enemy behavior | Scouting, assaults, flanks, retreats; visibility-gated acquisition and active command |
| Desktop/browser playability | 70 original browser assertions plus 10 expansion assertions; direct UI checks and rendered Story victory |
| Mobile layouts | 390×844 and 844×390 real browser frames; groups, queues, cancellation; portrait Babar activation and footer clearance |
| Win/loss/restart | Rendered Story victory 02:44 on worker-construction release; earlier loss/restart check; deterministic balance win 155.05s |
| Performance | Current combat fixture ~60Hz, update mean .624ms, draw mean .538ms; scope in QA.md |
| Audio/accessibility | Interaction-started synthesized sound, persisted mute, reduced-motion code; no subjective audio or physical iPhone validation |
| Documentation/tests | README, architecture, character continuity, art provenance, run commands and QA records updated |
| GitHub repository/account | BLOCKED: CLI unauthenticated; no remote, repository creation or push verified |
| GitHub Pages | BLOCKED: workflow exists but no Pages configuration, Actions run or published URL verified |

Known limits: two-way character facing with headings/gun rotation; no physical
Safari/iPhone QA; reduced-motion setting not toggled in browser; intermittent
unlocated MutationObserver errors in QA iframe wrapper; extended Commander human
balance and research-aware strategy comparisons remain future validation work.
No additional named relatives were introduced. All wartime powers are inventions.

Publication requires successful GitHub CLI consent, account verification as
therealjameswilson, authoritative repository lookup, and permission/plan inspection.
Create a new repository privately only if absent and supported. Ask before any
public-source visibility change. Then push, enable Pages, watch the workflow to
completion and verify the actual returned deployment URL. None may be inferred
from the workflow file or local tests.
