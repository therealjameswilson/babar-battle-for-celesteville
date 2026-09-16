'use strict';
const spriteSheet = new Image(),
  buildingSheet = new Image(), infantrySheet = new Image();
spriteSheet.src = 'assets/characters-siege.png';
buildingSheet.src = 'assets/buildings-siege.png';
infantrySheet.src = 'assets/infantry-directions.png';
// Hand-inspected alpha bounds plus transparent margins: generated columns are irregular.
const infantryFrames = [
  [[38,142,290,501],[339,142,302,498],[643,142,280,500],[935,138,293,503]],
  [[23,702,309,461],[336,701,298,461],[636,705,291,457],[938,701,299,461]]
];
function infantryDirection(angle) {return ((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;}
function drawDirectionalInfantry(u,bob) {
  if(!['trooper','scout','sapper'].includes(u.type)||!infantrySheet.complete||!infantrySheet.naturalWidth)return false;
  const [x,y,w,h]=infantryFrames[u.team][infantryDirection(u.angle)];
  const height=52,width=height*w/h;
  ctx.drawImage(infantrySheet,x,y,w,h,-width/2,15-height+bob,width,height);
  return true;
}
const fog = document.createElement('canvas'),
  fc = fog.getContext('2d');
const terrain = [];
let seed = 13;
function seeded() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
for (let i = 0; i < 850; i++)
  terrain.push({ x: seeded() * W, y: seeded() * H, r: seeded() * 5 + 1, c: seeded() });
function poly(points, fill, stroke) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
function atlas(image, col, row, x, y, w, h, building = false) {
  if (!image.complete || !image.naturalWidth) return false;
  const xs = building ? [0, 326, 632, 982, 1254] : [0, 335, 635, 935, 1254];
  const ys = building ? [0, 610, 1254] : [70, 642, 1210];
  const scale = image.naturalWidth / 1254;
  ctx.drawImage(
    image,
    xs[col] * scale,
    ys[row] * scale,
    (xs[col + 1] - xs[col]) * scale,
    (ys[row + 1] - ys[row]) * scale,
    x,
    y,
    w,
    h
  );
  return true;
}
function drawUnit(u) {
  if (u.type === 'walker' && selected.includes(u)) {
    ctx.save(); ctx.setLineDash([7, 7]); ctx.lineWidth = 1;
    ctx.strokeStyle = '#d5c48c80'; ctx.beginPath();
    ctx.arc(u.x, u.y, weaponRange(u), 0, Math.PI * 2); ctx.stroke();
    if (u.deployed) { ctx.strokeStyle = '#d8796980'; ctx.beginPath(); ctx.arc(u.x, u.y, SIEGE.minimum, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  if ((u.disciplineUntil || 0) > t || (u.advanceUntil || 0) > t) {
    ctx.strokeStyle = (u.disciplineUntil || 0) > t ? '#dbc889' : '#d67d73';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(u.x, u.y + 4, u.r + 9, (u.r + 9) * .5, 0, 0, Math.PI * 2); ctx.stroke();
  }
  const d = defs[u.type],
    color = u.team ? RED : BLUE;
  ctx.save();
  ctx.translate(u.x, u.y);
  ctx.globalAlpha = u.construction ? 0.65 : 1;
  ctx.fillStyle = '#1e321e33';
  ctx.beginPath();
  ctx.ellipse(0, 6, u.r * 1.25, u.r * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = selected.includes(u) ? 3 : 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 3, u.r + 5, (u.r + 5) * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (selected.includes(u)) {
    ctx.fillStyle = '#d7edc827';
    ctx.fill();
  }
  if (d.speed) {
    const height = u.type === 'hero' ? 80 : u.type === 'walker' ? 73 : 59,
      width = height * 0.61;
    const bob = !reducedMotion && u.movingUntil > t ? Math.sin(t * 9 + u.id) * 1.1 : 0;
    ctx.save();
    const directional=drawDirectionalInfantry(u,bob);
    if (!directional) {
      if (Math.cos(u.angle) < 0) ctx.scale(-1, 1);
      const col = { hero: 0, worker: 1, trooper: 2, walker: 3, scout: 2, sapper: 2 }[u.type];
      if (!atlas(spriteSheet, col, u.team, -width / 2, -height + 15 + bob, width, height)) {
        ctx.fillStyle = color;
        ctx.fillRect(-10, -30,20,32);
      }
    }
    if (u.type === 'sapper') {
      // Reuse the faction infantry atlas, adding a distinct brass demolition pack.
      ctx.fillStyle='#333a36';ctx.fillRect(-17,-23,12,16);
      ctx.strokeStyle='#ddbc71';ctx.lineWidth=2;ctx.strokeRect(-17,-23,12,16);
      ctx.beginPath();ctx.moveTo(-15,-20);ctx.lineTo(-7,-10);ctx.moveTo(-7,-20);ctx.lineTo(-15,-10);ctx.stroke();
    }
    ctx.restore();
    // Direction indicator and physical field gun rotate with the firing bearing.
    ctx.save();
    ctx.rotate(u.angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(u.r + 3, 0);
    ctx.lineTo(u.r + 10, 0);
    ctx.stroke();
    if (u.type === 'walker') {
      if (artilleryLocked(u)) {
        ctx.strokeStyle = '#b7a783'; ctx.lineWidth = 5;
        for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-6, sign * 7); ctx.lineTo(-25, sign * 26); ctx.stroke(); }
        ctx.fillStyle = '#494638'; ctx.fillRect(-30, -30, 12, 8); ctx.fillRect(-30, 22, 12, 8);
      }
      ctx.fillStyle = '#252c29';
      ctx.fillRect(-8, -9, 30, 18);
      ctx.fillStyle = '#736c51';
      ctx.fillRect(0, -4, 38, 8);
      ctx.fillStyle = '#171c19';
      ctx.fillRect(-6, -14, 13, 5);
      ctx.fillRect(-6, 9, 13, 5);
    }
    if (t - (u.firedAt ?? -10) < 0.12) {
      ctx.fillStyle = '#e4c47e';
      ctx.beginPath();
      ctx.arc(u.type === 'walker' ? 40 : 24, 0, u.type === 'walker' ? 7 : 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (u.movingUntil > t && !reducedMotion) {
      ctx.fillStyle = '#b29c6925';
      ctx.beginPath();
      ctx.ellipse(-Math.cos(u.angle) * 18, 8, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (u.type === 'walker' && artilleryLocked(u)) {
      ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#eee3bd'; ctx.strokeStyle = '#202b25'; ctx.lineWidth = 3;
      const label = u.artilleryTransition ? (u.artilleryTransition.deploy ? 'DEPLOY ' : 'PACK ') + Math.ceil(u.artilleryTransition.until - t) + 's' : 'SIEGE';
      ctx.strokeText(label, 0, -72); ctx.fillText(label, 0, -72); ctx.textAlign = 'left';
    }
    if (u.type === 'scout') {
      ctx.strokeStyle = '#dfd6ad';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -55);
      ctx.lineTo(5, -55);
      ctx.stroke();
    }
    if (u.type === 'worker' && u.carrying) {
      ctx.fillStyle = u.cargoKind === 'materials' ? '#97b4bb' : '#ac9062';
      ctx.fillRect(12, -27, 10, 8);
      ctx.strokeStyle = '#332f25';
      ctx.strokeRect(12, -27, 10, 8);
    }
    if (u.type === 'hero') {
      ctx.fillStyle = '#fff6d6';
      ctx.strokeStyle = '#20392b';
      ctx.lineWidth = 3;
      ctx.font = 'bold 12px Georgia';
      ctx.textAlign = 'center';
      ctx.strokeText(u.name, 0, -height - 7);
      ctx.fillText(u.name, 0, -height - 7);
      ctx.textAlign = 'left';
    }
  } else {
    const col =
      u.type === 'turret'
        ? 3
        : u.type === 'core'
          ? 0
          : u.type === 'forge'
            ? 1
            : u.type === 'factory'
              ? 2
              : 3;
    const row = u.type === 'turret' ? 1 : u.team;
    const height =
      u.type === 'core' ? 150 : u.type === 'factory' ? 126 : u.type === 'forge' ? 113 : 94;
    if (u.type === 'quarry') {
      // Local procedural extraction machinery, distinct from supply homes.
      ctx.fillStyle = '#697b7d'; ctx.fillRect(-29, -9, 58, 25);
      ctx.strokeStyle = '#c3b795'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-21, 8); ctx.lineTo(-5, -67); ctx.lineTo(21, 8); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5,-67); ctx.lineTo(26,-52); ctx.lineTo(26,-18); ctx.stroke();
      ctx.fillStyle = '#9caeb2'; ctx.fillRect(17,-18,18,15);
      ctx.fillStyle = color; ctx.fillRect(-24, 11, 48, 4);
    } else if (
      !atlas(buildingSheet, col, row, -height * 0.49, -height + 29, height * 0.98, height, true)
    ) {
      ctx.fillStyle = color;
      ctx.fillRect(-u.r, -u.r, u.r * 2, u.r * 2);
    }
  }
  ctx.globalAlpha = 1;
  if (!d.speed && u.hp / u.max < 0.7) {
    ctx.strokeStyle = '#26251f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-u.r * 0.7, -23);
    ctx.lineTo(-5, -10);
    ctx.lineTo(-12, 0);
    ctx.lineTo(8, 17);
    ctx.stroke();
    if (u.hp / u.max < 0.35) {
      ctx.fillStyle = '#22251f';
      ctx.fillRect(-u.r * 0.45, -8, u.r * 0.7, 30);
    }
    for (let i = 0; i < 4; i++) {
      const phase = reducedMotion ? 0.4 : (t * 0.23 + i * 0.25) % 1;
      ctx.fillStyle = '#20272270';
      ctx.beginPath();
      ctx.arc(10 + Math.sin(i * 4) * 8, -40 - phase * 55, 6 + phase * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (d.speed && (u.morale < 80 || selected.includes(u))) {
    ctx.fillStyle = '#30392e';
    ctx.fillRect(-u.r, 25, u.r * 2, 3);
    ctx.fillStyle = u.morale < 45 ? '#c78660' : '#c4ae74';
    ctx.fillRect(-u.r, 25, (u.r * 2 * u.morale) / 100, 3);
  }
  if (!d.speed && !supplied(u) && !u.construction) {
    ctx.fillStyle = '#d39b6b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ISOLATED', 0, 55);
  }
  ctx.globalAlpha = 1;
  if (u.hp < u.max || selected.includes(u) || u.construction) {
    const y = d.speed ? 18 : 32;
    ctx.fillStyle = '#293c2d';
    ctx.fillRect(-u.r, y, u.r * 2, 5);
    ctx.fillStyle = u.hp / u.max < 0.3 ? '#e78872' : color;
    ctx.fillRect(-u.r, y, u.r * 2 * Math.max(0, u.hp / u.max), 5);
  }
  if (u.queue.length || u.construction || u.research) {
    ctx.fillStyle = '#394331';
    ctx.fillRect(-u.r, 41, u.r * 2, 4);
    ctx.fillStyle = '#efca6c';
    ctx.fillRect(
      -u.r,
      41,
      u.r *
        2 *
        (u.construction
          ? 1 - u.construction / (u.buildDuration || d.build)
          : u.research ? u.research.progress / researchDefs[u.research.id].time : u.progress / defs[u.queue[0]].time),
      4
    );
  }
  if (u.research) {ctx.fillStyle='#e4cf91';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('WEAPON RESEARCH',0,57);}
  ctx.restore();
}
function draw() {
  const cw = canvas.clientWidth,
    ch = canvas.clientHeight,
    dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#263e30';
  ctx.fillRect(0, 0, cw, ch);
  ctx.translate(cw / 2, ch / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);
  ctx.fillStyle = '#52604b';
  ctx.fillRect(0, 0, W, H);
  for (const road of [
    [
      [320, 900],
      [640, 880],
      [1080, 870],
      [1460, 280],
    ],
    [
      [320, 900],
      [610, 450],
      [1010, 420],
      [1460, 280],
    ],
  ]) {
    ctx.strokeStyle = '#766d53';
    ctx.lineWidth = 62;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    road.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
    ctx.stroke();
    ctx.strokeStyle = '#524f3e';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 9]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const p of terrain) {
    ctx.fillStyle = p.c > 0.5 ? '#d1c09220' : '#172e2525';
    ctx.fillRect(p.x, p.y, p.r * 2, p.r);
  }
  for (const o of obstacles) {
    ctx.fillStyle = '#263e30';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    for (let y = o.y + 10; y < o.y + o.h; y += 33)
      for (let x = o.x + 10; x < o.x + o.w; x += 30) {
        ctx.fillStyle = '#304a36';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1f352980';
        ctx.beginPath();
        ctx.arc(x - 6, y + 5, 14, 0, Math.PI * 2);
        ctx.fill();
      }
  }
  for (const c of covers) {
    ctx.strokeStyle = '#b1a17a60';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 7; i++) {
      ctx.save();
      ctx.translate(c.x - 45 + i * 15, c.y - 20);
      ctx.rotate(-0.1);
      ctx.fillStyle = '#a39a74';
      ctx.fillRect(-7, -5, 14, 10);
      ctx.strokeStyle = '#595d42';
      ctx.strokeRect(-7, -5, 14, 10);
      ctx.restore();
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ddd1b0';
    ctx.fillText('COVER −35% DAMAGE', c.x - 60, c.y + 20);
  }
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px Georgia';
  ctx.fillStyle = '#d5c7a2';
  ctx.fillText('CELESTEVILLE', 345, 1160);
  ctx.fillStyle = '#cd9c88';
  ctx.fillText('RHINOLAND', 1440, 70);
  ctx.fillStyle = '#c7c5a177';
  ctx.font = 'italic 21px Georgia';
  ctx.fillText('Northern approach', 600, 365);
  ctx.fillText('Southern road', 610, 1150);
  ctx.textAlign = 'left';
  for (const n of nodes) {
    if (knownResourceAmount(n,0) === 0) continue;
    if (n.kind === 'materials') {
      poly([[n.x-25,n.y+12],[n.x-20,n.y-12],[n.x,n.y-23],[n.x+25,n.y+4],[n.x+15,n.y+19]], '#789499', '#344c52');
      ctx.fillStyle='#dae6db'; ctx.font='10px monospace';
      ctx.fillText('MATERIALS ' + resourceLabel(n),n.x-44,n.y+34);
      const assigned = units.filter(w=>w.hp>0&&w.type==='worker'&&w.order?.node===n&&(w.team===0||visible(w))).length;
      ctx.fillText(assigned + ' workers · 3 slots',n.x-32,n.y+47);
      continue;
    }
    ctx.fillStyle = '#333c2c';
    ctx.fillRect(n.x - 22, n.y - 14, 44, 30);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#ad9160';
      ctx.fillRect(n.x - 20 + i * 14, n.y - 13, 12, 24);
      ctx.strokeStyle = '#605038';
      ctx.strokeRect(n.x - 20 + i * 14, n.y - 13, 12, 24);
    }
    ctx.fillStyle = '#e5d6a8';
    ctx.font = '9px monospace';
    ctx.fillText(resourceLabel(n), n.x - 12, n.y + 26);
  }
  ctx.fillStyle = '#373e30';
  ctx.fillRect(depot.x - 43, depot.y - 32, 86, 64);
  ctx.strokeStyle = depot.team === 0 ? BLUE : depot.team === 1 ? RED : '#c9b780';
  ctx.lineWidth = 3;
  ctx.strokeRect(depot.x - 43, depot.y - 32, 86, 64);
  ctx.fillStyle = '#9a8961';
  ctx.fillRect(depot.x - 26, depot.y - 14, 24, 28);
  ctx.fillRect(depot.x + 5, depot.y - 14, 24, 28);
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#efe0bb';
  ctx.textAlign = 'center';
  ctx.fillText('CENTRAL DEPOT', depot.x, depot.y - 43);
  ctx.fillText(
    depot.team === 0 ? 'SECURED +2/s' : depot.team === 1 ? 'RHINO SHIPMENTS' : 'HOLD 8s TO CAPTURE',
    depot.x,
    depot.y + 50
  );
  ctx.textAlign = 'left';
  if (depot.progress) {
    ctx.fillStyle = '#c6a665';
    ctx.fillRect(depot.x - 40, depot.y + 36, (80 * Math.abs(depot.progress)) / 8, 4);
  }
  if (placing || selected.some((u) => !defs[u.type].speed)) {
    const sites = alive(0).filter((u) => !defs[u.type].speed && !u.construction);
    for (let i = 0; i < sites.length; i++)
      for (let j = i + 1; j < sites.length; j++) {
        const a = sites[i],
          b = sites[j];
        if (dist(a, b) > 360) continue;
        const cut = alive(1).some(
          (e) =>
            defs[e.type].speed && defs[e.type].damage && sees(0, e) && segmentDistance(e, a, b) < 85
        );
        ctx.strokeStyle = cut ? '#c88760' : '#b1c29465';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 8]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
  }
  if (fog.width !== cw || fog.height !== ch) {
    fog.width = cw;
    fog.height = ch;
  }
  fc.clearRect(0, 0, cw, ch);
  if (t >= revealUntil) {
    fc.fillStyle = '#183427bd';
    fc.fillRect(0, 0, cw, ch);
    fc.globalCompositeOperation = 'destination-out';
    for (const u of alive(0)) {
      const p = screen(u);
      fc.beginPath();
      fc.arc(p.x, p.y, vision(u) * cam.zoom, 0, Math.PI * 2);
      fc.fill();
    }
    fc.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(fog, 0, 0);
    ctx.restore();
  }
  for (const u of units.filter((u) => visible(u)).sort((a, b) => a.y - b.y)) {
    ctx.save();
    if (u.team && !visible(u)) ctx.globalAlpha = 0.42;
    drawUnit(u);
    ctx.restore();
  }
  for (const u of selected) {
    if (u.orders?.length) {
      const route = [u.order, ...u.orders].map(o => o?.node || o?.target || o).filter(q => Number.isFinite(q?.x));
      ctx.strokeStyle = '#d7ba7999'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(u.x, u.y);
      for (const q of route) ctx.lineTo(q.x, q.y);
      ctx.stroke(); ctx.setLineDash([]);
      for (const q of route) { ctx.beginPath(); ctx.arc(q.x, q.y, 5, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (u.rally) {
      ctx.strokeStyle = '#d7ba79';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(u.rally.x, u.rally.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(u.rally.x, u.rally.y + 10); ctx.lineTo(u.rally.x, u.rally.y - 20);
      ctx.lineTo(u.rally.x + 16, u.rally.y - 14); ctx.lineTo(u.rally.x, u.rally.y - 8); ctx.stroke();
    }
    if (u.order && defs[u.type].speed) {
      const q = u.order.node || u.order.target || u.order;
      if (Number.isFinite(q.x)) {
        ctx.strokeStyle = '#f5ebc77a';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }
  for (const f of fx) {
    ctx.globalAlpha = f.life / f.max;
    if (f.shellImpact) {
      ctx.fillStyle = '#99846540'; ctx.strokeStyle = '#d6b473'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (reducedMotion ? 1 : 1 - f.life / f.max * .6), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (f.burst) {
      ctx.fillStyle = '#252a24';
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.r * (1.1 - (f.life / f.max) * 0.2), f.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      if (!reducedMotion) {
        ctx.fillStyle = '#a5a18b55';
        ctx.beginPath();
        ctx.arc(f.x, f.y - (1 - f.life / f.max) * 22, f.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (f.ring) {
      ctx.strokeStyle = '#fff1ae';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, (1 - f.life / f.max) * 40 + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const p = 1 - f.life / f.max;
      ctx.fillStyle = f.team ? '#d78768' : '#f7e694';
      ctx.beginPath();
      ctx.arc(
        f.x + (f.tx - f.x) * p,
        f.y + (f.ty - f.y) * p - Math.sin(p * Math.PI) * 14,
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (placing) {
    const p = world(pointer),
      r = defs[placing].r;
    ctx.strokeStyle = validBuild(p, placing) ? '#edffd7' : '#f16855';
    ctx.fillStyle = validBuild(p, placing) ? '#edffd735' : '#f1685535';
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (down && !down.pan && !mode && !placing) {
    ctx.strokeStyle = '#ffe9a7';
    ctx.fillStyle = '#ffe9a722';
    ctx.fillRect(down.x, down.y, pointer.x - down.x, pointer.y - down.y);
    ctx.strokeRect(down.x, down.y, pointer.x - down.x, pointer.y - down.y);
  }
  if (paused) {
    ctx.fillStyle = '#18332760';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff3d1';
    ctx.font = 'bold 28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('COMMAND PAUSED', cw / 2, ch / 2);
    ctx.textAlign = 'left';
  }
  mc.fillStyle = '#435340';
  mc.fillRect(0, 0, 300, 210);
  mc.fillStyle = '#c3bb8b';
  mc.beginPath();
  mc.moveTo(50, 150);
  mc.lineTo(242, 46);
  mc.lineTo(248, 54);
  mc.lineTo(58, 158);
  mc.fill();
  for (const o of obstacles) {
    mc.fillStyle = '#233d2c';
    mc.fillRect((o.x / W) * 300, (o.y / H) * 210, (o.w / W) * 300, (o.h / H) * 210);
  }
  mc.fillStyle = depot.team === 0 ? BLUE : depot.team === 1 ? RED : '#c9b780';
  mc.fillRect((depot.x / W) * 300 - 4, (depot.y / H) * 210 - 4, 8, 8);
  for (const n of nodes) {
    if (knownResourceAmount(n,0) === 0) continue;
    mc.fillStyle = '#e8b058';
    mc.fillRect((n.x / W) * 300 - 2, (n.y / H) * 210 - 2, 4, 4);
  }
  for (const u of units) {
    if (u.team && !visible(u)) continue;
    mc.fillStyle = u.team ? '#c95850' : '#e0f2b1';
    const s = u.type === 'hero' ? 6 : defs[u.type].speed ? 3 : 7;
    mc.fillRect((u.x / W) * 300 - s / 2, (u.y / H) * 210 - s / 2, s, s);
  }
  for(const a of activeAttacks()){mc.strokeStyle='#ffb58c';mc.lineWidth=2;mc.beginPath();mc.arc(a.x/W*300,a.y/H*210,7,0,Math.PI*2);mc.stroke();}
  mc.strokeStyle = '#fff1bc';
  mc.lineWidth = 1.5;
  mc.strokeRect(
    ((cam.x - cw / 2 / cam.zoom) / W) * 300,
    ((cam.y - ch / 2 / cam.zoom) / H) * 210,
    (cw / cam.zoom / W) * 300,
    (ch / cam.zoom / H) * 210
  );
}
function loop(now) {
  const dt = Math.min((now - last) / 1000 || 0, 0.05);
  last = now;
  if (running && !paused && !ended) {
    const pan = (420 * dt) / cam.zoom;
    if (keys.ArrowLeft) cam.x -= pan;
    if (keys.ArrowRight) cam.x += pan;
    if (keys.ArrowUp) cam.y -= pan;
    if (keys.ArrowDown) cam.y += pan;
    cam.x = clamp(cam.x, 0, W);
    cam.y = clamp(cam.y, 0, H);
    update(dt);
    soundscape();
  }
  draw();
  requestAnimationFrame(loop);
}
function positionMinimap() {
  const narrow =
    (document.body?.clientWidth || window.innerWidth) <= 580 ||
    (document.body?.clientHeight || window.innerHeight) <= 500;
  const parent = narrow ? document.querySelector('.field') : document.querySelector('aside');
  if (mini.parentElement !== parent) {
    if (narrow) parent.appendChild(mini);
    else parent.insertBefore(mini, document.querySelector('.selection'));
  }
}
window.addEventListener('resize', positionMinimap);
positionMinimap();
reset();
requestAnimationFrame(loop);
