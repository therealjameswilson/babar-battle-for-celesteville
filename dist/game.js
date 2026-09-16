'use strict';
const $ = (id) => document.getElementById(id),
  canvas = $('game'),
  ctx = canvas.getContext('2d'),
  mini = $('minimap'),
  mc = mini.getContext('2d');
const W = 1800,
  H = 1260,
  BLUE = '#78cbaa',
  RED = '#ce6c63';
const defs = {
  core: { name: 'Royal Palace', hp: 1800, r: 47, cost: 400, build: 24 },
  forge: { name: 'Guard School', hp: 850, r: 34, cost: 150, build: 12 },
  factory: { name: 'Artillery Works', hp: 1050, r: 38, cost: 240, materials: 50, build: 18 },
  quarry: { name: 'Materials Quarry', hp: 600, r: 26, cost: 100, build: 12 },
  relay: { name: 'Village Home', hp: 450, r: 23, cost: 100, build: 9 },
  turret: {
    name: 'Lookout Tower',
    hp: 650,
    r: 23,
    cost: 160,
    build: 12,
    range: 190,
    damage: 21,
    rate: 0.85,
  },
  worker: { name: 'Provisioner', hp: 85, r: 13, cost: 50, time: 6, speed: 84 },
  trooper: {
    name: 'Elephant Guard',
    hp: 145,
    r: 15,
    cost: 60,
    time: 7,
    speed: 77,
    range: 145,
    damage: 12,
    rate: 0.9,
  },
  walker: {
    name: 'Field Artillery',
    materials: 25,
    hp: 240,
    r: 19,
    cost: 160,
    time: 16,
    speed: 43,
    range: 270,
    damage: 48,
    rate: 2.8,
  },
  sapper: { name: 'Field Sapper', hp: 105, r: 14, cost: 90, materials: 20, time: 10, speed: 83, range: 170, damage: 10, rate: 1.2 },
  scout: {
    name: 'Forest Scout',
    hp: 75,
    r: 12,
    cost: 55,
    time: 6,
    speed: 125,
    range: 95,
    damage: 7,
    rate: 1.1,
  },
  hero: {
    name: 'King Babar',
    hp: 640,
    r: 20,
    cost: 0,
    speed: 72,
    range: 100,
    damage: 24,
    rate: 0.85,
  },
};
let units = [],
  nodes = [],
  fx = [],
  selected = [],
  ore = 300,
  t = 0,
  wave = 0,
  nextWave = 75,
  running = false,
  paused = false,
  ended = false,
  easy = false,
  mode = null,
  placing = null,
  cam = { x: 360, y: 840, zoom: 1 },
  down = null,
  pointer = { x: 0, y: 0 },
  keys = {},
  uid = 0,
  toastUntil = 0,
  uiTime = 0,
  last = 0,
  enemySpawn = 0,
  kills = 0,
  benefits = new Set(),
  usedPowers = {},
  revealUntil = 0,
  heroRecovery = [],
  panMode = false;
const rand = (a, b) => a + Math.random() * (b - a),
  dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
  clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function add(type, team, x, y, extra = {}) {
  let d = defs[type];
  let u = {
    id: ++uid,
    type,
    team,
    x,
    y,
    hp: d.hp,
    max: d.hp,
    r: d.r,
    angle: 0,
    morale: 100,
    commandEnergy: type === 'hero' ? 60 : 0,
    commandReadyAt: 0,
    cool: 0,
    order: null,
    queue: [],
    progress: 0,
    carrying: 0,
    harvest: 0,
    ...extra,
  };
  if (team === 0) {
    const bonus =
      (d.speed && benefits.has('isabelle') ? 20 : 0) +
      (type === 'worker' && benefits.has('babar-mother') ? 30 : 0) +
      (type === 'walker' && benefits.has('old-tusk') ? 60 : 0);
    u.hp += bonus;
    u.max += bonus;
  }
  units.push(u);
  return u;
}
function alive(team) {
  return units.filter((u) => u.team === team && u.hp > 0);
}
function supply(team = 0) {
  return (
    alive(team).filter((u) => defs[u.type].speed).length +
    alive(team).reduce((a, u) => a + u.queue.length, 0)
  );
}
function cap(team = 0) {
  return Math.min(
    100,
    (team === 0 && benefits.has('madame') ? 10 : 0) +
      alive(team).reduce(
        (a, u) =>
          a +
          (u.construction
            ? 0
            : u.type === 'core'
              ? 20
              : u.type === 'relay'
                ? team === 0 && benefits.has('celeste-mother')
                  ? 15
                  : 10
                : 0),
        0
      )
  );
}
function say(s) {
  $('toast').textContent = s;
  toastUntil = t + 6;
  if (typeof logbook !== 'undefined') {
    logbook.unshift(time(t) + ' ' + s);
    logbook = logbook.slice(0, 12);
  }
}
const researchDefs = {
  drill: { name: "Cornelius: coordinated volleys", building: 'forge', cost: 150, time: 25,
    description: 'Guards, scouts and sappers deal 20% more damage. Applies to existing and future troops.' },
  shells: { name: 'Calibrated field shells', building: 'factory', cost: 180, materials: 60, time: 35,
    description: 'Field artillery deals 25% more damage. Applies to existing and future guns.' },
};
let technologies = new Set(), enemyTechnologies = new Set();
function startResearch(id) {
  if (!running || paused || ended) return;
  const tech = researchDefs[id];
  if (!tech || technologies.has(id)) return;
  const b = selected.find(u => u.team === 0 && u.hp > 0 && u.type === tech.building && !u.construction);
  if (!b || b.research || b.queue.length) return say('Research needs an idle production building.');
  if (alive(0).some(u => u.research?.id === id)) return say('This research is already underway.');
  if (materials < (tech.materials || 0)) return say('Not enough Materials. Staff a supplied quarry.');
  if (ore < tech.cost) return say('Not enough supplies for research.');
  if (!purchaseResearch(b,id)) return;
  say(tech.name + ' research started. Recruitment is suspended here.');
  updateUI(true);
}
function cancelResearch(b) {
  if (!running || paused || ended || b.team !== 0 || b.hp <= 0 || !b.research) return;
  ore += researchDefs[b.research.id].cost * 0.75;
  materials += (researchDefs[b.research.id].materials || 0) * .75;
  b.research = null;
  say('Research cancelled. 75% of paid resources recovered.');
  updateUI(true);
}
function weaponMultiplier(u) {
  const upgrades=factionResearch(u.team);
  if (upgrades.has('drill') && ['trooper', 'scout', 'sapper'].includes(u.type)) return 1.2;
  if (upgrades.has('shells') && u.type === 'walker') return 1.25;
  return 1;
}
let controlGroups = {}, queueOrders = false;
function issueOrder(u, order, append = false) {
  if (append && u.order && u.order.kind !== 'hold') {
    u.orders ||= [];
    if (u.orders.length >= 16) return;
    u.orders.push(order);
  } else {
    u.order = order;
    u.orders = [];
    u.followup = null;
    u.path = null;
  }
}
function completeOrder(u) {
  u.order = u.orders?.shift() || u.followup || null;
  u.followup = null;
  u.path = null;
}

