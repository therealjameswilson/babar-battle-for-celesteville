/* Shared route, combat, queue and visibility checks for repeat patrols. */
function patrolChecks(check) {
  function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;units=units.filter(u=>u.type==='core');rebuildNav();}
  function step(seconds){for(let i=0;i<seconds*20&&!ended;i++)update(.05);}
  fresh();const scout=add('scout',0,600,1050);
  selected=[scout];mode='patrol';command({x:900,y:1050});step(.05);
  check(scout.order.kind==='patrol'&&scout.order.returnPoint.x===600,'Patrol begins at the unit position with an independent return endpoint');
  let turns=0,last=scout.order.x;
  for(let i=0;i<700;i++){update(.05);if(scout.order.x!==last){turns++;last=scout.order.x;}}
  check(turns>=4&&scout.order.kind==='patrol','Patrol repeatedly traverses both endpoints instead of stopping after one leg');
  issueOrder(scout,{kind:'move',x:650,y:1000},true);step(15);
  check(!scout.order&&dist(scout,{x:650,y:1000})<12,'A queued move exits patrol at its next endpoint');
  fresh();const queued=add('scout',0,600,1050);
  issueOrder(queued,{kind:'move',x:750,y:1050});issueOrder(queued,{kind:'patrol',x:950,y:1050},true);step(2.2);
  check(queued.order.kind==='patrol'&&Math.abs(queued.order.returnPoint.x-750)<12,'A queued patrol starts from activation position, not stale issue position');
  fresh();const watcher=add('trooper',0,600,1050),intruder=add('scout',1,780,1050,{hp:1});
  issueOrder(watcher,{kind:'patrol',x:900,y:1050});issueOrder(intruder,{kind:'hold'});step(2);
  check(intruder.hp<=0&&watcher.order.kind==='patrol','Patrol engages a visible intruder without replacing its route');
  let furthest=watcher.x;for(let i=0;i<160;i++){update(.05);furthest=Math.max(furthest,watcher.x);}
  check(furthest>850&&watcher.order.kind==='patrol','Patrol resumes traversal after the threat is removed');
  const hidden=add('scout',1,1300,100);step(.1);
  check(hidden.hp===defs.scout.hp&&watcher.order.kind==='patrol','An unseen enemy cannot divert or be hit by the patrol');
  selected=[watcher];tacticalOrders('hold');step(1);
  check(watcher.order.kind==='hold'&&!watcher.orders.length,'Hold explicitly cancels patrol and its future legs');
  fresh();const forest=add('scout',0,650,600);issueOrder(forest,{kind:'patrol',x:840,y:620});step(20);
  check(forest.order.kind==='patrol'&&!solidAt(forest.x,forest.y,forest.r),'Blocked patrol endpoint uses navigable completion and continues without entering forest');
  fresh();const workers=add('worker',0,600,1050);selected=[workers];mode='patrol';command(nodes[0]);
  check(workers.order.kind==='patrol'&&!workers.order.node,'Explicit patrol over a resource does not silently become gathering');
  const pair=[add('scout',0,600,1000),add('scout',0,640,1000)];selected=pair;mode='patrol';command({x:900,y:1050});step(.05);
  check(pair[0].order.x!==pair[1].order.x&&pair[0].order.returnPoint!==pair[1].order.returnPoint,'Formation patrol preserves spaced destinations and per-unit origins');
  reset();
}
