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

The observed 6–8 rendered frames per second is not smooth. The much longer RAF gap
than measured handler work suggests scheduling/compositing or preview constraints,
but the cause has not been established. Do not claim 60 fps, a successful performance
optimization, or satisfactory physical-device play from these numbers. Next evidence
needed: a profiler trace that explains the gap and a physical browser/device sample.
The probe is retained so future optimizations can compare measured work and pacing.