function controlGroup(number, save = false, append = false) {
  if (!running || paused || ended) return;
  if (save) {
    const previous = append ? controlGroups[number] || [] : [];
    controlGroups[number] = [...new Set([...previous, ...selected.filter(u => u.team === 0 && u.hp > 0).map(u => u.id)])];
    say(`Group ${number} assigned.`);
  } else {
    selected = alive(0).filter(u => (controlGroups[number] || []).includes(u.id));
    say(`Group ${number}: ${selected.length} selected.`);
  }
  updateUI(true);
}
function reset() {
  technologies = new Set(); enemyTechnologies = new Set();
  controlGroups = {};
  queueOrders = false;
  $('queue-orders').setAttribute('aria-pressed', 'false');
  enemyScoutSent = false;
  sightAt = -1;
  sightCount = -1;
  solidCacheAt = -1;
  depot = { x: 950, y: 830, r: 65, team: -1, progress: 0 };
  enemyBudget = easy ? 480 : 650;
  enemySpent = 0;
  linked = new Set();
  intel = [[], []];
  navStamp = '';
  supplyClock = 0;
  logbook = [];
  navStats = { searches: 0, expanded: 0 };
  units = [];
  nodes = [];
  fx = [];
  selected = [];
  ore = 300;
  materials = 0; enemyMaterials = 60;
  t = 0;
  wave = 0;
  nextWave = easy ? 120 : 85;
  enemySpawn = 0;
  kills = 0;
  running = false;
  paused = false;
  ended = false;
  mode = null;
  placing = null;
  keys = {};
  benefits = new Set();
  usedPowers = {};
  revealUntil = 0;
  heroRecovery = [];
  uiTime = 0;
  panMode = false;
  cam = { x: 380, y: 870, zoom: window.innerWidth <= 580 || (document.body?.clientHeight || window.innerHeight) <= 500 ? 0.72 : 1 };
  for (const [x, y] of [
    [155, 770],
    [140, 840],
    [155, 910],
    [210, 1000],
    [970, 840],
    [1040, 900],
    [880, 930],
    [1560, 290],
    [1610, 360],
    [1510, 420],
  ])
    nodes.push({ x, y, r: 20, amount: 1800 });
  for (const [x, y] of [[275, 650], [1070, 770], [1260, 610]]) nodes.push({x, y, r:26, amount:1600, kind:'materials'});
  add('core', 0, 320, 900);
  add('hero', 0, 395, 800, { name: 'King Babar' });
  add('forge', 0, 465, 920);
  add('relay', 0, 340, 1040);
  for (let i = 0; i < 4; i++)
    add('worker', 0, 240 + i * 20, 810, { order: { kind: 'gather', node: nodes[i % 4] } });
  for (let i = 0; i < 5; i++) add('trooper', 0, 490 + (i % 3) * 36, 810 + Math.floor(i / 3) * 36);
  add('core', 1, 1460, 280);
  add('hero', 1, 1450, 370, { name: 'Lord Rataxes' });
  add('forge', 1, 1320, 300, { name: 'Basil’s barracks' });
  add('factory', 1, 1450, 145);
  add('turret', 1, 1270, 450);
  add('turret', 1, 1520, 500);
  add('quarry', 1, 1260, 610);
  for (let i=0;i<6;i++) add('worker',1,1530+i*14,330,{order:{kind:'gather',node:nodes[7+i%3]}});
  for (let i=0; i<3; i++) add('worker', 1, 1210-i*18, 640, {order:{kind:'gather',node:nodes.find(n=>n.kind==='materials'&&n.x===1260)}});
  for (let i = 0; i < (easy ? 4 : 6); i++) add('trooper', 1, 1330 + i * 30, 390);
  rebuildNav();
  rebuildSupply();
  selected = [units[0]];
  $('pan').setAttribute('aria-pressed', 'false');
  $('pause').textContent = 'Pause';
  updateUI(true);
}
function screen(p) {
  return {
    x: (p.x - cam.x) * cam.zoom + canvas.clientWidth / 2,
    y: (p.y - cam.y) * cam.zoom + canvas.clientHeight / 2,
  };
}
function world(p) {
  return {
    x: (p.x - canvas.clientWidth / 2) / cam.zoom + cam.x,
    y: (p.y - canvas.clientHeight / 2) / cam.zoom + cam.y,
  };
}
function vision(u) {
  return (
    (u.type === 'scout' ? 410 : defs[u.type].speed ? 260 : 300) *
    (u.team === 0 && benefits.has('flora') ? 1.25 : 1)
  );
}
function visible(u) {
  return sees(0, u);
}
function nearest(u, list) {
  return list.reduce((best, a) => (!best || dist(u, a) < dist(u, best) ? a : best), null);
}
function damageUnit(u, v, baseDamage, scale = 1) {
  if (v.hp <= 0) return;
  const damage = (baseDamage + counterBonus(u,v)) * scale * weaponMultiplier(u) *
    (u.team === 1 && easy ? 0.7 : 1) * (inCover(v) ? 0.65 : 1) *
    ((v.disciplineUntil || 0) > t ? 0.75 : 1) *
    (u.type === 'walker' && !defs[v.type].speed ? 1.8 : 1);
  v.hp -= damage;
  v.morale = Math.max(0, v.morale - ((u.type === 'walker' ? 26 : 12) + ((u.advanceUntil || 0) > t ? 6 : 0)) * scale);
  v.hitAt = t;
  if (v.hp <= 0) {
    if (v.team === 1 && u.team === 0) kills++;
    if (v.type === 'hero') heroRecovery.push({
      team: v.team, name: v.name,
      at: t + (v.team === 0 && benefits.has('periwinkle') ? 25 : 45),
    });
    fx.push({ x: v.x, y: v.y, life: 1.5, max: 1.5, burst: true, r: v.r });
  }
}
function shoot(u, v) {
  if (u.hp <= 0 || v.hp <= 0 || u.artilleryTransition || !inWeaponArc(u, v) || !sees(u.team, v)) return false;
  const d = defs[u.type];
  u.cool = (u.deployed ? SIEGE.rate : d.rate) * (u.morale < 45 ? 1.5 : 1);
  u.angle = Math.atan2(v.y - u.y, v.x - u.x);
  u.firedAt = t;
  if (u.deployed) {
    // Resolve the entire impact from one snapshot, including nearby friendly troops.
    const victims = units.filter(a => a.hp > 0 && (a === v || dist(a, v) <= SIEGE.radius));
    for (const a of victims) {
      const distance = dist(a, v);
      damageUnit(u, a, SIEGE.damage, a === v || distance <= 22 ? 1 : distance <= 43 ? .5 : .25);
    }
    fx.push({ x: v.x, y: v.y, life: .55, max: .55, shellImpact: true, r: SIEGE.radius });
  } else damageUnit(u, v, d.damage);
  fx.push({ x: u.x, y: u.y, tx: v.x, ty: v.y, life: .3, max: .3, team: u.team, heavy: u.type === 'walker' });
  battleSound(u.type === 'walker' ? 'cannon' : 'shot');
  return true;
}

