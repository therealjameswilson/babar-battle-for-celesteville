/* Phone presentation and two-finger navigation; simulation rules stay unchanged. */
(() => {
  const aside = document.querySelector('aside');
  const tabs = document.createElement('nav');
  tabs.id = 'phone-tabs';
  tabs.setAttribute('aria-label', 'Command panel');
  for (const [key, label] of [['orders','Orders'],['actions','Build / skills'],['status','Unit status']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.dataset.panel = key;
    button.onclick = () => {
      aside.dataset.panel = key;
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    };
    tabs.append(button);
  }
  aside.prepend(tabs);
  tabs.firstElementChild.click();
  const restart = document.createElement('button');
  restart.id = 'phone-restart';
  restart.textContent = 'Restart mission';
  restart.onclick = () => $('restart').click();
  $('help-dialog').append(restart);
  const touches = new Map();
  let gesture = null, navigating = false;
  function sample() {
    const [a,b] = [...touches.values()];
    return {x:(a.x+b.x)/2, y:(a.y+b.y)/2, distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};
  }
  function intercept(e) { e.preventDefault(); e.stopImmediatePropagation(); }
  canvas.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    touches.set(e.pointerId,eventPoint(e));
    if (touches.size >= 2) {
      try {canvas.setPointerCapture(e.pointerId);} catch {}
      navigating = true; down = null; gesture = sample(); intercept(e);
    }
  },true);
  canvas.addEventListener('pointermove', e => {
    if (!touches.has(e.pointerId)) return;
    touches.set(e.pointerId,eventPoint(e));
    if (!navigating) return;
    intercept(e);
    if (touches.size < 2) return;
    const next = sample(), anchor = world(gesture);
    cam.zoom = clamp(cam.zoom * next.distance / gesture.distance,0.45,1.8);
    const shifted = world(next);
    cam.x += anchor.x-shifted.x; cam.y += anchor.y-shifted.y;
    gesture = next;
  },true);
  function finish(e) {
    if (!touches.has(e.pointerId)) return;
    touches.delete(e.pointerId);
    if (navigating) {intercept(e);down=null;}
    if (touches.size >= 2) gesture = sample();
    if (!touches.size) {navigating=false;gesture=null;}
  }
  canvas.addEventListener('pointerup',finish,true);
  canvas.addEventListener('pointercancel',finish,true);
  canvas.addEventListener('lostpointercapture',finish,true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    touches.clear(); gesture=null; navigating=false; down=null;
    if (running && !paused && !ended) togglePause();
  });
})();
