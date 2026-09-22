# Mushroom-cloud artwork — 0.49.0

Both payloads now create recognizable stem/cap/ground-dust clouds rather than the
generic casualty burst. Atomic uses a compact brown-gray rounded cap; H-bomb uses
a larger, taller pale cap, broader billowing head and condensation collar. Shapes
are representative lower-/higher-energy visual profiles, not reliable identifiers
of fission versus fusion. Both kinds can form mushroom clouds. Color, dimensions
and condensation depend on burst environment, entrained material and weather.

Reference: Glasstone and Dolan, *The Effects of Nuclear Weapons*, Chapter II,
sections 2.13–2.17 and 2.48–2.50, published by US DOD/DOE (1977), accessible at
https://www.atomicarchive.com/resources/documents/effects/glasstone-dolan/chapter2.html
The reference describes lateral spreading, atmospheric dependence and transient
condensation. The pale collar is illustrative of suitable humid conditions; it is
not exclusive to thermonuclear blasts. No real weapon dimensions or timing are
simulated. Display lifetimes compress cloud development to 8 / 12 game seconds.

New artwork: dist/assets/mushroom-clouds.png, generated with the built-in image
model for this project on 2026-09-21. Original transparent 1536×1024 RGBA output,
no third-party photograph embedded. Prompt requested isolated lower-/higher-energy
clouds with crisp billowing contours and neutral dust tones. Source generated file:
exec-248b956b-a353-4743-905a-f751d208867e.png. Final asset is stored in the repository.
Inspected irregular crops: atomic [16,440,620,530], hydrogen [640,64,880,910].
Both keep visible alpha (>32) away from crop edges; negligible peripheral alpha
noise is outside the intentional crops. No image resampling or alpha removal was
performed. Source imagery was visually inspected before integration.

mushroom-clouds.js owns only visual profiles, poses and Canvas drawing. atomic.js
creates a typed effect at impact; damage, radius and counterplay are unchanged.
Normal animation grows the stem/cap over 2.2 / 3.5 seconds and fades at the end,
with softly fading dust at ground level. Reduced-motion mode holds full shape,
omits the brief local warm glow and only fades. No full-screen flash, camera shake,
new sound or persistent radiation effect is added. Art does not reveal fogged units.
A simple mushroom silhouette is available while the local atlas loads.

Validation: decoded PNG bounds/transparency, type/lifetime/pose checks, existing
full simulation suite, and 39 real-browser checks at three phone/desktop sizes.
The browser fixture renders both clouds side-by-side for visual review. These are
illustrated game effects, not a calibrated physical or meteorological simulation.
