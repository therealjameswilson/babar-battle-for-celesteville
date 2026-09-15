# QA record — Siege 0.3.0

## Automated simulation

The original imported source passed its syntax checks and deterministic smoke harness before modification. Node/npm were initially absent from PATH; the bundled Node runtime and a temporary official npm CLI were used. No project dependencies were installed.

Final `npm run check`, `npm test`, and `npm run test:balance` passed. The checks cover syntax; RGBA atlas dimensions; roster integrity; all support powers and their numerical effects; construction, collection/delivery, recruitment and population; cover; suppression, hold and retreat; obstacle and building routing; disrupted and restored supply; isolated queues; paid repair and commander returns; depot capture and enemy budget disruption; fog acquisition; cooldowns; and end states.

The final deterministic Story strategy reached victory at 131.65 simulation seconds using only the original starting economy, earned supplies, and normal player commands. The balance script asserts victory. It does not grant an army, supplies, or damage the enemy fortress through a test override.

## Real browser

Tested in the Codex in-app Chromium browser. The local-only browser harness uses the actual game document, loaded images, native dialogs, CanvasRenderingContext2D, localStorage and PointerEvent handlers. Its final run passed **70 checks**. This is distinct from the Node mock-Canvas harness.

- Native start, pause/resume, council open/close with pause restoration, cost/status updates, all 18 player support activations and repeat-purchase protection.
- Actual rendering and image loading; physical collection and delivery; scout recruitment; building construction; repair; depot capture; supply disruption/restoration; zoom, pan, mute and persistence.
- Synthesized touch pointers exercised selection, explicit move, drag-to-pan, and visible-enemy focus-fire; computed `touch-action: none` verified. Direct mouse use exercised drag selection, right-click movement, A attack-move and S hold.
- The accelerated Story strategy was played with visible rendering and reached victory at 2:18 in the final run; unattended play reached loss at 2:57 in an earlier run. The loss’s Deploy again button returned to the briefing. Representative screenshots were saved locally.
- Portrait **390 × 844** and landscape **844 × 390** used real iframe viewports because the browser’s advertised viewport override did not change the effective viewport. Body/client/scroll dimensions were inspected. Portrait body and scroll bounds both measured 390 × 844. Final landscape body and scroll bounds both measured 844 × 390, after correcting a three-pixel footer overflow. Council tabs and support activation were checked in the portrait layout. The landscape layout was revised to expose launch and field orders without sidebar scrolling.
- Desktop **1280 × 720** was inspected with the actual game. The sidebar was compacted to keep all field orders visible.

A native-dialog close assertion initially ran before the asynchronous `close` event. The browser test was fixed to await the lifecycle; game pause restoration then passed. The browser harness also surfaced an injected MutationObserver error without a game source URL during iframe navigation; no project code uses MutationObserver. It is not reported as a clean browser log. No missing game assets or game-source exceptions were observed in the successful checks.

## Performance

The real-browser fixture begins with 60 combatants plus the map buildings. Measurement includes 120 rendered frames and timed draw/update calls; it is not a whole-device GPU profiler. Both runs covered about two seconds (approximately 60 Hz).

| Measurement | Before caching | After caching |
|---|---:|---:|
| Mean simulation update | 2.60 ms | 0.75 ms |
| 95th percentile update | 4.30 ms | 1.10 ms |
| Mean draw call | 0.34 ms | 0.51 ms |
| 95th percentile draw | 0.50 ms | 0.70 ms |

Repeated visibility and static-collision scans were the measured CPU cost. Per-step caches reduced mean update time by about 71%. The slight draw variation is within this short fixture’s measurement scope; no faster rendering claim is made. Input remained responsive during the battle.

## Art and evidence

Final military character and building sheets were visually inspected and corrected with padded variants. Both are local 1254 × 1254 RGBA PNGs. The custom, irregular atlas boundaries remain explicit in render.js. Generated checkerboard-backed variants were rejected. Units use mirrored facing and bearing indicators; artillery carriages rotate. Damage overlays include cracks, breach states and restrained smoke. There is no camera shake.

Local review artifacts live in ignored `artifacts/`, outside `dist/`: desktop and mobile screenshots, Story victory/loss, browser-checks.txt, and performance-after.json. These are not uploaded by the Pages workflow.

## Limits

No physical iPhone/Safari or other browser-engine testing has been performed. Touch pointer tests are synthetic. Reduced-motion behavior was implemented and code-reviewed, but the browser preference could not be toggled through the available test API. Audio startup/mute/storage paths were exercised; no subjective listening assessment is claimed. Commander rules have automated checks but still need extended human balancing. Multi-direction animation remains limited to two-way facing plus heading/gun rotation.

GitHub creation, remote push verification, Actions deployment and the final hosted-page smoke test remain **blocked by CLI authorization**, not passed or omitted. See CODEX-HANDOFF.md.

## Control-group and rally-point follow-up

Engine checks, tactical tests, and earned-resource Story victory balance checks pass.
New deterministic assertions cover group recall, append, dead-member exclusion,
restart clearing, resource rallies and ground rallies overriding automatic gathering.
These additions are NOT yet browser verified: the previous preview server had stopped;
a replacement server was started, but the browser navigation tool rejected the
existing connection-error document. Earlier browser evidence above predates these
controls. Native computer access also reported the Mac locked. Resume direct keyboard,
touch rally and visual pennant checks when preview access is restored.

## Production management and groups browser follow-up

Preview access recovered by opening a fresh tab after confirming HTTP 200 from the
restarted server. Real browser input verified Ctrl+1 assignment and 1 recall after
F2 changed selection; recruitment displayed its cancellation/refund button and
cancelling removed the queue and released population. The Groups modal opened,
assigned the palace to group 2, closed, and returned to running command. Right-click
on ground produced the dashed rally line and pennant (artifacts/rally-and-groups.png).
Desktop 1280×720 controls visually fit; browser warning/error log was empty.
These observations supersede the earlier blanket pending status for desktop controls.
New Groups dialog and queue overflow still need portrait/landscape checks. Touch
hardware, group recall via modal, and recruit arrival at the rally remain pending
browser checks (rally behavior is covered by deterministic assertions).

Deterministic cancellation tests verify exact refunds, preserved active progress
when cancelling a waiting recruit, reset progress when cancelling the active recruit,
and no duplicate refunds from an invalid repeated cancellation.

## Queued orders (0.4.0)

Deterministic checks cover two-waypoint completion, preservation of the first order,
clearing routes on Hold/Retreat, and advancing from gathering after delivery. Updated
Story balance bot wins at 133.65 simulated seconds. Versioned script URLs fix an
observed browser cache mismatch where new HTML had loaded older game logic.
After that fix, real browser clicks selected Babar, issued a ground move, enabled
Queue, and appended a second ground move; live status showed `move · 1 queued` and
Queue pressed. Six seconds later the queue was consumed and the second move active.
Captured artifacts/queued-route.png. Mobile layout checks remain outstanding.
