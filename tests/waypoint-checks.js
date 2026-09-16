function waypointChecks(check) {
  function fresh() {easy=true;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;units=units.filter(u=>u.team===0||u.type==='core');rebuildNav();}
  function step(seconds){for(let n=0;n<seconds*20&&!ended;n++)update(.05);}
  fresh();
  const scout=add('scout',0,650,600);
  issueOrder(scout,{kind:'move',x:840,y:620});issueOrder(scout,{kind:'move',x:1050,y:850},true);
  step(25);
  check(!scout.order&&!scout.orders.length&&dist(scout,{x:1050,y:850})<15,'A waypoint inside forest completes on clear ground and advances its queued route');
  check(!solidAt(scout.x,scout.y,scout.r),'Resolved forest waypoint never leaves scout inside an obstacle');
  fresh();
  const guard=add('trooper',0,250,650);
  issueOrder(guard,{kind:'attack',x:320,y:900});issueOrder(guard,{kind:'move',x:550,y:650},true);
  step(30);
  check(!guard.order&&dist(guard,{x:550,y:650})<15,'Attack-move into a friendly building finishes and advances queued movement');
  fresh();
  const traveler=add('scout',0,400,650);
  issueOrder(traveler,{kind:'move',x:650,y:750});issueOrder(traveler,{kind:'move',x:720,y:900},true);
  step(.2);const newSite=add('relay',0,650,750,{construction:12,buildDuration:12,hp:1});
  step(25);
  check(!traveler.order&&dist(traveler,{x:720,y:900})<15,'A new foundation covering the destination reroutes the order without trapping the queue');
  check(newSite.construction===12,'Waypoint resolution does not complete or modify unrelated construction');
  fresh();
  const marchers=[];for(let i=0;i<24;i++)marchers.push(add('scout',0,600+(i%4)*32,740+Math.floor(i/4)*32));
  selected=marchers;mode='move';command({x:1040,y:850});mode='move';command({x:650,y:800},true);
  step(90);
  check(marchers.every(u=>!u.order&&!u.orders.length),'Twenty-four units complete a round trip through the southern forest approach');
  check(marchers.every(u=>u.x<760&&!solidAt(u.x,u.y,u.r)),'Marching formation returns without units trapped inside terrain or buildings');
  reset();
}
