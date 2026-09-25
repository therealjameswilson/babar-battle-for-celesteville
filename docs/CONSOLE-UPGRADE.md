# Console-quality upgrade

Active user objective: an upgrade that feels, sounds, and plays like a Nintendo
Switch 2 game. This is a quality and interaction goal for the existing browser
RTS, retaining its mouse/touch support, authored static client and full roster.

Completion requires the complete experience below, not merely individual features.

| Area | Required result | Evidence needed |
| --- | --- | --- |
| Presentation | Cohesive title/briefing, legible command HUD, polished transitions, readable battlefield silhouettes, lighting, combat feedback and result screen | Desktop and phone screenshots, rendered battle inspection |
| Controls | Controller-first navigation and battlefield commands, contextual prompts, reliable mouse/touch switching, no selection traps | Real browser input tests plus physical controller playtest where available |
| Sound | Original layered adaptive score, distinct spatial battlefield effects, responsive UI sounds, separate persistent levels, safe pause/background behavior | Web Audio lifecycle tests, listening review, battle mix inspection |
| Play | Clear first-play guidance, readable objectives/tech progression, responsive formations and production, satisfying complete skirmish | Manual Story and Commander sessions, victories/losses, tactical regression suite |
| Continuity | Resume a skirmish, accessible settings, clear restart/quit flow, robust reload behavior | Save/load roundtrip and browser reload tests |
| Performance | Smooth frame pacing and responsive input in representative battles on desktop and phone-sized layouts, restrained effects with reduced motion | Measured frame/input timings, real browser evidence; distinguish physical hardware from emulation |
| Release | Complete authored source and local assets, documented provenance, successful deployment, verified live game | CI, remote commit and live assets, final requirement-by-requirement audit |

Work order: audio foundation; controller/input layer; visual/HUD and front-end
redesign; save/resume and first-play guidance; integrated battle polish and measured
performance; complete playtests and publication. Iterate across areas as evidence
requires. Do not mark the goal complete on the strength of unit tests alone.

## Current evidence

- Starting release: 0.59.5. Static Canvas engine, 33 characters, complete RTS and
  nuclear progression, existing responsive UI and deterministic strategy suites.
- Prior manual Story victories are useful baseline evidence, not verification of
  this upgrade. Physical iPhone Safari and controller experience remain unverified.
- Audio foundation ships in 0.60.0. Browser graph/controls checks pass;
  hardware listening review remains open. Other acceptance areas remain open.

- Controller foundation (0.61.0): dual-stick battlefield input, production and
  menu navigation, focus outlines, prompts, input handoff and disconnect pause.
  Browser-standard samples pass; physical controller feel remains unverified.
  Presentation redesign, onboarding, save/resume and integrated polish remain open.

- Presentation foundation (0.62.0): illustrated responsive briefing, command
  categories, restyled desktop command surface, pause card and after-action report.
  Three-layout browser QA passes; full battlefield visual/game-feel upgrade remains
  open alongside save/resume, onboarding and integrated performance/playtests.

- Continuity release (0.63.0): local versioned checkpoints, paused Continue,
  autosave, save-and-briefing and result retry with backup recovery. Engine and
  browser reload/storage coverage added. Published successfully, with checkpoint
  compatibility verified on the live 0.64.0 release.

- First-play guidance release (0.64.0): optional live field adviser with six
  observed milestones, normal selection/placement shortcuts, recovery advice and
  checkpointed progress. Desktop and phone-size browser checks cover its core
  flow. PR #9 merged; main checks and Pages deployment succeeded for ca17aa1.
- Integrated manual Story play on published 0.64.0: victory in 06:19, three waves,
  56 enemy losses, 40 surviving units; ordinary browser controls without simulation
  shortcuts. QA.md records minimap overlap, misleading resource-order feedback and
  whole-army munitions affordability as follow-up issues. Manual Commander play,
  broader battlefield polish, measured frame pacing and hardware verification
  remain open. The broader objective is not complete.

- 0.64.1 resolved the three command issues from manual Story play; 98 browser
  assertions cover feedback, mobile production selection and command layout.
- 0.65.0 book-reference presentation is published: principal figures, buildings,
  portraits, terrain, interface and cover now use ink/watercolor styling. 155
  browser fixture checks passed. Secondary portraits and specialist vehicles
  remain to be reconciled with the artwork (BOOK-AESTHETIC.md).
- 0.65.1 published: fixed-interval battle profiling and measured nearest-lookup
  CPU reduction with identical outcomes. This does not establish sustained frame
  pacing. Manual Commander play, hardware audio/controller/iPhone verification,
  and remaining art/animation polish are still open; the objective remains active.

- 0.66.0 published: book-style infantry now has four directional views and two
  distance-driven strides, shot-facing recoil, a stable reduced-motion pose and
  image-loading fallbacks. The remaining commanders/workers still use the book
  profile treatment; secondary portraits and specialist art are not yet complete.
- 0.67.0 published: both leaders now have matching book-style idle, paired stride
  and firing poses in four directions, with measured feet/muzzle anchors and the
  existing reduced-motion/cadence behavior. Manual Commander verification was
  retried but browser clicks timed out before Start; interactive play remains open.

