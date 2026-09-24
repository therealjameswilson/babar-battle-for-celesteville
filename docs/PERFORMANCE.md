# Rendered battle performance baseline

2026-09-24, client 0.62.0, in-app Chromium preview on the connected Mac.
`tests/performance-browser.html` adds 60 units per side (infantry and artillery),
orders both formations toward each other, reveals the map, warms up 30 frames,
then samples 180 frames. It reports real RAF spacing and instrumented CPU durations.
This is a synthetic stress scene, not a full playthrough or physical iPhone test.

| Run | Frame median / p95 | Draw median / p95 | Simulation step median / p95 |
| --- | --- | --- | --- |
| Hidden preview | 150.1 / 183.2 ms | 1.2 / 1.6 ms | 1.8 / 3.7 ms |
| Visible preview | 134.3 / 165.4 ms | 1.1 / 1.5 ms | 2.0 / 4.3 ms |
| Visible with full-loop instrumentation | 133.6 / 165.0 ms | 1.2 / 1.6 ms | 2.1 / 4.1 ms |

The third run reported `document.visibilityState = visible`, a 964×617 battlefield,
109 surviving units, and 501 fixed simulation updates during the 180 measured frames.
Full frame-handler CPU duration was 7.1 ms median, 11.9 ms p95 and 15.0 ms maximum.
Total elapsed time including warm-up was 29.524 seconds.

These first runs were later found to be confounded by multiple temporary QA
game tabs still rendering. The observed 6–8 rendered frames per second is not
a valid isolated-client baseline. The much longer RAF gap
than measured handler work suggests scheduling/compositing or preview constraints,
but the cause has not been established. Do not claim 60 fps, a successful performance
optimization, or satisfactory physical-device play from these numbers. Next evidence
needed: a profiler trace that explains the gap and a physical browser/device sample.
The probe is retained so future optimizations can compare measured work and pacing.

## Controls and corrected single-preview sample

A `?render=off` control runs the same engine with battlefield drawing omitted.
Before closing other QA tabs it measured 100.1 ms median / 150.8 ms p95 frame
spacing, with 4.4 / 14.5 ms frame-handler cost. Rendering alone did not account
for the large callback gap. Eleven temporary QA previews were then closed.

The normal rendered probe with one remaining temporary preview reported:

- `visibilityState`: visible; battlefield 964×617; 144 surviving entities.
- 180 frame samples; 6.285 seconds including warm-up.
- Frame spacing: 16.7 ms median, 68.6 ms p95, 116.2 ms maximum.
- Full handler: 1.5 ms median, 9.3 ms p95, 17.4 ms maximum.
- Drawing: 1.3 ms median, 2.1 ms p95, 2.7 ms maximum.
- Simulation steps (81): 4.4 ms median, 7.1 ms p95, 7.6 ms maximum.

Median pacing now reaches 60 fps, but tail latency is still significant. This is
not proof of sustained smoothness or a physical-device result. Because sampling
is frame-count based, faster runs cover less simulated time and different battle
phases; comparisons must account for that. Next refine the probe to compare the
same simulated interval, record long-frame causes, and validate physical input.
Keep unrelated QA games closed during measurements. No production optimization
has been claimed from this investigation.
