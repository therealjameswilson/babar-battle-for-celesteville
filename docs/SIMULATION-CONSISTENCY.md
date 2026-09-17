# Simulation consistency — 0.35.0

Earlier releases recorded different long-match outcomes in Node and Chromium.
The first measured difference was only the last bit of a worker coordinate, but
crowding and combat amplified it. Live play also passed variable display-frame
intervals directly to the simulation, so refresh rate could change the sequence
of movement and combat steps.

## Changes

Movement now advances along normalized direction vectors rather than converting
a vector to an angle and back through trigonometry. Separation uses normalized
vectors too, with an explicit eight-direction fallback for coincident units.
Navigation approaches and enemy construction searches use fixed direction tables.
Simulation distances use square root of squared components consistently. Angles
remain available for drawing; they no longer determine movement displacement.
There is no coarse position snapping or change to the 30px navigation grid.

The live client now advances in **50ms simulation ticks**. Display frames add to
an accumulator; up to five ticks can catch up in one frame. Frame gaps above
250ms deliberately discard excess time to avoid an unbounded catch-up stall.
Pause, restart and group/council menu transitions clear the clock. Unit drawing
interpolates between the previous and current tick, while targeting and selection
continue to use authoritative simulation coordinates. Paused and ended matches
show exact frozen positions. The interpolation is presentation-only, with at most
one simulation tick of visual delay.

## Evidence

- Shared checks produce identical three-second state at 10, 30, 60 and 144 FPS
  and under a jittered frame sequence. They also cover accumulation, pause,
  restart, ended matches, invalid elapsed time and bounded stall recovery.
- `npm run test:clock` runs the same paid Commander doctrine opening at 30, 60
  and 144 display FPS. All recorded states and terminal results match exactly.
- Real Chromium 152 runs the same scenario through `advanceSimulation(1/60)`.
  All seven snapshots (1, 10, 30, 60, 120, 180, 240 seconds) and the complete final
  report equal Node's captured JSON. Both win at 282s, with the palace at 1,800.
  This is evidence for the tested runtimes/scenarios, not a promise of lockstep
  compatibility with every browser or a multiplayer implementation.
- In a 69-object representative battle, 120 active display frames took 2,000ms
  and advanced exactly 40 simulation ticks / two seconds. No time was clipped;
  maximum frame interval was 18.4ms. Draw mean/p95: 1.02/1.60ms; simulation plus
  interpolation-sample bookkeeping mean/p95 per display frame: 0.78/2.80ms.
  The measurement pauses afterward to preserve the reviewed battle state.

An initial performance sample included a delayed first browser frame: 4,649ms
elapsed with only 2.2s advanced after the catch-up cap. It is retained separately.
The active-frame measurement starts after one animation-frame warm-up and records
maximum frame gap and discarded time explicitly; it is not presented as the
initial sample. Older performance measurements manually advanced simulation in
addition to the live loop; the new fixture isolates one owner of simulation time.

Artifacts include vector-node-trace.json, vector-browser-trace.json,
clock-node-trace.json, clock-browser-trace.json, clock-performance.json (initial),
clock-performance-active.json and clock-battle-desktop.png under artifacts/.

## Balance consequences and regression correction

Small trajectory changes alter exact historical match results. Existing prices,
weapon damage, recruitment times and AI budgets are unchanged. All existing
balance, composition, Commander, raid, burst, doctrine, push and controlled
expansion comparisons were rerun.

The paid expansion comparison now records army-first victory at 364s, early-camp
loss at 380s and secured-camp victory at 330s. The early camp finishes at 120s, loses
its workforce, receives no cargo and is destroyed at 202s. The real browser
confirms the same early-loss and secured-victory reports, field for field. The secured camp receives 1,800 Supplies
against 600 of direct camp expenditure and finishes with fifteen workers.

The old test incorrectly required **every** expansion, including a losing one,
to receive income. It now permits zero income only for an observed loss with
workforce casualties. The protected-opening regression still requires victory,
real construction time, payment and receipts exceeding camp expenditure. The
shared cargo tests independently verify that completed camps correctly credit
physical deliveries. The early defensive-cost check and identical first-minute
comparison remain. Historical tables in EXPANSION-OPENINGS.md describe 0.34.0;
they are not silently rewritten as current exact timings.