function update(dt) {
  t += dt;
  updateTactics(dt);
  selected = selected.filter((u) => u.hp > 0);
  if (t > toastUntil) $('toast').textContent = '';
  for (const u of [...units]) {
    if (u.hp <= 0) continue;
    const d = defs[u.type];
    u.cool = Math.max(0, u.cool - dt);
    if (updateArtillery(u)) continue;
    if (u.construction) {
      const builders = alive(u.team).filter(w => w.type === 'worker' && w.order?.kind === 'build' && w.order.target === u && dist(w, u) <= u.r + w.r + 12);
      if (!builders.length) continue;
      const spent = Math.min(dt, u.construction);
      u.construction = Math.max(0, u.construction - dt);
      u.hp = Math.min(u.max, u.hp + (u.max * spent) / (u.buildDuration || d.build));
      if (!u.construction) {
        if (u.team === 0 || visible(u)) say(d.name + ' ready.');
      }
      continue;
    }
    if (u.research) {
      u.research.progress += dt * (supplied(u) ? 1 : 0.25);
      if (u.research.progress >= researchDefs[u.research.id].time) {
        factionResearch(u.team).add(u.research.id);
        if (u.team===0) say(researchDefs[u.research.id].name + ' ready. Army weapons upgraded.');
        else if (visible(u)) say('Rhino weapon research completed at this production site.');
        u.research = null;
        updateUI(true);
      }
    }
    if (u.queue.length && !u.research) {
      u.progress +=
        dt * (supplied(u) ? 1 : 0.25) * (u.team === 0 && benefits.has('troubadour') || u.team === 1 && wave >= 2 ? 1.25 : 1);
      const type = u.queue[0];
      if (u.progress >= defs[type].time) {
        let q = { x: u.x + u.r + 38, y: u.y + 45 };
        if (solidAt(q.x, q.y, defs[type].r)) q = point(freeCell(q));
        let n = add(type, u.team, q.x, q.y);
        if (type === 'worker')
          n.order = {
            kind: 'gather',
            node: nearest(
              n,
              nodes.filter((a) => a.amount > 0 && a.kind !== 'materials')
            ),
          };
        if (u.rally) {
          n.order = type === 'worker' && u.rally.node?.amount > 0
            ? { kind: 'gather', node: u.rally.node }
            : { kind: 'move', x: u.rally.x, y: u.rally.y };
        }
        if (u.team === 1 && type === 'scout' && !enemyScoutSent) { enemyScoutSent = true; issueOrder(n,{kind:'move',x:650,y:880}); }
        u.queue.shift();
        u.progress = 0;
        if (u.team === 0) say(defs[type].name + ' ready.');
      }
    }
    if (u.type === 'worker' && u.order?.kind === 'build') {
      const site = u.order.target;
      if (!site || site.hp <= 0 || !site.construction) {
        completeOrder(u);
        if (!u.order && u.returnToWork) u.order = u.returnToWork;
        u.returnToWork = null;
      } else move(u, site, dt, site.r + u.r + 8);
      continue;
    }
    if (u.order?.kind === 'retreat') {
      if (move(u, u.order, dt, 14)) u.order = { kind: 'hold' };
      continue;
    }
    if (u.type === 'worker' && u.order?.kind === 'repair') {
      const b = u.order.target;
      if (!b || b.hp <= 0 || b.hp >= b.max) {
        completeOrder(u);
        continue;
      }
      if (move(u, b, dt, b.r + u.r + 7)) {
        const amount = Math.min(18 * dt, b.max - b.hp, (u.team ? enemyBudget : ore) / 0.3);
        b.hp += amount;
        if (u.team) enemyBudget -= amount * 0.3; else ore -= amount * 0.3;
      }
      continue;
    }
    if (u.type === 'worker' && u.order?.kind === 'gather') {
      let n = u.order.node;
      if ((!n || n.amount <= 0) && u.carrying === 0) {
        n = nearest(
          u,
          nodes.filter((a) => a.amount > 0 && (a.kind || 'supplies') === (n?.kind || 'supplies'))
        );
        u.order.node = n;
        if (!n) {
          u.order = null;
          continue;
        }
      }
      if (u.carrying > 0) {
        const base = nearest(
          u,
          alive(u.team).filter(
            (a) => (a.type === 'core' || a.type === 'relay') && !a.construction && supplied(a)
          )
        );
        if (base && move(u, base, dt, base.r + u.r + 8)) {
          if (u.cargoKind === 'materials') { if (!u.team) materials += u.carrying; else enemyMaterials += u.carrying; }
          else if (!u.team) ore += u.carrying * (benefits.has('pompadour') ? 1.25 : 1);
          else enemyBudget += u.carrying;
          u.carrying = 0;
          u.harvest = 0;
          if (u.orders?.length) completeOrder(u);
        }
      } else if (move(u, n, dt, harvestDistance(n)) && canHarvest(u, n)) {
        u.harvest += dt;
        if (u.harvest > 1.1) {
          const amount = Math.min(10, n.amount);
          n.amount -= amount;
          u.carrying += amount;
          u.cargoKind = n.kind || 'supplies';
          u.harvest = 0;
          if (u.orders?.length) completeOrder(u);
        }
      }
      continue;
    }
    if (u.order?.target && (u.order.target.hp <= 0 || !sees(u.team, u.order.target))) completeOrder(u);
    if (d.damage && u.order?.kind !== 'move') {
      let target = null;
      const range = weaponRange(u);
      const enemies = alive(1 - u.team).filter((a) => sees(u.team, a) && (!u.deployed || dist(u, a) >= SIEGE.minimum));
      if (u.order?.target?.hp > 0 && sees(u.team, u.order.target) && (!u.deployed || dist(u, u.order.target) >= SIEGE.minimum)) target = u.order.target;
      else
        target = nearest(
          u,
          enemies.filter((a) => dist(u, a) < range + a.r + (u.order?.kind === 'hold' || u.deployed ? 0 : 65))
        );
      if (target) {
        const distance = dist(u, target);
        if (inWeaponArc(u, target)) {
          if (u.cool === 0) shoot(u, target);
        } else if (d.speed && !artilleryLocked(u) && u.order?.kind !== 'hold')
          move(u, target, dt, range * 0.9 + target.r);
        continue;
      }
      if (u.order?.target && !sees(u.team, u.order.target)) u.order = null;
    }
    if (u.order && d.speed && Number.isFinite(u.order.x) && move(u, u.order, dt, 8)) {
      completeOrder(u);
    }
  }
  separate();
  for (const r of heroRecovery.filter((r) => r.at <= t)) {
    const base = alive(r.team).find((u) => u.type === 'core'),
      funds = r.team ? enemyBudget : ore;
    if (base && funds >= 100) {
      if (r.team) enemyBudget -= 100;
      else ore -= 100;
      add('hero', r.team, base.x - 80, base.y + 75, { name: r.name });
      r.done = true;
      say(r.name + ' has returned from the infirmary.');
    }
  }
  heroRecovery = heroRecovery.filter((r) => !r.done);
  enemyThink();
  fx.forEach((f) => (f.life -= dt));
  fx = fx.filter((f) => f.life > 0);
  units = units.filter((u) => u.hp > 0);
  if (!alive(1).some((u) => u.type === 'core')) finish(true);
  else if (!alive(0).some((u) => u.type === 'core')) finish(false);
  if (t - uiTime > 0.2) {
    updateUI();
    uiTime = t;
  }
}
function train(type) {
  if (!running || paused || ended) return;
  if (!defs[type] || !['worker','trooper','scout','sapper','walker'].includes(type)) return;
  if (!unitUnlocked(type)) return say('Complete Artillery Works to equip Field Sappers.');
  const b = readyProducers(type)[0];
  if (!b) return say('Select a ready production building. Research or full queues block recruitment.');
  if (ore < defs[type].cost) return say('Not enough supplies.');
  if (materials < materialCost(type)) return say('Not enough Materials. Staff a supplied quarry.');
  if (supply() >= cap()) return say('The town is full. Build a Village Home.');
  ore -= defs[type].cost;
  materials -= materialCost(type);
  b.queue.push(type);
  say(defs[type].name + ' queued.');
  updateUI(true);
}
function cancelRecruit(b, index) {
  if (!running || paused || ended || b.team !== 0 || b.hp <= 0 || !Number.isInteger(index) || index < 0 || index >= b.queue.length) return;
  const [type] = b.queue.splice(index, 1);
  ore += defs[type].cost;
  materials += materialCost(type);
  if (index === 0) b.progress = 0;
  say(defs[type].name + ' cancelled. Paid resources refunded.');
  updateUI(true);
}
function cancelConstruction(b) {
  if (!running || paused || ended || !b || b.team !== 0 || b.hp <= 0 || !b.construction) return;
  ore += (b.paid || 0) * .75;
  materials += (b.paidMaterials || 0) * .75;
  b.hp = 0;
  selected = selected.filter(u => u !== b);
  say('Construction cancelled. 75% of paid resources recovered.');
  updateUI(true);
}
function buildingCost(type) {
  return Math.ceil(defs[type].cost * (benefits.has('cornelius') ? 0.85 : 1));
}
function build(type) {
  if (!running || paused || ended) return;
  if (!prerequisite(type)) return say('Complete a Guard School before building Artillery Works.');
  if (materials < materialCost(type)) return say('Not enough Materials. Build and staff a quarry first.');
  if (ore < buildingCost(type)) return say('Not enough supplies.');
  placing = type;
  mode = null;
  say(type === 'quarry' ? 'Tap a marked Materials deposit near your supply line. Then assign provisioners with Gather.' : 'Tap open ground near your base to place ' + defs[type].name + '.');
  updateUI(true);
}
function validBuild(p, type, team = 0) {
  return (
    prerequisite(type, team) && (type !== 'quarry' || !!materialSite(p)) &&
    p.x > 60 &&
    p.y > 60 &&
    p.x < W - 60 &&
    p.y < H - 60 &&
    alive(team).some((u) => !defs[u.type].speed && !u.construction && dist(u, p) < 310) &&
    !solidAt(p.x, p.y, defs[type].r + 24) &&
    units.every((u) => u.hp <= 0 || dist(u, p) > u.r + defs[type].r + 12) &&
    nodes.every((n) => (type === 'quarry' && n === materialSite(p)) || dist(n, p) > defs[type].r + 35)
  );
}
function setMode(m) {
  if (!running || paused || ended) return;
  placing = null;
  mode = m;
  say(
    m === 'gather'
      ? 'Select provisioners, then tap a Supplies cache or Materials quarry.'
      : m === 'repair'
        ? 'Select provisioners, then tap a damaged building.'
        : 'Tap a destination or visible enemy for focus fire.'
  );
  updateUI(true);
}
function command(p, append = queueOrders) {
  if (!running || paused || ended) return;
  if (placing) {
    if (placing === 'quarry') { const deposit = materialSite(p); if (deposit) p = {x:deposit.x,y:deposit.y}; }
    if (!validBuild(p, placing))
      return say(placing === 'quarry' ? 'Choose an unoccupied Materials deposit near a friendly building.' : 'Choose clear ground within reach of a friendly building.');
    if (ore < buildingCost(placing) || materials < materialCost(placing)) return say('Not enough Supplies or Materials.');
    const available = alive(0).filter(w => w.type === 'worker' && w.order?.kind !== 'build');
    const builder = nearest(p, available.filter(w => selected.includes(w))) || nearest(p, available);
    if (!builder) return say('Construction needs a free provisioner. Recruit one or finish the current site.');
    let d = defs[placing];
    const paid = buildingCost(placing);
    ore -= paid;
    const paidMaterials = materialCost(placing); materials -= paidMaterials;
    const duration = d.build * (benefits.has('pom') ? 0.7 : 1);
    const site = add(placing, 0, p.x, p.y, { construction: duration, buildDuration: duration, paid, paidMaterials, hp: 1 });
    builder.returnToWork = builder.order?.kind === 'gather' ? builder.order : null;
    issueOrder(builder, { kind: 'build', target: site });
    say(d.name + ' construction started.');
    placing = null;
    updateUI(true);
    return;
  }
  if (mode === 'repair') {
    repairOrder(p, append);
    return;
  }
  let enemy = nearest(p, alive(1).filter(visible)),
    node = nearest(
      p,
      nodes.filter((n) => n.amount > 0)
    );
  if (enemy && dist(p, enemy) > enemy.r + 22) enemy = null;
  if (node && dist(p, node) > 40) node = null;
  const producers = selected.filter(u => ['core', 'forge', 'factory'].includes(u.type));
  for (const b of producers) b.rally = { x: clamp(p.x, 25, W - 25), y: clamp(p.y, 25, H - 25), node };
  if (producers.length) say('Production rally point set. Provisioners gather when rallied to supplies.');
  let movers = selected.filter((u) => defs[u.type].speed);
  movers.forEach((u, i) => {
    if (u.type === 'worker' && node) issueOrder(u, { kind: 'gather', node }, append);
    else if (mode === 'gather') return;
    else if (enemy && defs[u.type].damage) issueOrder(u, { kind: 'attack', target: enemy }, append);
    else {
      let cols = Math.ceil(Math.sqrt(movers.length)),
        ox = ((i % cols) - (cols - 1) / 2) * 40,
        oy = (Math.floor(i / cols) - (Math.ceil(movers.length / cols) - 1) / 2) * 40;
      issueOrder(u, {
        kind: mode === 'attack' ? 'attack' : 'move',
        x: clamp(p.x + ox, 25, W - 25),
        y: clamp(p.y + oy, 25, H - 25),
      }, append);
    }
  });
  if (movers.length) {
    fx.push({ x: p.x, y: p.y, life: 0.7, max: 0.7, ring: true });
    say(
      node
        ? (node.kind === 'materials' ? 'Materials gathering started. Keep the quarry supplied.' : 'Supplies gathering started.')
        : enemy
          ? 'Concentrate fire on the marked target.'
          : 'Orders confirmed.'
    );
  } else if (!producers.length) say('Select mobile units first.');
  mode = null;
  updateUI(true);
}
let actionKey = '';
function updateUI(force = false) {
  $('ore').textContent = Math.floor(ore);
  $('materials').textContent = Math.floor(materials);
  $('idle-workers').textContent = 'Idle ' + idleWorkers().length;
  $('supply').textContent = supply() + ' / ' + cap();
  $('clock').textContent = time(t);
  $('phase').textContent = 'Wave ' + (wave + 1) + ' in ' + time(Math.max(0, nextWave - t));
  const u = selected[0];
  const productionGroup = selected.length > 1 && selected.every(b => !defs[b.type].speed);
  $('selected-type').textContent =
    selected.length > 1
      ? (productionGroup ? 'PRODUCTION · ' : 'ELEPHANT ARMY · ') + selected.length + (productionGroup ? ' SITES' : ' UNITS')
      : u
        ? defs[u.type].speed
          ? 'ELEPHANT'
          : 'CELESTEVILLE'
        : 'NO SELECTION';
  $('selected-name').textContent =
    selected.length > 1
      ? (productionGroup ? 'Production group' : 'Royal elephant army')
      : u
        ? u.name || defs[u.type].name
        : 'Awaiting orders';
  $('selected-info').textContent = u
    ? selected.length > 1
      ? (productionGroup ? selected.reduce((n,b)=>n+b.queue.length,0) + ' queued · Recruitment uses the soonest available completion.' : 'Use Attack to engage enemies along the way.')
      : u.construction
        ? 'Construction · ' + Math.ceil(u.construction) + 's work remaining. Requires a provisioner on site.'
        : u.research
          ? researchDefs[u.research.id].name + ' · ' + Math.floor(100 * u.research.progress / researchDefs[u.research.id].time) + '% · recruitment suspended'
        : u.queue.length
          ? 'Training ' +
            defs[u.queue[0]].name +
            ' · ' +
            Math.ceil(defs[u.queue[0]].time - u.progress) +
            's · ' +
            u.queue.length +
            ' queued'
          : u.type === 'walker'
            ? (u.artilleryTransition ? (u.artilleryTransition.deploy ? 'Deploying' : 'Packing') + ' · ' + Math.ceil(u.artilleryTransition.until - t) + 's' : u.deployed ? 'Deployed: range 90–390m; splash hits allies. Move or Retreat packs the gun in 2s.' : 'Mobile gun. Deploy (D): 3s setup, 390m range and splash. Needs a scout and infantry screen.')
          : u.type === 'hero'
            ? 'Stand together: +20 morale and 25% less damage for nearby troops, for 8s.'
            : u.type === 'worker'
              ? (u.order?.node?.kind === 'materials' ? 'Quarry duty: ' + (quarryFor(u.order.node, 0) ? '3 extraction slots. Return Materials to a linked palace/home.' : 'WAITING: complete and supply a quarry on this deposit.') : 'Gathers Supplies (2 extraction slots per cache). Quarries yield Materials. Can build and repair.')
              : u.type === 'core'
                ? 'Invite gatherers and expand Celesteville.'
                : u.type === 'forge'
                  ? 'Trains guards and scouts. Volleys research: +20% infantry damage.'
                  : u.type === 'factory'
                    ? 'Trains artillery. Shell research: +25% gun damage. Screen guns with infantry.'
                    : u.type === 'quarry'
                      ? 'Materials: assign provisioners with Gather. 3 extraction slots; needs an unbroken supply link.'
                    : u.type === 'relay'
                      ? '+10 army supply.'
                      : defs[u.type].damage
                        ? 'Health ' +
                          Math.ceil(u.hp) +
                          ' / ' +
                          u.max +
                          ' · ' +
                          defs[u.type].damage +
                          ' strength'
                        : 'Ready for orders.'
    : 'Tap a friendly unit or building.';
  if (u && selected.length===1 && combatRole(u)) $('selected-info').textContent = combatRole(u);
  $('tactical-status').textContent = productionGroup ? selected.filter(supplied).length + '/' + selected.length + ' supplied sites · isolated production runs at 25%' : u
    ? defs[u.type].speed
      ? 'Morale ' +
        Math.ceil(u.morale) +
        ' / 100 · ' +
        (u.order?.kind || 'ready') + (u.type === 'hero' ? ` · Energy ${Math.floor(u.commandEnergy)}/100` : '') + ((u.disciplineUntil || 0) > t ? ' · PROTECTED' : '') + ((u.advanceUntil || 0) > t ? ' · ADVANCING' : '') + (weaponMultiplier(u) > 1 ? ' · WEAPONS UPGRADED' : '') + (u.orders?.length ? ` · ${u.orders.length} queued` : '') +
        (inCover(u) ? ' · IN COVER' : '')
      : supplied(u)
        ? 'Supply line operational'
        : 'ISOLATED · training at 25%. Link buildings within 360m; clear raiders.'
    : 'Hold a supply route and scout both approaches.';
  $('depot-status').textContent =
    'DEPOT ' +
    (depot.team === 0 ? 'OURS · +2/s' : depot.team === 1 ? 'RHINOS' : 'CONTESTED') +
    ' · Scout workers and production';
  $('health').firstElementChild.style.width = (u ? (u.hp / u.max) * 100 : 0) + '%';
  const key = unitUnlocked('sapper') + '-' + prerequisite('factory') + '-' + (u?.id || 'none') + '-' + selected.length + '-' + !!u?.construction + '-' + (u?.queue.join(',') || '') + '-' + (u?.research?.id || '') + '-' + [...technologies].join(',') + '-' + '-' + selected.filter(a => a.type === 'walker').map(a => (a.deployed ? 'D' : 'M') + (a.artilleryTransition ? Math.ceil(a.artilleryTransition.until - t) : '')).join(',') + (u?.type === 'hero' ? Math.ceil(Math.max(0, u.commandReadyAt - t)) : '');
  if (force || key !== actionKey) {
    actionKey = key;
    let a = [];
    if (u && !u.construction && selected.length === 1) {
      if (u.type === 'hero') a.push(['Babar: Stand together', Math.max(0, u.commandReadyAt - t) > 0 ? Math.ceil(u.commandReadyAt - t) + 's cooldown' : '50 energy · Q', () => commanderAbility(u)]);
      if (u.type === 'core') a.push(['Provisioner', '● 50', () => train('worker')]);
      if (u.type === 'forge') {
        a.push(['Elephant Guard', '60', () => train('trooper')]);
        a.push(['Forest Scout', '55', () => train('scout')]);
        a.push(['Field Sapper', unitUnlocked('sapper') ? '90 S · 20 M' : 'Needs Artillery Works', () => train('sapper'), !unitUnlocked('sapper')]);
      }
      if (u.type === 'factory') a.push(['Field Artillery', '160 S · 25 M', () => train('walker')]);
      if (u.type === 'core' || u.type === 'worker')
        for (const type of ['forge', 'relay', 'quarry', 'factory', 'turret'])
          a.push([defs[type].name, buildingCost(type) + ' S' + (materialCost(type) ? ' · ' + materialCost(type) + ' M' : ''), () => build(type), !prerequisite(type)]);
    }
    if (selected.length > 1) {
      for (const type of ['worker','trooper','scout','sapper','walker']) {
        const producers = selected.filter(b => b.team === 0 && b.type === producerFor(type) && !b.construction);
        if (producers.length) a.push([defs[type].name, defs[type].cost + ' S' + (materialCost(type) ? ' · ' + materialCost(type) + ' M' : '') + ' · ' + producers.length + ' sites', () => train(type), !unitUnlocked(type)]);
      }
    }
    const guns = selected.filter(a => a.team === 0 && a.type === 'walker');
    if (guns.length) {
      const transitioning = guns.every(a => a.artilleryTransition);
      a.push([transitioning ? 'Setting gun' : guns.some(a => !a.deployed && !a.artilleryTransition) ? 'Deploy artillery' : 'Pack artillery', transitioning ? Math.ceil(Math.max(...guns.map(g => g.artilleryTransition.until)) - t) + 's remaining' : 'D · 3s deploy / 2s pack', toggleArtillery, transitioning]);
    }
    if (u?.construction && selected.length === 1) a.push(['Cancel construction', '75% refund', () => cancelConstruction(u)]);
    if (u && selected.length === 1 && !u.construction) {
      for (const [id, tech] of Object.entries(researchDefs)) {
        if (u.type !== tech.building) continue;
        if (u.research?.id === id) a.push(['Cancel research', '75% refund', () => cancelResearch(u)]);
        else if (!technologies.has(id)) a.push([tech.name, tech.cost + ' S' + (tech.materials ? ' · ' + tech.materials + ' M' : '') + ' · ' + tech.time + 's', () => startResearch(id)]);
      }
    }
    if (u?.queue.length && selected.length === 1) {
      u.queue.forEach((type, index) => a.push([`Cancel ${index + 1}: ${defs[type].name}`, `Refund ${defs[type].cost}`, () => cancelRecruit(u, index)]));
    }
    const holder = $('actions');
    holder.replaceChildren();
    for (const [name, cost, fn, disabled] of a) {
      const b = document.createElement('button');
      b.innerHTML = '<span>' + name + '</span><small>' + cost + '</small>';
      b.onclick = fn;
      b.disabled = !!disabled;
      holder.appendChild(b);
    }
  }
  document
    .querySelectorAll('[data-mode]')
    .forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
}
function time(v) {
  return (
    String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(Math.floor(v % 60)).padStart(2, '0')
  );
}
function finish(win) {
  ended = true;
  running = false;
  const box = $('overlay');
  box.classList.remove('hidden');
  box.innerHTML =
    '<div class="brief"><p class="eyebrow">MISSION ' +
    (win ? 'COMPLETE' : 'LOST') +
    '</p><h1>' +
    (win ? 'Celesteville holds.' : 'The palace has fallen.') +
    '</h1><p>' +
    (win
      ? 'Rataxes’s command has broken. The fortress is secured. Bring the wounded home.'
      : 'The defense has collapsed. Regroup, protect your deliveries, and prepare another plan.') +
    '</p><p>Time ' +
    time(t) +
    ' · Enemy casualties ' +
    kills +
    ' · Waves ' +
    wave +
    '</p><div class="launch"><button id="again">Deploy again →</button></div></div>';
  $('again').onclick = () => location.reload();
}
function togglePause() {
  if (!running || ended) return;
  paused = !paused;
  $('pause').textContent = paused ? 'Resume' : 'Pause';
  say(paused ? 'Command paused.' : 'Command resumed.');
}
function selectArmy() {
  selected = alive(0).filter((u) => defs[u.type].damage && defs[u.type].speed);
  updateUI(true);
  say(selected.length + ' elephants selected.');
}
function goHome() {
  const base = alive(0).find((u) => u.type === 'core');
  if (base) {
    cam.x = base.x;
    cam.y = base.y;
    selected = [base];
    updateUI(true);
  }
}
function eventPoint(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
  if (e.button === 2) {
    e.preventDefault();
    command(world(eventPoint(e)), e.shiftKey || queueOrders);
    return;
  }
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {
    /* A canceled or synthetic pointer may have no capture slot. */
  }
  pointer = eventPoint(e);
  down = {
    ...pointer,
    id: e.pointerId,
    shift: e.shiftKey,
    pan: e.button === 1 || panMode,
    touch: e.pointerType === 'touch',
    cx: cam.x,
    cy: cam.y,
  };
});
canvas.addEventListener('pointermove', (e) => {
  pointer = eventPoint(e);
  if (down?.pan) {
    cam.x = down.cx - (pointer.x - down.x) / cam.zoom;
    cam.y = down.cy - (pointer.y - down.y) / cam.zoom;
  }
});
canvas.addEventListener('pointerup', (e) => {
  if (!down) return;
  const start = down;
  down = null;
  if (e.button !== 0 || !running || paused || ended) return;
  let p = eventPoint(e),
    wp = world(p),
    drag = Math.hypot(p.x - start.x, p.y - start.y) > 9;
  if (start.pan) return;
  if (mode || placing) {
    command(wp, start.shift || queueOrders);
    return;
  }
  if (drag) {
    let a = world(start);
    let group = alive(0).filter(
      (u) =>
        defs[u.type].speed &&
        u.x >= Math.min(a.x, wp.x) &&
        u.x <= Math.max(a.x, wp.x) &&
        u.y >= Math.min(a.y, wp.y) &&
        u.y <= Math.max(a.y, wp.y)
    );
    selected = start.shift ? [...new Set([...selected, ...group])] : group;
  } else {
    let u = nearest(wp, alive(0));
    if (u && dist(u, wp) < u.r + 18) {
      selected = start.shift ? [...new Set([...selected, u])] : [u];
    } else if (
      start.touch &&
      selected.length &&
      nearest(wp, nodes) &&
      dist(wp, nearest(wp, nodes)) < 40
    ) {
      command(wp);
    } else selected = [];
  }
  updateUI(true);
});
canvas.addEventListener('pointercancel', () => (down = null));
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const p = eventPoint(e),
      a = world(p);
    cam.zoom = clamp(cam.zoom * Math.exp(-e.deltaY * 0.001), 0.45, 1.8);
    const b = world(p);
    cam.x += a.x - b.x;
    cam.y += a.y - b.y;
  },
  { passive: false }
);
mini.addEventListener('pointerdown', (e) => {
  const r = mini.getBoundingClientRect();
  cam.x = ((e.clientX - r.left) / r.width) * W;
  cam.y = ((e.clientY - r.top) / r.height) * H;
});
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'SELECT') return;
  if ([' ', 'F2', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
    e.preventDefault();
  keys[e.key] = true;
  if (e.repeat) return;
  if ($('court-dialog').open || $('groups-dialog').open) return;
  if (/^[0-9]$/.test(e.key) || /^Digit[0-9]$/.test(e.code || '')) {
    e.preventDefault();
    controlGroup(e.code?.startsWith('Digit') ? e.code.slice(-1) : e.key, e.ctrlKey || e.metaKey, e.shiftKey);
    return;
  }
  if (e.key === ' ') togglePause();
  if (e.key === 'F2') selectArmy();
  if (e.key.toLowerCase() === 'h') goHome();
  if (e.key.toLowerCase() === 'i') selectIdleWorkers();
  if (e.key.toLowerCase() === 'd') toggleArtillery();
  if (e.key.toLowerCase() === 'q') commanderAbility(selected.find(u => u.type === 'hero'));
  if (e.key.toLowerCase() === 'a') setMode('attack');
  if (e.key.toLowerCase() === 'm') setMode('move');
  if (e.key.toLowerCase() === 'g') setMode('gather');
  if (e.key.toLowerCase() === 's') tacticalOrders('hold');
  if (e.key.toLowerCase() === 'r') tacticalOrders('retreat');
  if (e.key.toLowerCase() === 'e') setMode('repair');
  if (e.key === 'Escape') {
    mode = null;
    placing = null;
    updateUI(true);
  }
});
window.addEventListener('keyup', (e) => delete keys[e.key]);
window.addEventListener('blur', () => {
  keys = {};
  if (running && !paused) togglePause();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && running && !paused) togglePause();
});
$('idle-workers').onclick = () => selectIdleWorkers();
$('leader').onclick = () => {
  const b = alive(0).find((u) => u.type === 'hero');
  if (b) {
    selected = [b];
    cam.x = b.x;
    cam.y = b.y;
    updateUI(true);
  } else say('Babar is resting at the palace.');
};
$('zoom-in').onclick = () => (cam.zoom = clamp(cam.zoom * 1.2, 0.4, 1.8));
$('zoom-out').onclick = () => (cam.zoom = clamp(cam.zoom / 1.2, 0.4, 1.8));
$('pan').onclick = () => {
  panMode = !panMode;
  $('pan').setAttribute('aria-pressed', String(panMode));
  say(panMode ? 'Drag to move the map.' : 'Drag to select your elephants.');
};
$('start').onclick = () => {
  easy = $('difficulty').value === 'easy';
  startAudio();
  reset();
  running = true;
  $('overlay').classList.add('hidden');
  say('Rataxes is advancing. Secure the depot and protect the palace.');
};
$('pause').onclick = togglePause;
$('army').onclick = selectArmy;
$('home').onclick = goHome;
$('stop').onclick = () => tacticalOrders('hold');
$('retreat').onclick = () => tacticalOrders('retreat');
document
  .querySelectorAll('[data-mode]')
  .forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