- 0.68.0 published: directional book provisioners distinguish empty-handed travel
  from actual carried cargo, with readable S/M/U badges. Browser checks include a
  physical pickup/delivery transition. Worker art is now coherent with infantry
  and leaders; support portraits, specialist vehicles and integrated play remain.

- 0.69.0 published: an illustrated open supply yard, accurate capture ring and
  separate ownership/income card replace the overlapping depot placeholder.
  Resource work labels gain contrast and uranium names its correct prerequisite.
  102 browser fixture assertions cover three layouts; broader acceptance remains
  open, including manual Commander play, sustained frame pacing and hardware QA.

- 0.70.0 published: the quarry, field headquarters, shelter, launcher, missile
  defense and trench now share the book style, including fog-memory silhouettes.
  Damage/construction overlays and faction identifiers remain readable. 189
  authored browser assertions cover three layouts. A fresh manual Commander Start
  attempt still timed out and screenshot capture failed; the broader goal remains
  active, with input/frame pacing, hardware audio/controller and secondary art open.

- 0.71.0 published: complete directional Old Lady and Arthur/motorbike sprites
  replace the mirrored profile and portrait collage. The flame plume originates
  at measured nozzles and converges on the struck target; damage rules are retained.
  Secondary roster portraits, gun-crew animation and the integrated manual/hardware
  acceptance gates remain open.

- 0.72.0 published: all 33 council/gallery figures now share the book presentation,
  including the remaining 25 portraits/full figures and matching download links.
  807 browser fixture assertions pass across three layouts. Gun-crew animation,
  manual Commander victory, sustained frame pacing and physical device/audio/
  controller acceptance remain open; the full objective is not complete.

- 0.73.0 published: integrated directional gun-and-crew art replaces the old
  officer/geometric cannon combination, with paired strides, deployed trails and
  muzzle-anchored flash/recoil/shell effects. Both factions retain existing combat
  and transition rules. The main unit/structure/roster art reconciliation is now
  implemented. Integrated manual Commander, sustained frame pacing, listening and
  physical iPhone/controller acceptance still require evidence; goal remains open.

## Integrated acceptance audit — 2026-09-24, 0.73.0

Scope is still the entire quality/interaction objective above. Source inspected:
merged `a4651dbf25db0529e4c4bb065a8b5f2fae95437b`. The preceding goal turn made
implementation progress (gun art, actual-shot fixtures and merged PR #20).

| Requirement | Evidence inspected | Current assessment / next proof |
| --- | --- | --- |
| Cohesive presentation | Current `book-*` helpers/assets, `presentation.*`, complete roster resolver, 0.65–0.73 rendered Canvas boards and browser layouts | Main art reconciliation implemented. Latest full-page/in-motion review remains unavailable; static boards alone do not prove integrated feel. |
| Mouse/touch/controller interaction | `selection.js`, `mobile.js`, `controller.js`; 0.61 synthetic standard-pad checks, 0.64.1/0.59.5 production regressions; current Start retry | Existing command coverage; current ordinary input blocked before match start. Physical controller and iPhone remain unverified. |
| Sound | `audio.js` four buses/limiter, adaptive original procedural score, spatial effects, gesture/mute/pause lifecycle; real Web Audio fixture | Graph/offline evidence only. Audible battle mix, device-clock voice expiry and physical listening still need review. |
| Complete play | Manual 0.64 Story victory at 06:19; current tactical/strategy CI; actual-shot artillery fixture | Current Commander ordinary-input victory missing. Scripted matches and injected fixture shots are not substitutes. |
| Continuity | `checkpoint-state.js`/`checkpoint-ui.js`, `CHECKPOINTS.md`, browser reload/paused Continue checks | Implemented, with existing roundtrip/backup evidence. Must include save/resume in the final integrated match. |
| Performance | `simulation-clock.js`, culling/cache code, nearest paired CPU results, current RAF probe | Narrow CPU evidence only. Current probe stayed at t=0 with no loop/update/draw calls despite running/visible state; no new FPS or input-latency claim. |
| Release | PR #20 merged; main run 36090026150 completed successfully; live index, game/render/book-art/book-guns scripts and both gun atlases byte-match a4651db | Verified publication of 0.73.0. This does not close interactive or hardware gates. |

Environment revalidation: closed 14 obsolete version previews after their DOM
showed untouched 00:00 briefing screens. Preserved tabs containing started or
completed matches. A fresh 0.73 Commander selector changed normally; semantic Start
click timed out, briefing stayed visible and clock remained 00:00. Screenshot
capture failed. The existing fixed-interval RAF probe loaded the 0.73 scripts but
two observations remained t=0, running=true, paused=false, visibility=visible,
calls={}. A separate foreground-visible attempt using native Start input also
returned an Input.dispatchMouseEvent timeout; no match began. Temporary audit
pages were closed and browser visibility restored. This rules out the tested
idle-tab cleanup and foreground setting as sufficient recovery, without claiming
the root cause is known.

The Mac/browser session must become usable for ordinary input and RAF timing before
those gates can be completed. The pending request to wake/unlock the Mac and reopen
Codex's browser remains relevant. Physical iPhone/controller access and listening
review are separate evidence gaps. No completed work is discarded; the objective
is not complete. No new gameplay rule or speculative performance change was made
in response to the tooling failures.
