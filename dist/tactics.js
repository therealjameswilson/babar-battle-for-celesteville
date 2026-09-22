// Active commander skills are invented wartime roles, separate from council powers.
function commanderAbility(u) {
  if (!running || paused || ended || !u || u.hp <= 0 || u.type !== 'hero') return false;
  if (u.commandEnergy < 50 || t < u.commandReadyAt) {
    if (u.team === 0) say('Commander needs 50 energy and a ready command.');
    return false;
  }
  u.commandEnergy -= 50;
  u.commandReadyAt = t + 35;
  const nearby = alive(u.team).filter(a => defs[a.type].speed && dist(a, u) <= 180);
  for (const a of nearby) {
    if (u.team === 0) {
      a.disciplineUntil = Math.max(a.disciplineUntil||0,t + 8);
      a.morale = Math.min(100, a.morale + 20);
    } else a.advanceUntil = t + 8;
  }
  if (u.team === 0 || visible(u)) say(u.team === 0
    ? 'Babar: Stand together. Nearby troops take 25% less damage for 8 seconds.'
    : 'Rataxes orders a forced advance. His formation is closing rapidly.');
  updateUI(true);
  return true;
}
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
// Location visibility works for remembered objects that no longer exist.
function observesPosition(team,p) {
  return (team===0&&t<revealUntil)||alive(team).some(u=>dist(u,p)<vision(u));
}
function refreshIntelligence(team) {
  const observed=alive(1-team).filter(e=>sees(team,e));
  for(const e of observed) {
    const record=intel[team].find(k=>k.id===e.id);
    const snapshot={id:e.id,type:e.type,x:e.x,y:e.y,seen:t};
    if(record)Object.assign(record,snapshot);else intel[team].push(snapshot);
  }
  intel[team]=intel[team].filter(k=> {
    if(defs[k.type].speed)return t-k.seen<=60;
    // Never consult the current state of a hidden enemy to invalidate a report.
    return !observesPosition(team,k)||observed.some(e=>e.id===k.id);
  });
}
function rememberedBuildings(team=0) {
  return intel[team].filter(k=>!defs[k.type].speed&&!observesPosition(team,k));
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
    const roots=buildings.filter(workerProducer);
    if(!roots.length)continue;
    for(const root of roots)linked.add(root.id);
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
  const x=p.x-a.x-q*dx,y=p.y-a.y-q*dy;
  return Math.sqrt(x*x+y*y);
}
function orderRetreat(u) {
  u.orders = [];
  u.followup = null;
  const base = nearest(
    u,
    alive(u.team).filter((b) => deliveryBase(b) && supplied(b))
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
      : 'Hold this ground. Current fire discipline still applies.'
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
  workers.forEach((u) => issueOrder(u, { kind: b.construction ? 'build' : 'repair', target: b }, append));
  say(b.construction ? 'Provisioners assigned to finish construction.' : 'Repair detail assigned. Repairs use 0.3 supplies per health.');
  mode = null;
}
function updateTactics(dt) {
  supplyClock -= dt;
  if (supplyClock <= 0) {
    supplyClock = 0.5;
    rebuildNav();
    rebuildSupply();
    for (let team = 0; team < 2; team++) refreshIntelligence(team);
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
            ? 'Central depot secured. Supplies are reaching our command.'
            : 'Basil has taken the depot. Rhino command receives its Supplies.'
        );
      }
    } else depot.progress = 0;
  }
  if (depot.team === 0) ore += 2 * dt;
  else if (depot.team === 1) enemyBudget += 2 * dt;
  const friendlyTeams = [alive(0), alive(1)];
  for (const u of units.filter((u) => u.hp > 0 && defs[u.type].speed)) {
    if (u.type === 'hero') u.commandEnergy = Math.min(100, u.commandEnergy + dt * 1.25);
    const officer = friendlyTeams[u.team].some((b) => b.type === 'hero' && dist(u, b) < 190);
    const hospital = friendlyTeams[u.team].some(
      (b) => deliveryBase(b) && supplied(b) && dist(u, b) < 160
    );
    if (t - (u.hitAt ?? -100) > 3)
      u.morale = clamp(u.morale + dt * (officer ? 12 : hospital ? 10 : 4), 0, 100);
    if (hospital && t - (u.hitAt ?? -100) > 5)
      u.hp = Math.min(u.max, u.hp + dt * (u.team === 0 && benefits.has('celeste') ? 6 : 2));
    if (!u.civilDefense && u.morale < 25 && u.order?.kind !== 'retreat') orderRetreat(u);
    if (u.team === 1 && u.hp / u.max < 0.27 && u.order?.kind !== 'retreat') orderRetreat(u);
  }
}
function enemyThink() {
  enemyArtillery();
  enemyRapidAdvance();
  for (const leader of alive(1).filter(u => u.type === 'hero' && u.order?.kind !== 'retreat')) {
    if (leader.commandEnergy >= 50 && t >= leader.commandReadyAt &&
        alive(0).some(v => sees(1, v) && dist(leader, v) < 300) &&
        alive(1).filter(v => defs[v.type].speed && dist(leader, v) <= 180).length >= 2)
      commanderAbility(leader);
  }
  enemyMacro();
  if (t < nextWave) return;
  wave++;
  nextWave = t + (easy ? 100 : 72);
  const operation=dispatchEnemyAssault(wave);
  if (wave === 1) {
    const f = alive(1).find((u) => u.type === 'core');
    if (f) {
      f.max += 250;
      f.hp += 250;
    }
  }
  if (wave === 3) nextWave += 20;
  say(
    operation.raiders.some(visible)
      ? 'Rhino raiders are breaking away toward a supply position.'
      : 'Basil’s main assault is advancing. Prepare the defenses.'
  );
}
