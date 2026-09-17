'use strict';
// Enemy macro uses the same worker, construction, supply and production simulation.
// Strategic sites are map knowledge; enemy threats and resource quantities require sight.
// Reports hold snapshots, never references to hidden units or their current positions.
let enemyResourceReports = new Map(), enemyThreatReports = new Map();
const ENEMY_REPORT_LIFETIME = 60;
function observeEnemyEconomy() {
  for (const n of nodes) if (enemySeesPoint(n))
    enemyResourceReports.set(n, {x:n.x,y:n.y,amount:n.amount,kind:n.kind,at:t});
  for (const u of alive(0)) if (defs[u.type].damage && sees(1,u))
    enemyThreatReports.set(u.id,{x:u.x,y:u.y,at:t});
  for (const [id, report] of enemyThreatReports)
    if (t-report.at>ENEMY_REPORT_LIFETIME) enemyThreatReports.delete(id);
}
function enemyExpansionSite() {
  const buildings=alive(1).filter(b=>!defs[b.type].speed && !b.construction && supplied(b));
  const homes=alive(1).filter(b=>b.type==='relay' && b.expansion);
  if (homes.length>=2) return null;
  // Map routes are common knowledge; their economic value comes from scouting.
  const candidates=[{x:1120,y:620},{x:1100,y:890},{x:1320,y:740},
    {x:1380,y:740},{x:1180,y:850},{x:1320,y:850}];
  const drops=buildings.filter(b=>deliveryBase(b));
  const reports=[...enemyResourceReports.values()].filter(r=>r.amount>0 && t-r.at<=120);
  const ranked=[];
  for (const p of candidates) {
    if (!enemySeesPoint(p) || !validBuild(p,'relay',1) || !enemySafe(p) ||
      !buildings.some(b=>dist(b,p)<310) ||
      [...enemyThreatReports.values()].some(r=>dist(r,p)<270)) continue;
    let benefit=0;
    for (const r of reports) {
      const oldDistance=Math.min(...drops.map(b=>dist(b,r)));
      const improvement=Math.max(0,oldDistance-dist(p,r));
      benefit+=improvement*Math.min(1,r.amount/800)*(r.kind==='materials'?.45:1);
    }
    // Prefer the central road when current observations cannot distinguish stocks.
    // Its bridge reveals the depot approaches without reading hidden resources.
    const scouting=[...enemyResourceReports.values()].some(r=>r.kind!=='materials' && r.x<1200)?0:Math.max(0,1400-p.x)*.35;
    const score=benefit+scouting;
    if (score>30) ranked.push({p,score});
  }
  ranked.sort((a,b)=>b.score-a.score);
  return ranked[0]?.p || null;
}
function enemyHeadquartersSite() {
  if(alive(1).some(b=>b.type==='headquarters'))return null;
  const core=alive(1).find(b=>b.type==='core');if(!core)return null;
  const reports=[...enemyResourceReports.values()].filter(r=>r.kind!=='materials'&&t-r.at<=120);
  const local=reports.filter(r=>dist(r,core)<420);
  // Do not infer depletion from missing or stale observations.
  if(local.length<2||local.reduce((sum,r)=>sum+r.amount,0)>=900)return null;
  const candidates=[{x:1020,y:1070},{x:1150,y:1020},{x:1130,y:700},{x:710,y:1060}];
  return candidates.filter(p=>enemySeesPoint(p)&&enemySafe(p)&&validBuild(p,'headquarters',1)&&
    ![...enemyThreatReports.values()].some(r=>dist(r,p)<270)&&
    reports.some(r=>r.amount>=400&&dist(r,p)<300))
    .sort((a,b)=>dist(a,core)-dist(b,core))[0]||null;
}
function enemySeesPoint(p) { return alive(1).some(u => dist(u,p) < vision(u)); }
function enemySafe(p) {
  return !alive(0).some(u => defs[u.type].damage && sees(1,u) && dist(u,p) < 240);
}
function enemyQueue(type) {
  if (!unitUnlocked(type,1)) return false;
  const producer = alive(1).filter(b => produces(b,type) && !b.construction && !b.research && !b.plannedResearch && b.queue.length < 2)
    .sort((a,b) => a.queue.length-b.queue.length || a.id-b.id)[0];
  if (!producer || supply(1) >= cap(1) || enemyBudget < defs[type].cost || enemyMaterials < materialCost(type)) return false;
  enemyBudget -= defs[type].cost; enemyMaterials -= materialCost(type);
  enemySpent += defs[type].cost; producer.queue.push(type);
  return true;
}
function enemyBuild(type, p) {
  if (enemyBudget < defs[type].cost || enemyMaterials < materialCost(type) || !enemySafe(p) || !validBuild(p,type,1)) return null;
  const builder = nearest(p,alive(1).filter(w => w.type==='worker' && w.order?.kind!=='build' && w.order?.kind!=='retreat' && !w.carrying));
  if (!builder) return null;
  enemyBudget -= defs[type].cost; enemyMaterials -= materialCost(type); enemySpent += defs[type].cost;
  const site = add(type,1,p.x,p.y,{construction:defs[type].build,buildDuration:defs[type].build,hp:1,paid:defs[type].cost,paidMaterials:materialCost(type)});
  builder.returnToWork = builder.order?.kind==='gather' ? builder.order : null;
  issueOrder(builder,{kind:'build',target:site});
  if (visible(site)) say('Rhino engineers are constructing ' + defs[type].name + '.');
  return site;
}
const SITE_DIRECTIONS=[[1,0],[Math.sqrt(3)/2,.5],[.5,Math.sqrt(3)/2],[0,1],[-.5,Math.sqrt(3)/2],[-Math.sqrt(3)/2,.5],[-1,0],[-Math.sqrt(3)/2,-.5],[-.5,-Math.sqrt(3)/2],[0,-1],[.5,-Math.sqrt(3)/2],[Math.sqrt(3)/2,-.5]];
function enemyFindSite(type, center) {
  for (const radius of [100,150,210,270]) for (let i=0;i<12;i++) {
    const p={x:Math.round(center.x+SITE_DIRECTIONS[i][0]*radius),y:Math.round(center.y+SITE_DIRECTIONS[i][1]*radius)};
    if (validBuild(p,type,1) && enemySafe(p)) return p;
  }
  return null;
}
function enemyAssignWorkers() {
  const workers=alive(1).filter(u=>u.type==='worker');
  // Only known, locally visible stocks enter economic planning. No hidden depletion reads.
  const resources=nodes.filter(n=>enemySeesPoint(n) && n.amount>0 && enemySafe(n) &&
    (n.kind!=='materials' || quarryFor(n,1)) && alive(1).some(b=>(deliveryBase(b)) && supplied(b) && dist(b,n)<520));
  // Three assigned workers per stock includes delivery travel; extraction slots remain 2/3.
  const counts=new Map();
  for (const w of workers) {
    const order=w.order;
    if (order?.kind==='gather' && resources.includes(order.node)) counts.set(order.node,(counts.get(order.node)||0)+1);
  }
  for (const w of workers) {
    if (w.carrying || w.order?.kind==='build' || w.order?.kind==='repair' || (w.order?.kind==='retreat' && w.morale<70)) continue;
    const old=w.order?.node;
    if (w.order?.kind==='gather' && resources.includes(old) && (counts.get(old)||0)<=3) continue;
    if (old) counts.set(old,Math.max(0,(counts.get(old)||0)-1));
    const n=resources.filter(n=>(counts.get(n)||0)<3)
      .sort((a,b)=>((counts.get(a)||0)*180+dist(w,a)+(a.kind==='materials'?120:0))-((counts.get(b)||0)*180+dist(w,b)+(b.kind==='materials'?120:0)))[0];
    if (n) { issueOrder(w,{kind:'gather',node:n}); counts.set(n,(counts.get(n)||0)+1); }
    else if (w.order?.kind==='gather') orderRetreat(w);
  }
}
function enemyMacro() {
  if (t < enemySpawn) return;
  enemySpawn=t+3;
  observeEnemyEconomy();
  const buildings=alive(1).filter(b=>!defs[b.type].speed), workers=alive(1).filter(w=>w.type==='worker');
  const core=buildings.find(b=>b.type==='core');
  if (!core) return;
  // Replace a lost builder without paying for the same foundation twice.
  for (const site of buildings.filter(b=>b.construction)) {
    if (workers.some(w=>w.order?.kind==='build'&&w.order.target===site)) continue;
    const worker=nearest(site,workers.filter(w=>!w.carrying && !['build','retreat'].includes(w.order?.kind)));
    if (worker && enemySafe(site)) { worker.returnToWork=worker.order?.kind==='gather'?worker.order:null; issueOrder(worker,{kind:'build',target:site}); }
  }
  enemyAssignWorkers();
  const queuedWorkers=buildings.reduce((n,b)=>n+b.queue.filter(q=>q==='worker').length,0);
  if (workers.length+queuedWorkers<(easy?9:12)) enemyQueue('worker');
  const construction=buildings.some(b=>b.construction);
  if (!construction) {
    let type=null,site=null,isExpansion=false;
    if (!buildings.some(b=>b.type==='forge')) { type='forge'; site=enemyFindSite(type,core); }
    else if (supply(1)>=cap(1)-3 && cap(1)<(easy?40:60)) { type='relay'; site=enemyFindSite(type,core); }
    else if (!buildings.some(b=>b.type==='quarry')) { type='quarry'; site=nodes.find(n=>n.kind==='materials'&&enemySeesPoint(n)&&n.amount>0&&validBuild(n,type,1)); }
    else if (!buildings.some(b=>b.type==='factory') && t>90) { type='factory'; site=enemyFindSite(type,core); }
    // Independent camps are paid only after current reports show home stocks running low.
    else if(enemyBudget>=550&&(site=enemyHeadquartersSite())){type='headquarters';isExpansion=true;}
    // Up to two scouted expansions shorten deliveries; raids can change the route.
    else if (t>(easy?150:100) && enemyBudget>=160) {
      site=enemyExpansionSite(); if (site) {type='relay';isExpansion=true;}
    }
    if (site) {
      const building=enemyBuild(type,site);
      if (building && isExpansion) building.expansion=true;
    }
  }
  // Reserve limited labor for paid repairs, outside observed hostile fire.
  const damaged=buildings.find(b=>!b.construction&&b.hp<b.max*.65&&enemySafe(b));
  if (damaged && enemyBudget>100 && !workers.some(w=>w.order?.kind==='repair')) {
    const w=nearest(damaged,workers.filter(w=>!w.carrying&&w.order?.kind==='gather'));
    if (w) issueOrder(w,{kind:'repair',target:damaged});
  }
  enemyResearchPlan(buildings);
  recruitEnemyRecon(buildings);
  enemyReconThink();
  const troops=alive(1).filter(u=>defs[u.type].damage&&defs[u.type].speed).length;
  if (troops<(easy?16:24)) {
    const type=enemyCounterChoice(troops,buildings);
    if (!enemyQueue(type) && type!=='trooper') enemyQueue('trooper');
  }
}
