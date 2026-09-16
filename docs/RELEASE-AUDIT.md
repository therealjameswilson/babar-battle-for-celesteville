# Historical release audit (0.7)

This records the initial siege release, not the latest client. Current mechanics
and evidence are tracked in [STARCRAFT-GOAL.md](STARCRAFT-GOAL.md),
[QA.md](QA.md) and [ARCHITECTURE.md](ARCHITECTURE.md).

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
| GitHub repository/account | VERIFIED: CLI therealjameswilson; repository created, made public with user approval; main pushed and initial remote SHA confirmed |
| GitHub Pages | VERIFIED: Actions run 35037872195 succeeded; public page played in browser; all 13 public client files match local source |

Known limits: two-way character facing with headings/gun rotation; no physical
Safari/iPhone QA; reduced-motion setting not toggled in browser; intermittent
unlocated MutationObserver errors in QA iframe wrapper; extended Commander human
balance and research-aware strategy comparisons remain future validation work.
No additional named relatives were introduced. All wartime powers are inventions.

The user approved public visibility. GitHub accepted the change and Pages setup,
returning https://therealjameswilson.github.io/babar-battle-for-celesteville/.
Actions run 35037872195 completed successfully. The public page and deployed assets
were verified; documentation-only follow-up pushes use the same checked workflow.
