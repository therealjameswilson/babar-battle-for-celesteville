'use strict';
let materials = 0, enemyMaterials = 60;
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
    (kind!=='materials'||quarryFor(n,u.team))));
}

function materialCost(type) { return defs[type].materials || 0; }
function prerequisite(type, team = 0) {
  return type !== 'factory' || alive(team).some(b => b.type === 'forge' && !b.construction);
}
function materialSite(p) { return nodes.find(n => n.kind === 'materials' && n.amount > 0 && dist(n, p) < 25); }
function quarryFor(n, team) {
  return alive(team).find(b => b.type === 'quarry' && !b.construction && dist(b, n) < 8 && supplied(b));
}
function resourceObserved(n) { return observesResource(0,n); }
function harvestDistance(n) { return n.kind === 'materials' ? 53 : 30; }
function canHarvest(u, n) {
  if (n.kind === 'materials' && !quarryFor(n, u.team)) return false;
  // Reserve fixed extraction slots per simulation tick, so extra workers cannot
  // multiply a single deposit's production indefinitely.
  if (n.claimAt !== t) {
    n.claimAt = t;
    n.claims = units.filter(w => w.hp > 0 && w.type === 'worker' && !w.carrying &&
      w.order?.kind === 'gather' && w.order.node === n && dist(w, n) <= harvestDistance(n) + 2 &&
      (n.kind !== 'materials' || quarryFor(n, w.team)))
      .sort((a, b) => b.harvest - a.harvest || a.id - b.id)
      .slice(0, n.kind === 'materials' ? 3 : 2).map(w => w.id);
  }
  return n.claims.includes(u.id);
}
function idleWorkers() {
  return alive(0).filter(u => u.type === 'worker' && (!u.order || u.order.kind === 'hold' ||
    (u.order.kind === 'gather' && !u.carrying && (!u.order.node || knownResourceAmount(u.order.node,0)===0 ||
      (u.order.node.kind === 'materials' && !quarryFor(u.order.node, 0))))));
}
function selectIdleWorkers() {
  if (!running || paused || ended) return;
  selected = idleWorkers();
  if (selected.length) { cam.x = selected[0].x; cam.y = selected[0].y; }
  say(selected.length ? selected.length + ' idle provisioners selected. Assign a cache, quarry or construction site.' : 'All provisioners have work.');
  updateUI(true);
}
function producerFor(type) { return type === 'worker' ? 'core' : type === 'walker' ? 'factory' : 'forge'; }
function readyProducers(type) {
  return selected.filter(u => u.team === 0 && u.hp > 0 && u.type === producerFor(type) && !u.construction && !u.research && u.queue.length < 5)
    .sort((a,b) => a.queue.reduce((sum, item) => sum + defs[item].time, defs[type].time-a.progress) / (supplied(a) ? 1 : .25) -
      b.queue.reduce((sum, item) => sum + defs[item].time, defs[type].time-b.progress) / (supplied(b) ? 1 : .25) || a.id - b.id);
}
