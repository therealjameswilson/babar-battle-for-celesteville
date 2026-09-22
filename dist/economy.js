'use strict';
let materials = 0, enemyMaterials = 60, uranium = 0, enemyUranium = 0;
function uraniumAccess(team) { return alive(team).some(b=>b.type==='factory'&&!b.construction); }
function resourceName(n) { return n.kind==='uranium'?'Uranium':n.kind==='materials'?'Materials':'Supplies'; }
let resourceMemory = [new Map(), new Map()];
function observesResource(team, n) {
  return (team===0 && t<revealUntil) || alive(team).some(u=>dist(u,n)<vision(u));
}
function observeResources() {
  const observers=[alive(0),alive(1)];
  for(let team=0;team<2;team++) for(const n of nodes)
    if((team===0&&t<revealUntil)||observers[team].some(u=>dist(u,n)<vision(u)))
      resourceMemory[team].set(n,n.amount);
}
function knownResourceAmount(n, team) {
  if(!n)return undefined;
  // A current sighting supersedes memory, including extraction earlier this tick.
  if(observesResource(team,n)) return n.amount;
  return resourceMemory[team].get(n);
}
function resourceLabel(n) {
  const amount=knownResourceAmount(n,0);
  return amount===undefined?'?':(resourceObserved(n)?'':'~')+Math.ceil(amount);
}
function nextKnownResource(u, kind='supplies') {
  return nearest(u,nodes.filter(n=>(n.kind||'supplies')===kind && knownResourceAmount(n,u.team)>0 &&
    (kind!=='materials'||quarryFor(n,u.team)) && (kind!=='uranium'||uraniumAccess(u.team))));
}

function materialCost(type) { return defs[type].materials || 0; }
function prerequisite(type, team = 0) {
  if(type==='silo')return factionResearch(team).has('ballistics');
  if(type==='shelter'||type==='interceptor')return factionResearch(team).has('damageLimitation');
  return type !== 'factory' || alive(team).some(b => b.type === 'forge' && !b.construction);
}
function materialSite(p) { return nodes.find(n => n.kind === 'materials' && n.amount > 0 && dist(n, p) < 25); }
function quarryFor(n, team) {
  return alive(team).find(b => b.type === 'quarry' && !b.construction && dist(b, n) < 8 && supplied(b));
}
function resourceObserved(n) { return observesResource(0,n); }
function harvestDistance(n) { return n.kind === 'materials' ? 53 : 30; }
function canHarvest(u, n) {
  if (n.kind === 'uranium' && !uraniumAccess(u.team)) return false;
  if (n.kind === 'materials' && !quarryFor(n, u.team)) return false;
  // Reserve fixed extraction slots per simulation tick, so extra workers cannot
  // multiply a single deposit's production indefinitely.
  if (n.claimAt !== t) {
    n.claimAt = t;
    n.claims = units.filter(w => w.hp > 0 && w.type === 'worker' && !w.carrying &&
      w.order?.kind === 'gather' && w.order.node === n && dist(w, n) <= harvestDistance(n) + 2 &&
      (n.kind !== 'materials' || quarryFor(n, w.team)) && (n.kind !== 'uranium' || uraniumAccess(w.team)))
      .sort((a, b) => b.harvest - a.harvest || a.id - b.id)
      .slice(0, n.kind === 'materials' ? 3 : 2).map(w => w.id);
  }
  return n.claims.includes(u.id);
}
function idleWorkers() {
  return alive(0).filter(u => u.type === 'worker' && (!u.order || u.order.kind === 'hold' ||
    (u.order.kind === 'gather' && !u.carrying && (!u.order.node || knownResourceAmount(u.order.node,0)===0 ||
      (u.order.node.kind === 'materials' && !quarryFor(u.order.node, 0)) || (u.order.node.kind==='uranium'&&!uraniumAccess(0))))));
}
function selectIdleWorkers() {
  if (!running || paused || ended) return;
  selected = idleWorkers();
  if (selected.length) { cam.x = selected[0].x; cam.y = selected[0].y; }
  say(selected.length ? selected.length + ' idle provisioners selected. Assign a cache, quarry or construction site.' : 'All provisioners have work.');
  updateUI(true);
}
function workerProducer(b) { return b.type==='core'||b.type==='headquarters'; }
function deliveryBase(b) { return workerProducer(b)||b.type==='relay'; }
function produces(b,type) { return type==='worker'?workerProducer(b):b.type===producerFor(type); }
function producerFor(type) { return type === 'worker' ? 'core' : ['walker','bike'].includes(type) ? 'factory' : 'forge'; }
function readyProducers(type) {
  return selected.filter(u => u.team === 0 && u.hp > 0 && produces(u,type) && !u.construction && !u.research && !u.atomicJob && u.queue.length < 5)
    .sort((a,b) => a.queue.reduce((sum, item) => sum + defs[item].time, defs[type].time-a.progress) / (supplied(a) ? 1 : .25) -
      b.queue.reduce((sum, item) => sum + defs[item].time, defs[type].time-b.progress) / (supplied(b) ? 1 : .25) || a.id - b.id);
}

