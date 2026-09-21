# Two crowns. One border. — 0.42.0

The opening uses three original wartime dispatches: Basil and Rataxes issue an
ultimatum; Cornelius and Babar prepare a defense while Celeste protects civilians;
the final scene hands the rivalry to the player. Dialogue is invented for this
game, not quotations or canonical events from the books.

`opening.js` creates a native modal with the existing cropped Babar/Rataxes art,
new landscape, text, progress markers and explicit playback controls. Each of
three scenes lasts eight seconds. Pause/visibility loss clears timers and stops
score voices. Skip, Escape and natural completion return to the mission briefing;
Take command is still required to start simulation. The start handler also closes
the modal defensively. Reduced motion disables drift and timed advancement.
Watch opening on the briefing reopens it paused. All text is visible immediately,
without typewriter effects. Shared mute preference is preserved.

The short score is original Web Audio synthesis: low C/G tones and three short
bass pulses per scene. AudioContext is created/resumed only after a user action.
Mute gates the score bus immediately; closing disconnects it and stops voices.
No voice actors, external samples, remote services or autoplay video are used.

## Original artwork

Final asset: `dist/assets/opening-border.png`, generated using the built-in image
tool and copied unchanged from its generated output. Existing character sheets
are reused with their inspected SVG crops.

Generation prompt:

> Use case: historical-scene. Asset type: wide cinematic background for the opening of Babar: The Siege of Celesteville, a military-fable strategy fan game. Original illustrated matte painting: a once-peaceful French-inspired elephant kingdom at the edge of a great forest, small distant cream-stone palace with green copper domes on the LEFT horizon, threatening fortified burgundy-bannered rhino citadel far on the RIGHT horizon, a muddy empty road between them, abandoned field barricades in the foreground, dark pine silhouettes, low drifting smoke under storm clouds, a restrained ember-red break of dawn. Late nineteenth-century military storybook aesthetic, crisp etched contours and textured gouache, sophisticated charcoal, olive, muted brass and burgundy palette. Wide 1536x1024 composition suitable for cropping to wide and portrait screens. Keep center mostly dark smoky negative space for readable text overlays. No text, no lettering, no characters, no logos, no gore, no modern vehicles, no bright orange explosion. A grave and dramatic sense of two rival kingdoms approaching war.

Browser fixture: `tests/opening-browser.html`. Physical Safari, speaker listening,
and full-page screenshot review remain unverified due to preview limitations.
