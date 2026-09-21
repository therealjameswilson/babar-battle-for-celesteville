# Rendering refinement — 0.45.0

Battlefield DPR now follows Retina displays up to 3×, bounded by an approximately
three-million-pixel surface budget (never below 1×). Small high-density phone
screens can display finer detail without forcing oversized desktop render targets.

crispSprite rasterizes each inspected atlas crop at a quarter-step physical scale,
with high-quality smoothing and restrained 1.06 contrast. Infantry, buildings and
commanders share a cache keyed by source/crop/output size. It retains at most about
12 MiB of RGBA surfaces, evicting least recently used entries. Original artwork,
alpha margins and irregular crop coordinates remain unchanged. No new generated
artwork is used. Zoom chooses a new cached resolution rather than permanently
magnifying a low-resolution copy.

The battlefield excludes offscreen units before sprite work and depth sorting.
A generous 180-world-unit margin retains tall sprites near the screen boundary.
Selected units remain eligible so artillery range indicators do not disappear.
The minimap and simulation still process the full world; fog rules are unchanged.
Existing fixed 20Hz simulation and interpolated movement remain intact.

Reproduce: serve the repository root and open tests/render-performance.html.
The fixture warms rendering, compares the same 133-unit scene with culling off
and on, and checks DPR, cache budget, viewport and selection behavior. On the
in-app browser at 390×844 / DPR2: 133 → 37 unit draws; median JavaScript draw time
0.6 → 0.3ms; p95 0.8 → 0.5ms. Warm cache: 736,002 pixels (~2.8 MiB).
These are CPU submission timings in a synthetic scene, not GPU timings or a
physical-device frame-rate guarantee. Future profiling should measure real iPhone
frame pacing during sustained combat and pinch zoom.