function productionRate(b, research=false) {
  return (supplied(b)?1:.25) * (!research && (b.team===0?benefits.has('troubadour'):wave>=2)?1.25:1);
}

function livingPopulation(team=0) {return alive(team).filter(u=>defs[u.type].speed).length;}
function populationBlocked(team=0) {return livingPopulation(team)>=cap(team);}

// Read-only economy feedback. Never allocate extraction claims from the UI.
function resourceWorkReport(n, team=0) {
  const slots=n.kind==='materials'?3:2;
  const workers=alive(team).filter(w=>w.type==='worker'&&w.order?.kind==='gather'&&w.order.node===n);
  const nearby=workers.filter(w=>!w.carrying&&dist(w,n)<=harvestDistance(n)+2);
  const hauling=workers.filter(w=>w.carrying>0).length;
  const amount=knownResourceAmount(n,team);
  let state='working',reason='';
  if(amount===undefined){state='unknown';reason='Scout this site to confirm its stock.';}
  else if(amount===0){state='depleted';reason='Depleted. Assign another resource site.';}
  else if(n.kind==='uranium'&&!uraniumAccess(team)){state='missing';reason='Complete Artillery Works to gather Uranium. Two slots; 4 units per 3 seconds, then deliver to a linked base.';}
  else if(n.kind==='materials'){
    const quarry=alive(team).find(b=>b.type==='quarry'&&dist(b,n)<8);
    if(!quarry){state='missing';reason='Build a Materials Quarry on this deposit.';}
    else if(quarry.construction){const crew=constructionCrew(quarry);state=crew.queued&&!crew.active?'queued':'construction';reason=state==='queued'?'Quarry queued. Provisioner is finishing earlier orders.':'Finish the quarry with a provisioner.';}
    else if(!supplied(quarry)){state='isolated';reason='QUARRY ISOLATED. Clear raiders or restore its building link.';}
  }
  if(state==='working'&&!alive(team).some(b=>deliveryBase(b)&&!b.construction&&supplied(b))){state='delivery';reason='No linked delivery base. Restore a headquarters or palace/home connection.';}
  const extractionOpen=state==='working'||state==='delivery';
  const extracting=extractionOpen&&n.claimAt===t?nearby.filter(w=>n.claims?.includes(w.id)).length:0;
  const waiting=nearby.length-extracting;
  const approaching=workers.length-nearby.length-hauling;
  return {slots,assigned:workers.length,extracting,hauling,waiting,approaching,state,reason};
}
function selectionResource() {
  const first=selected[0];
  if(!first)return null;
  if(selected.length===1&&first.type==='quarry')return nodes.find(n=>n.kind==='materials'&&dist(n,first)<8)||null;
  if(selected.every(w=>w.type==='worker'&&w.order?.kind==='gather'&&w.order.node===first.order?.node))return first.order?.node||null;
  return null;
}
function resourceWorkSummary(n, report=resourceWorkReport(n)) {
  return `${resourceName(n)} · ${report.assigned} assigned · ${report.extracting}/${report.slots} extracting`;
}

function headquartersSummary(b) {
  return `Delivered ${Math.floor(b.deliveredSupplies||0)} S · ${Math.floor(b.deliveredMaterials||0)} M · ${Math.floor(b.deliveredUranium||0)} U. +10 population. Recruits provisioners.`;
}
