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
