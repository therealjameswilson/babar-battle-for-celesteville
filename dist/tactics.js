'use strict';
let enemyScoutSent = false;
let depot = { x: 950, y: 830, r: 65, team: -1, progress: 0 },
  enemyBudget = 650,
  enemySpent = 0,
  linked = new Set(),
  intel = [[], []],
  logbook = [],
  supplyClock = 0;
let sightAt = -1,
  sightCount = -1,
  sightSets = [new Set(), new Set()];
function sees(team, target) {
  if (target.team === team) return true;
  if (sightAt !== t || sightCount !== units.length) {
    sightAt = t;
    sightCount = units.length;
    const teams = [alive(0), alive(1)];
    sightSets = [new Set(), new Set()];
    for (let side = 0; side < 2; side++)
      for (const enemy of teams[1 - side])
        if ((side === 0 && t < revealUntil) || teams[side].some((a) => dist(a, enemy) < vision(a)))
          sightSets[side].add(enemy.id);
  }
  return sightSets[team].has(target.id);
}
function inCover(u) {
  return !!defs[u.type].speed && covers.some((c) => dist(c, u) < c.r);
}
function supplied(b) {
  return linked.has(b.id);
}
function rebuildSupply() {
  linked = new Set();
  for (const team of [0, 1]) {
    const buildings = alive(team).filter((b) => !defs[b.type].speed && !b.construction);
    const core = buildings.find((b) => b.type === 'core');
    if (!core) continue;
    linked.add(core.id);
    let changed = true;
    while (changed) {
      changed = false;
      for (const b of buildings) {
        if (linked.has(b.id)) continue;
        for (const a of buildings.filter((a) => linked.has(a.id))) {
          if (dist(a, b) > 360) continue;
          const blockedLine = alive(1 - team).some(
            (e) => defs[e.type].damage && defs[e.type].speed && segmentDistance(e, a, b) < 85
          );
          if (!blockedLine) {
            linked.add(b.id);
            changed = true;
            break;
          }
        }
      }
    }
  }
}
function segmentDistance(p, a, b) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    q = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return Math.hypot(p.x - a.x - q * dx, p.y - a.y - q * dy);
}
function orderRetreat(u) {
  u.orders = [];
  u.followup = null;
  const base = nearest(
    u,
    alive(u.team).filter((b) => b.type === 'core' || (b.type === 'relay' && supplied(b)))
  );
  if (base)
    u.order = {
      kind: 'retreat',
      x: base.x + 70 + (u.id % 3) * 30,
      y: base.y + 70 + (u.id % 2) * 30,
    };
  u.path = null;
}
function tacticalOrders(kind) {
  if (!running || paused || ended) return;
  for (const u of selected.filter((u) => defs[u.type].speed)) {
    if (kind === 'retreat') orderRetreat(u);
    else issueOrder(u, { kind: 'hold' });
  }
  placing = null;
  mode = null;
  say(
    kind === 'retreat'
      ? 'Withdraw to the aid station. Officers restore morale.'
      : 'Hold this ground. Fire only within range.'
  );
  updateUI(true);
}
function repairOrder(p, append = false) {
  const b = nearest(
    p,
    alive(0).filter((b) => !defs[b.type].speed)
  );
  if (!b || dist(p, b) > b.r + 25) return say('Choose a damaged friendly building.');
  let workers = selected.filter((u) => u.type === 'worker');
  if (!workers.length) return say('Select provisioners to repair.');
  workers.forEach((u) => issueOrder(u, { kind: 'repair', target: b }, append));
  say('Repair detail assigned. Repairs use 0.3 supplies per health.');
  mode = null;
}
function updateTactics(dt) {
  supplyClock -= dt;
  if (supplyClock <= 0) {
    supplyClock = 0.5;
    rebuildNav();
    rebuildSupply();
    for (let team = 0; team < 2; team++)
      for (const e of alive(1 - team).filter((e) => sees(team, e))) {
        const known = intel[team].find((k) => k.id === e.id);
        if (known) {
          known.x = e.x;
          known.y = e.y;
          known.seen = t;
        } else intel[team].push({ id: e.id, type: e.type, x: e.x, y: e.y, seen: t });
      }
  }
  const near = [0, 1].map(
    (team) =>
      alive(team).filter((u) => defs[u.type].damage && defs[u.type].speed && dist(u, depot) < 90)
        .length
  );
  if (near[0] > 0 !== near[1] > 0) {
    const side = near[0] ? 0 : 1;
    if (depot.team !== side) {
      depot.progress += (side === 0 ? 1 : -1) * dt;
      if (Math.abs(depot.progress) >= 8) {
        depot.team = side;
        depot.progress = 0;
        say(
          side === 0
            ? 'Central depot secured. Basil’s reserve shipments are cut off.'
            : 'Basil has retaken the depot. Enemy shipments restored.'
        );
      }
    } else depot.progress = 0;
  }
  if (depot.team === 0) ore += 2 * dt;
  else if (alive(1).some((b) => b.type === 'forge'))
    enemyBudget = Math.min(900, enemyBudget + (easy ? 0.8 : 1.3) * dt);
  const friendlyTeams = [alive(0), alive(1)];
  for (const u of units.filter((u) => u.hp > 0 && defs[u.type].speed)) {
    const officer = friendlyTeams[u.team].some((b) => b.type === 'hero' && dist(u, b) < 190);
    const hospital = friendlyTeams[u.team].some(
      (b) => (b.type === 'core' || b.type === 'relay') && supplied(b) && dist(u, b) < 160
    );
    if (t - (u.hitAt ?? -100) > 3)
      u.morale = clamp(u.morale + dt * (officer ? 12 : hospital ? 10 : 4), 0, 100);
    if (hospital && t - (u.hitAt ?? -100) > 5)
      u.hp = Math.min(u.max, u.hp + dt * (u.team === 0 && benefits.has('celeste') ? 6 : 2));
    if (u.morale < 25 && u.order?.kind !== 'retreat') orderRetreat(u);
    if (u.team === 1 && u.hp / u.max < 0.27 && u.order?.kind !== 'retreat') orderRetreat(u);
  }
}
function enemyThink() {
  if (t >= enemySpawn && alive(1).some((b) => b.type === 'forge')) {
    enemySpawn = t + (easy ? 18 : 12) * (wave >= 2 ? 0.8 : 1);
    let type = wave > 1 && wave % 2 === 0 ? 'walker' : 'trooper';
    if (
      alive(1).filter((u) => defs[u.type].speed).length < (easy ? 20 : 28) &&
      enemyBudget >= defs[type].cost
    ) {
      enemyBudget -= defs[type].cost;
      enemySpent += defs[type].cost;
      add(type, 1, 1380, 380);
    }
  }
  // Scouting is a move order along a known road; target acquisition still requires vision.
  if (t > 22 && !enemyScoutSent && wave === 0 && enemyBudget >= defs.scout.cost) {
    enemyScoutSent = true;
    enemyBudget -= defs.scout.cost;
    add('scout', 1, 1250, 570, { order: { kind: 'move', x: 650, y: 880 } });
  }
  if (t < nextWave) return;
  wave++;
  nextWave = t + (easy ? 100 : 72);
  const flank = wave % 3 === 0;
  const known = intel[1].filter((k) => k.type === 'core').sort((a, b) => b.seen - a.seen)[0];
  const goal = known || { x: 320, y: 900 };
  for (const e of alive(1).filter(
    (u) =>
      defs[u.type].damage && defs[u.type].speed && (u.type !== 'hero' || wave >= 2) && u.morale > 50
  )) {
    e.order = { kind: 'attack', x: flank ? 650 : goal.x, y: flank ? 430 : goal.y };
    e.followup = flank ? { kind: 'attack', x: goal.x, y: goal.y } : null;
  }
  if (wave === 1) {
    const f = alive(1).find((u) => u.type === 'core');
    if (f) {
      f.max += 250;
      f.hp += 250;
    }
  }
  if (wave === 3) nextWave += 20;
  say(
    flank
      ? 'Rhino columns are taking the northern road.'
      : 'Basil’s main assault is advancing. Prepare the defenses.'
  );
}