$('restart').onclick = () => {
  if (confirm('Restart this mission? Current progress will be lost.')) location.reload();
};
$('help').onclick = () => {
  if (running && !paused) togglePause();
  $('help-dialog').showModal();
};
$('help-close').onclick = () => $('help-dialog').close();

$('groups-open').onclick = () => {
  if (!running || ended) return;
  const wasPaused = paused;
  paused = true;
  const holder = $('group-actions');
  holder.replaceChildren();
  for (let i = 1; i <= 4; i++) {
    const count = alive(0).filter(u => (controlGroups[i] || []).includes(u.id)).length;
    for (const save of [false, true]) {
      const button = document.createElement('button');
      button.textContent = save ? `Assign selection to ${i}` : `Select group ${i} · ${count}`;
      button.onclick = () => {
        $('groups-dialog').close();
        paused = false;
        controlGroup(i, save);
        paused = wasPaused;
      };
      holder.appendChild(button);
    }
  }
  $('groups-dialog').onclose = () => { paused = wasPaused; };
  $('groups-dialog').showModal();
};
$('groups-close').onclick = () => $('groups-dialog').close();

$('queue-orders').onclick = () => { queueOrders = !queueOrders; $('queue-orders').setAttribute('aria-pressed', String(queueOrders)); say(queueOrders ? 'Queue enabled: destinations append to current orders (up to 16).' : 'New orders replace the current route.'); };
