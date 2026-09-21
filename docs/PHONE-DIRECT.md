# Direct phone play — 0.46.0

Window blur previously paused every running game, even while the page remained
visible. Safari touch/focus changes could therefore trigger a pause. Blur now only
clears held keyboard keys; document visibility remains the automatic-pause signal.
Leaving the app/tab pauses, and returning requires a deliberate resume. Manual
pause and intentionally paused council/help/group dialogs retain their behavior.
This fixes the identified trigger; physical-device reproduction is still needed.

Phone interaction:
- Tap a friendly unit to select it; tap clear ground to move, or an enemy to focus
  fire. Selection persists. Provisioners can tap resource sites to gather.
- Tap a friendly production building to open Build / train; tapping ground with
  it selected sets a rally. Production lists sites and opens the chosen site’s
  recruitment/research controls. These controls do not pause simulation.
- Two fingers pan/zoom without issuing orders. Drag selection still works.
- Army / move collapses the sheet. More orders exposes specialist commands and
  unit information. Menu contains pause/resume, sound, council and the manual.

Phone header shrinks from 96px to 48px and the default dock from 250px to 102px.
Landscape uses the full battlefield width instead of reserving a 270px side panel.
Build / train and More orders expand over the map only when requested. All core
buttons retain 44px touch targets, dynamic viewport sizing and safe-area padding.
Desktop mouse behavior and tactical rules are unchanged, apart from blur no longer
pausing; actual hiding still pauses on desktop too.

Browser tests: phone-direct.html checks visible blur, touch movement/focus/rally,
production/recruitment, page hiding and layout. phone-browser.html checks eight
sizes, target bounds, tabs, pinch/cancel, manual pause/resume and dialogs. Hidden
menu controls are intentionally excluded from visible-target size assertions.
