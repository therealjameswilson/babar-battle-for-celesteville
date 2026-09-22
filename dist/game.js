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
  headquarters: { name: 'Field Headquarters', hp: 1100, r: 38, cost: 400, build: 30 },
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
  dist = (a, b) => Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)),
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
              : u.type === 'headquarters' ? 10 : u.type === 'relay'
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
  hydrogen: {name:'H-bomb command',building:'factory',requires:'atomic',cost:1000,materials:350,time:120,description:'After Atomic command: unlock H-bomb assembly (1000 Supplies, 350 Materials, 80 Uranium, 110s). Larger 230m blast; 28s warning and friendly fire. Shares the atomic payload limit.'},
  atomic: {name:'Atomic command',building:'factory',requires:'shells',requiresAlso:'armor2',cost:800,materials:300,time:90,description:'Unlock assembly of one atomic bomb per faction at supplied Artillery Works. Assembly: 650 Supplies, 200 Materials, 40 Uranium, 75s. Launch: 18s warning, friendly fire.'},
  rapid: { name: 'Rapid advance doctrine', building:'forge', requires:'drill', cost:180, materials:60, time:35,
    description:'Unlock V for guards, scouts and sappers: +30% speed, 30% shorter firing interval for 6s. Costs 20 health each; 24s cooldown.' },
  armor: { name: 'Field protection I', building: 'forge', cost: 140, materials: 40, time: 30,
    description: 'Guards, scouts and sappers absorb 2 damage per hit. Does not prevent suppression.' },
  armor2: { name: 'Field protection II', building: 'forge', cost: 220, materials: 80, time: 45,
    requires: 'armor', requiresBuilding: 'factory',
    description: 'Requires Field protection I and completed Artillery Works. Infantry absorbs 4 damage per hit in total.' },
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
  const missing = researchRequirement(id,0);
  if (missing) return say(missing);
  const b = selected.find(u => u.team === 0 && u.hp > 0 && u.type === tech.building && !u.construction);
  if (!b || b.research || b.atomicJob || b.queue.length) return say('Research needs an idle production building.');
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
    u.resolvedDestination = null;
    u.orders = [];
    u.followup = null;
    u.path = null;
  }
}
function completeOrder(u) {
  u.resolvedDestination = null;
  if (u.order?.kind === 'patrol' && !u.orders?.length && u.order.returnPoint) {
    const leg=u.order;
    u.order={kind:'patrol',x:leg.returnPoint.x,y:leg.returnPoint.y,returnPoint:{x:leg.x,y:leg.y}};
    u.path=null;
    return;
  }
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
  resetSimulationClock();
  minimapGesture = null;
  technologies = new Set(); enemyTechnologies = new Set();
  attackReports=[];attackCursor=0;attackToneAt=-100;
  controlGroups = {};
  queueOrders = false;
  $('queue-orders').setAttribute('aria-pressed', 'false');
  enemyScoutSent = false;
  enemyReconNextAt = 22;
  sightAt = -1;
  sightCount = -1;
  solidCacheAt = -1;
  depot = { x: 950, y: 830, r: 65, team: -1, progress: 0 };
  enemyBudget = easy ? 480 : 650;
  enemySpent = 0;
  enemyResourceReports = new Map(); enemyThreatReports = new Map();
  linked = new Set();
  intel = [[], []];
  navStamp = '';
  supplyClock = 0;
  logbook = [];
  navStats = { searches: 0, expanded: 0 };
  uid = 0;
  units = [];
  nodes = [];
  resourceMemory=[new Map(),new Map()];
  fx = [];
  selected = [];
  resetSubgroups();
  resetCameraViews();
  closeProduction();
  ore = 300;
  materials = 0; enemyMaterials = 60; uranium = enemyUranium = 0; munitions = MUNITIONS.start; atomicStrikes=[];atomicTargetSite=null;atomicAIAt=0;
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
  for (const [x,y] of [[560,1160],[950,700],[1200,550]]) nodes.push({x,y,r:24,amount:120,kind:'uranium'});
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
  observeResources();
  selected = [units[0]];
  $('pan').setAttribute('aria-pressed', 'false');
  $('pause').textContent = 'Pause';
  updateAttackAlert();
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
  const rawDamage = (baseDamage + counterBonus(u,v)) * scale * weaponMultiplier(u) * ((u.heavyRoundsUntil||0)>t?1.5:1) *
    (u.team === 1 && easy ? 0.7 : 1) * (inCover(v) ? 0.65 : 1) *
    ((v.disciplineUntil || 0) > t ? 0.75 : 1) *
    (u.type === 'walker' && !defs[v.type].speed ? 1.8 : 1);
  const damage = Math.max(Math.min(rawDamage, 1), rawDamage - infantryArmor(v));
  v.hp -= damage;
  if(damage>0)recordAttack(u,v);
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
  if (!firePermission(u,v) || u.hp <= 0 || v.hp <= 0 || u.artilleryTransition || !inWeaponArc(u, v) || !sees(u.team, v)) return false;
  const d = defs[u.type];
  u.cool = (u.deployed ? SIEGE.rate : d.rate) * (u.morale < 45 ? 1.5 : 1) * (rapidActive(u)?RAPID_ADVANCE.interval:1);
  u.angle = Math.atan2(v.y - u.y, v.x - u.x);
  u.firedAt = t;
  u.firedAngle = u.angle; // Preserve shot bearing for the brief presentation pose.
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
  observeResources();
  updateTactics(dt);
  updateMunitions(dt);
  updateAtomic(dt);
  updateAttackAlert();
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
      u.research.progress += dt * productionRate(u,true);
      if (u.research.progress >= researchDefs[u.research.id].time) {
        factionResearch(u.team).add(u.research.id);
        if (u.team===0) say(researchDefs[u.research.id].name + ' ready. ' + researchDefs[u.research.id].description);
        else if (visible(u)) say('Rhino research completed at this production site.');
        u.research = null;
        updateUI(true);
      }
    }
    if (u.queue.length && !u.research && !populationBlocked(u.team)) {
      u.progress +=
        dt * productionRate(u);
      const type = u.queue[0];
      if (u.progress >= defs[type].time) {
        let q = { x: u.x + u.r + 38, y: u.y + 45 };
        if (solidAt(q.x, q.y, defs[type].r)) q = point(freeCell(q));
        let n = add(type, u.team, q.x, q.y);
        if (type === 'worker')
          n.order = {
            kind: 'gather',
            node: nextKnownResource(n),
          };
        if (u.rally) {
          n.order = type === 'worker' && u.rally.node && knownResourceAmount(u.rally.node,u.team)!==0
            ? { kind: 'gather', node: u.rally.node }
            : { kind: 'move', x: u.rally.x, y: u.rally.y };
        }
        if(u.team===1&&type==='scout'&&!alive(1).some(s=>s!==n&&s.recon)){enemyScoutSent=true;n.recon=true;enemyReconThink();}
        u.queue.shift();
        u.progress = 0;
        if (u.team === 0) say(defs[type].name + ' ready.');
      }
    }
    if (u.type === 'worker' && u.order?.kind === 'build') {
      const site = u.order.target;
      if (!site || site.hp <= 0 || !site.construction) {
        finishConstructionOrder(u);
      } else move(u, site, dt, site.r + u.r + 8);
      continue;
    }
    if (u.order?.kind === 'retreat') {
      if (move(u, u.order, dt, 14)) { completeOrder(u); if(!u.order)u.order={kind:'hold'}; }
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
      if ((!n || knownResourceAmount(n,u.team) === 0) && u.carrying === 0) {
        n = nextKnownResource(u,n?.kind||'supplies');
        u.order.node = n;
        if (!n) {
          completeOrder(u);
          continue;
        }
      }
      if(!u.carrying&&u.orders?.length&&((n.kind==='materials'&&!quarryFor(n,u.team))||(n.kind==='uranium'&&!uraniumAccess(u.team)))){
        completeOrder(u);
        continue;
      }
      if (u.carrying > 0) {
        const base = nearest(
          u,
          alive(u.team).filter(
            (a) => deliveryBase(a) && !a.construction && supplied(a)
          )
        );
        if (base && move(u, base, dt, base.r + u.r + 8)) {
          if (u.cargoKind === 'uranium') { if (!u.team) uranium += u.carrying; else enemyUranium += u.carrying; base.deliveredUranium=(base.deliveredUranium||0)+u.carrying; }
          else if (u.cargoKind === 'materials') { if (!u.team) materials += u.carrying; else enemyMaterials += u.carrying; base.deliveredMaterials=(base.deliveredMaterials||0)+u.carrying; }
          else {
            const credited=u.carrying*(!u.team&&benefits.has('pompadour')?1.25:1);
            if(!u.team)ore+=credited;else enemyBudget+=credited;
            base.deliveredSupplies=(base.deliveredSupplies||0)+credited;
          }
          u.carrying = 0;
          u.harvest = 0;
          if (u.orders?.length) completeOrder(u);
        }
      } else if (move(u, n, dt, harvestDistance(n)) && canHarvest(u, n)) {
        u.harvest += dt;
        if (u.harvest > (n.kind==='uranium'?3:1.1)) {
          const amount = Math.min(n.kind==='uranium'?4:10, n.amount);
          n.amount -= amount;
          u.carrying += amount;
          u.cargoKind = n.kind || 'supplies';
          u.harvest = 0;
          if (u.orders?.length) completeOrder(u);
        }
      }
      continue;
    }
    if (u.order?.kind==='patrol'&&!u.order.returnPoint) u.order.returnPoint={x:u.x,y:u.y};
    if (u.order?.target && (u.order.target.hp <= 0 || !sees(u.team, u.order.target))) completeOrder(u);
    if (d.damage && u.order?.kind !== 'move' && firePermission(u)) {
      let target = null;
      const range = weaponRange(u);
      const enemies = alive(1 - u.team).filter((a) => sees(u.team, a) && (!u.deployed || dist(u, a) >= SIEGE.minimum));
      if (u.order?.target?.hp > 0 && sees(u.team, u.order.target) && (!u.deployed || dist(u, u.order.target) >= SIEGE.minimum)) target = u.order.target;
      else
        target = nearest(
          u,
          enemies.filter((a) => !u.holdFire && dist(u, a) < range + a.r + (u.order?.kind === 'hold' || u.deployed ? 0 : 65))
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
    if (base && funds >= 100 && !populationBlocked(r.team)) {
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
  removeConstructionOrders(b);
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
  say(type === 'headquarters' ? 'Establish a supply base on clear ground currently seen by your forces. '+buildingCost(type)+' Supplies; protect the builder.' : type === 'quarry' ? 'Tap a marked Materials deposit near your supply line. Then assign provisioners with Gather.' : 'Tap open ground near your base to place ' + defs[type].name + '.');
  updateUI(true);
}
function validBuild(p, type, team = 0) {
  return (
    prerequisite(type, team) && (type !== 'quarry' || !!materialSite(p)) &&
    p.x > 60 &&
    p.y > 60 &&
    p.x < W - 60 &&
    p.y < H - 60 &&
    (type==='headquarters' ? observesPosition(team,p) : alive(team).some((u) => !defs[u.type].speed && !u.construction && dist(u, p) < 310)) &&
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
    m === 'patrol' ? 'Tap the far end of a repeating patrol. Engage visible enemies, then resume. Queued orders exit at the next endpoint.' : m === 'gather'
      ? 'Select provisioners, then tap a Supplies cache or Materials quarry.'
      : m === 'repair'
        ? 'Select provisioners, then tap a damaged building.'
        : 'Tap a destination or visible enemy for focus fire.'
  );
  updateUI(true);
}
function command(p, append = queueOrders) {
  if (!running || paused || ended) return;
  if(mode==='atomic'){
    if(launchAtomic(atomicTargetSite,p)){mode=null;atomicTargetSite=null;}
    else say('Atomic launch needs a supplied, ready Works and a currently visible target.');
    return;
  }
  if (placing) {
    if (placing === 'quarry') { const deposit = materialSite(p); if (deposit) p = {x:deposit.x,y:deposit.y}; }
    if (!validBuild(p, placing))
      return say(placing === 'headquarters' ? 'Scout clear ground first. Keep the headquarters footprint away from units, resources and obstacles.' : placing === 'quarry' ? 'Choose an unoccupied Materials deposit near a friendly building.' : 'Choose clear ground within reach of a friendly building.');
    if (ore < buildingCost(placing) || materials < materialCost(placing)) return say('Not enough Supplies or Materials.');
    const builder=constructionWorker(p,append);
    if(!builder)return say(append?'Select a provisioner with room in its 16-order queue.':'Construction needs a free provisioner. Recruit one or finish the current site.');
    let d = defs[placing];
    const paid = buildingCost(placing);
    ore -= paid;
    const paidMaterials = materialCost(placing); materials -= paidMaterials;
    const duration = d.build * (benefits.has('pom') ? 0.7 : 1);
    const site = add(placing, 0, p.x, p.y, { construction: duration, buildDuration: duration, paid, paidMaterials, hp: 1 });
    builder.returnToWork=builder.order?.kind==='gather'?builder.order:append&&builder.order?.kind==='build'?builder.returnToWork:null;
    issueOrder(builder,{kind:'build',target:site},append);
    say(d.name+(builder.order?.target===site?' construction started.':' foundation paid. Provisioner will build after earlier orders.'));
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
      nodes.filter((n) => knownResourceAmount(n,0)>0)
    );
  if (enemy && dist(p, enemy) > enemy.r + 22) enemy = null;
  if (node && dist(p, node) > 40) node = null;
  const producers = selected.filter(u => mode !== 'patrol' && ['core', 'headquarters', 'forge', 'factory'].includes(u.type));
  for (const b of producers) b.rally = { x: clamp(p.x, 25, W - 25), y: clamp(p.y, 25, H - 25), node };
  if (producers.length) say('Production rally point set. Provisioners gather when rallied to supplies.');
  let movers = selected.filter((u) => defs[u.type].speed);
  movers.forEach((u, i) => {
    if (mode !== 'patrol' && u.type === 'worker' && node) issueOrder(u, { kind: 'gather', node }, append);
    else if (mode === 'gather') return;
    else if (mode !== 'patrol' && enemy && defs[u.type].damage) issueOrder(u, { kind: 'attack', target: enemy, forceFire: true }, append);
    else {
      let cols = Math.ceil(Math.sqrt(movers.length)),
        ox = ((i % cols) - (cols - 1) / 2) * 40,
        oy = (Math.floor(i / cols) - (Math.ceil(movers.length / cols) - 1) / 2) * 40;
      issueOrder(u, {
        kind: mode === 'patrol' ? 'patrol' : mode === 'attack' ? 'attack' : 'move',
        x: clamp(p.x + ox, 25, W - 25),
        y: clamp(p.y + oy, 25, H - 25),
      }, append);
    }
  });
  if (movers.length) {
    fx.push({ x: p.x, y: p.y, life: 0.7, max: 0.7, ring: true });
    say(
      mode === 'patrol' ? 'Patrol established. Units engage visible threats and return to their route.' : node
        ? (node.kind === 'uranium' ? 'Uranium duty assigned. Requires completed Artillery Works; deliver cargo to a linked base.' : node.kind === 'materials' ? 'Materials gathering started. Keep the quarry supplied.' : 'Supplies gathering started.')
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
  renderSubgroups();
  renderProduction();
  $('ore').textContent = Math.floor(ore);
  $('materials').textContent = Math.floor(materials);
  $('uranium').textContent = Math.floor(uranium);
  $('munitions').textContent = Math.floor(munitions) + '/100';
  $('munitions-stock').title = 'Munitions: '+(munitionsIncome()?'+0.5/s from depot':'no depot income')+'. Pack 20 for 60 Supplies + 20 Materials at a supplied Guard School or Artillery Works.';
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
        ? productionReport(u).text
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
            ? 'Fighter · 24 damage / 0.85s · 100m. Fight chooses a target; Royal strike deals 60 damage for 35 energy. Q protects nearby troops.'
            : u.type === 'worker'
              ? (u.order?.node?.kind === 'uranium' ? 'Uranium duty: Artillery Works required. Two extraction slots; 4 U per 3s. Deliver to a linked base.' : u.order?.node?.kind === 'materials' ? 'Quarry duty: ' + (quarryFor(u.order.node, 0) ? '3 extraction slots. Return Materials to a headquarters or linked palace/home.' : 'WAITING: complete and supply a quarry on this deposit.') : 'Gathers Supplies (2 extraction slots per cache). Quarries yield Materials. Can build and repair.')
              : u.type === 'core'
                ? 'Invite gatherers and expand Celesteville.'
                : u.type === 'headquarters'
                  ? headquartersSummary(u)
                : u.type === 'forge'
                  ? 'Trains infantry. Choose weapons or field protection research; research suspends recruitment at this school.'
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
  if(u && selected.length===1 && u.queue.length && !u.research && !u.construction && populationBlocked(u.team)) $('selected-info').textContent='POPULATION BLOCKED · Build a Village Home. Paid queue and training progress are retained.';
  if (u && selected.length===1 && u.type!=='walker' && combatRole(u)) $('selected-info').textContent = combatRole(u);
  $('tactical-status').textContent = productionGroup ? selected.filter(supplied).length + '/' + selected.length + ' supplied sites · isolated production runs at 25%' : u
    ? defs[u.type].speed
      ? 'Morale ' +
        Math.ceil(u.morale) +
        ' / 100 · ' +
        (u.order?.kind || 'ready') + (u.type === 'hero' ? ` · Energy ${Math.floor(u.commandEnergy)}/100` : '') + ((u.disciplineUntil || 0) > t ? ' · PROTECTED' : '') + ((u.advanceUntil || 0) > t ? ' · ADVANCING' : '') + (weaponMultiplier(u) > 1 ? ' · WEAPONS UPGRADED' : '') + (infantryArmor(u) ? ` · ARMOR −${infantryArmor(u)}/hit` : '') + (rapidActive(u)?` · RAPID ${Math.ceil(u.rapidUntil-t)}s`:'') + (u.orders?.length ? ` · ${u.orders.length} queued` : '') +
        (inCover(u) ? ' · IN COVER' : '')
      : u.construction
        ? 'Paid foundation · Repair assigns a replacement builder; cancel refunds 75%.'
      : supplied(u)
        ? (u.type==='headquarters'?'Independent supply base':'Supply line operational')
        : 'ISOLATED · training at 25%. Link buildings within 360m; clear raiders.'
    : 'Hold a supply route and scout both approaches.';
  if(selected.length>1&&selected.every(w=>w.type==='worker')){
    $('selected-type').textContent=`SUPPLY DETAIL · ${selected.length} PROVISIONERS`;
    $('selected-name').textContent='Provisioners';
  }
  const battery=selected.length&&selected.every(s=>s.type==='walker');
  if(battery){
    if(selected.length>1)$('selected-name').textContent='Artillery battery';
    $('selected-info').textContent=batterySummary(selected);
    $('tactical-status').textContent=`${selected.length>1?'Lowest morale':'Morale'} ${Math.ceil(Math.min(...selected.map(g=>g.morale)))} · Siege 90–390m · 3s deploy / 2s pack · Splash also hits allies.`;
  }
  const workNode=selectionResource();
  $('selected-info').classList.toggle('economy-info',!!workNode||!!u?.construction||!!battery||u?.type==='headquarters');
  if(workNode){
    const report=resourceWorkReport(workNode);
    $('selected-info').textContent=resourceWorkSummary(workNode,report)+(report.reason?' · '+report.reason:'');
    $('tactical-status').textContent=`${report.hauling} hauling · ${report.approaching} approaching · ${report.waiting} waiting nearby`+
      (u.type==='worker'?` · Morale ${Math.ceil(u.morale)}${u.orders?.length?' · '+u.orders.length+' queued':''}`:'')+
      (report.state==='working'&&report.waiting?' · Extra workers may help delivery travel; spread waiting workers to another site.':'');
  }else if(selected.length&&selected.every(w=>w.type==='worker')){
    $('selected-info').textContent='Provisioners gather, deliver, construct and repair. Assign Gather to a Supplies cache or Materials Quarry.';
  }
  if(selected.length===1&&u){
    if((u.heavyRoundsUntil||0)>t)$('tactical-status').textContent+=' · Heavy rounds '+Math.ceil(u.heavyRoundsUntil-t)+'s';
    if((u.disciplineUntil||0)>t)$('tactical-status').textContent+=' · Protected '+Math.ceil(u.disciplineUntil-t)+'s';
  }
  const fireStatus = fireDisciplineSummary();
  if (fireStatus) $('tactical-status').textContent += ' · ' + fireStatus;
  $('depot-status').textContent =
    'DEPOT ' +
    (depot.team === 0 ? 'OURS · +2/s' : depot.team === 1 ? 'RHINOS' : 'CONTESTED') +
    ' · MU '+(munitionsIncome()?'+0.5/s':'STOPPED')+(atomicStrikes.length?' · '+atomicStrikes.map(s=>payloadLabel(s.kind)+' '+Math.ceil(Math.max(0,s.at-t))+'s').join(' / '):'');
  $('health').firstElementChild.style.width = (u ? (u.hp / u.max) * 100 : 0) + '%';
  const key = selected.map(a=>a.id).join(',') + '-' + unitUnlocked('sapper') + '-' + prerequisite('factory') + '-' + (u?.id || 'none') + '-' + selected.length + '-' + !!u?.construction + '-' + (u?.queue.join(',') || '') + '-' + (u?.research?.id || '') + '-' + [...technologies].join(',') + '-' + '-' + selected.filter(a => a.type === 'walker').map(a => (a.deployed ? 'D' : 'M') + (a.artilleryTransition ? Math.ceil(a.artilleryTransition.until - t) : '')).join(',') + (u?.type === 'hero' ? Math.ceil(Math.max(0, u.commandReadyAt - t)) : '');
  const rapidKey=selected.filter(rapidInfantry).map(u=>`${u.id}:${rapidReady(u)}:${Math.ceil(Math.max(0,(u.rapidReadyAt||0)-t))}`).join(',');
  const disciplineKey=selected.map(u=>u.holdFire?'H':'F').join('') + selected.filter(u=>u.type==='hero').map(u=>Math.ceil(Math.max(0,(u.strikeReadyAt||0)-t))+':'+(u.commandEnergy>=35)).join(',');
  const munKey=(uranium>=40)+':'+(uranium>=80)+':'+selected.map(b=>[!!b.atomicReady,Math.ceil(b.atomicJob?.progress||0),atomicBusy(b.team)].join(':')).join(',')+':'+(ore>=650)+':'+(materials>=200)+':'+(ore>=1000)+':'+(materials>=350)+Math.floor(munitions)+':'+(ore>=60)+':'+(materials>=20)+':'+selected.map(v=>[Math.ceil(Math.max(0,(v.munitionsReadyAt||0)-t)),(v.heavyRoundsUntil||0)>t,(v.disciplineUntil||0)>t,supplied(v)].join(',')).join(';');
  if (force || key + rapidKey + disciplineKey + munKey !== actionKey) {
    actionKey = key + rapidKey + disciplineKey + munKey;
    let a = [];
    munitionsActions(a,u);
    atomicActions(a,u);
    const armed = selected.filter(u=>u.team===0&&fireDisciplineUnit(u));
    if(armed.length) a.push([armed.every(u=>u.holdFire)?'Weapons free':'Hold fire','C · '+armed.filter(u=>u.holdFire).length+'/'+armed.length+' holding fire',toggleFireDiscipline]);
    const infantry=selected.filter(u=>u.team===0&&rapidInfantry(u));
    if(infantry.length){
      const ready=infantry.filter(rapidReady).length;
      const cooldown=Math.ceil(Math.max(0,Math.min(...infantry.map(u=>(u.rapidReadyAt||0)-t))));
      a.push(['Rapid advance',technologies.has('rapid')?`V · ${ready}/${infantry.length} ready · 20 health · 6s burst${cooldown?' · '+cooldown+'s cooldown':''}`:'Research Rapid advance doctrine at a Guard School',rapidAdvance,!ready]);
    }
    if (u && !u.construction && selected.length === 1) {
      if (u.type === 'hero') {
        a.push(['Fight','Tap enemy to focus fire · tap ground to advance',()=>heroFight(u)]);
        a.push(['Royal strike',t<(u.strikeReadyAt||0)?Math.ceil(u.strikeReadyAt-t)+'s cooldown':'F · 35 energy · 60 damage · 100m',()=>royalStrike(u),u.commandEnergy<35||t<(u.strikeReadyAt||0)]);
      }
      if (u.type === 'hero') a.push(['Babar: Stand together', Math.max(0, u.commandReadyAt - t) > 0 ? Math.ceil(u.commandReadyAt - t) + 's cooldown' : '50 energy · Q', () => commanderAbility(u)]);
      if (workerProducer(u)) a.push(['Provisioner', '● 50', () => train('worker')]);
      if (u.type === 'forge') {
        a.push(['Elephant Guard', '60', () => train('trooper')]);
        a.push(['Forest Scout', '55', () => train('scout')]);
        a.push(['Field Sapper', unitUnlocked('sapper') ? '90 S · 20 M' : 'Needs Artillery Works', () => train('sapper'), !unitUnlocked('sapper')]);
      }
      if (u.type === 'factory') a.push(['Field Artillery', '160 S · 25 M', () => train('walker')]);
    }
    if(u&&!u.construction&&((selected.length===1&&workerProducer(u))||selected.every(w=>w.team===0&&w.type==='worker')))
      for(const type of ['forge','relay','quarry','factory','turret','headquarters'])
        a.push([defs[type].name,buildingCost(type)+' S'+(materialCost(type)?' · '+materialCost(type)+' M':''),()=>build(type),!prerequisite(type)]);
    if (selected.length > 1) {
      for (const type of ['worker','trooper','scout','sapper','walker']) {
        const producers = selected.filter(b => b.team === 0 && produces(b,type) && !b.construction);
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
        else if (!technologies.has(id)) {
          const missing=researchRequirement(id,0);
          a.push([tech.name, missing || tech.cost + ' S' + (tech.materials ? ' · ' + tech.materials + ' M' : '') + ' · ' + tech.time + 's · ' + tech.description, () => startResearch(id), !!missing]);
        }
      }
    }
    if (u?.queue.length && selected.length === 1) {
      u.queue.forEach((type, index) => a.push([`Cancel ${index + 1}: ${defs[type].name}`, `Refund ${defs[type].cost}`, () => cancelRecruit(u, index)]));
    }
    if (u && selected.every(member => member.team === 0 && member.type === u.type))
      a.push(['Same type', 'Select matching units or buildings on screen', () => selectOnscreenType(u)]);
    const holder = $('actions');
    holder.replaceChildren();
    for (const [name, cost, fn, disabled] of a) {
      const b = document.createElement('button');
      b.innerHTML = '<span>' + name + '</span><small>' + cost + '</small>';
      if (['Hold fire','Weapons free','Rapid advance'].includes(name)||Object.values(researchDefs).some(tech=>tech.name===name)) b.className='research-action';
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
  closeCameraViews();
  closeProduction();
  ended = true;
  running = false;
  updateAttackAlert();
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
  resetSimulationClock();
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
    typeSelect: e.ctrlKey || e.metaKey,
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
      if (start.typeSelect) selectOnscreenType(u, start.shift);
      else clickSelection(u, start.shift);
      if(start.touch&&!defs[u.type].speed)document.querySelector('#phone-tabs [data-panel="actions"]')?.click();
    } else if (
      start.touch && selected.length
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
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'SELECT') return;
  if (cameraViewKey(e)) return;
  if ([' ', 'F2', 'F3', 'F4', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
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
  if (e.key === 'F3') jumpToAttack();
  if (e.key === 'F4') toggleProduction();
  if (e.key.toLowerCase() === 'h') goHome();
  if (e.key.toLowerCase() === 'i') selectIdleWorkers();
  if (e.key.toLowerCase() === 't') cycleSubgroup(e.shiftKey);
  if (e.key.toLowerCase() === 'd') toggleArtillery();
  if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey && !['INPUT','TEXTAREA'].includes(e.target.tagName) && !e.target.isContentEditable) royalStrike(selected.find(u=>u.type==='hero'));
  if (e.key.toLowerCase() === 'q') commanderAbility(selected.find(u => u.type === 'hero'));
  if (e.key.toLowerCase() === 'a') setMode('attack');
  if (e.key.toLowerCase() === 'm') setMode('move');
  if (e.key.toLowerCase() === 'p') setMode('patrol');
  if (e.key.toLowerCase() === 'v') rapidAdvance();
  if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey && !['INPUT','TEXTAREA'].includes(e.target.tagName) && !e.target.isContentEditable) toggleFireDiscipline();
  if (e.key.toLowerCase() === 'g') setMode('gather');
  if (e.key.toLowerCase() === 's') tacticalOrders('hold');
  if (e.key.toLowerCase() === 'r') tacticalOrders('retreat');
  if (e.key.toLowerCase() === 'e') setMode('repair');
  if (e.key === 'Escape') {
    closeCameraViews();
    closeProduction();
    mode = null;
    placing = null;
    updateUI(true);
  }
});
window.addEventListener('keyup', (e) => delete keys[e.key]);
window.addEventListener('blur', () => {
  keys = {};
  // Focus can move during Safari touch interaction. Only actual page hiding pauses.
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
let helpWasPaused = false;
$('help').onclick = () => {
  helpWasPaused = paused;
  if (running && !paused) togglePause();
  $('help-dialog').showModal();
};
$('help-close').onclick = () => $('help-dialog').close();
$('help-dialog').addEventListener('close', () => {
  if (running && !ended && !helpWasPaused && paused) togglePause();
});

$('groups-open').onclick = () => {
  if (!running || ended) return;
  const wasPaused = paused;
  paused = true;resetSimulationClock();
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
  $('groups-dialog').onclose = () => { paused = wasPaused;resetSimulationClock(); };
  $('groups-dialog').showModal();
};
$('groups-close').onclick = () => $('groups-dialog').close();

$('queue-orders').onclick = () => { queueOrders = !queueOrders; $('queue-orders').setAttribute('aria-pressed', String(queueOrders)); say(queueOrders ? 'Queue enabled: destinations append to current orders (up to 16).' : 'New orders replace the current route.'); };
