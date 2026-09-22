function missileChecks(check){
 function fresh(team=0){
  reset();running=true;paused=false;easy=false;units=[];nextWave=enemySpawn=1e9;ore=enemyBudget=3000;materials=enemyMaterials=1000;
  add('core',team,400,1000);add('core',1-team,1500,300);
  const b=add('silo',team,500,1000);linked.add(b.id);add('scout',team,850,1000);factionResearch(team).add('ballistics');
  return b;
 }
 for(const team of [0,1]){
  const b=fresh(team),target=add('trooper',1-team,1000,1000,{hp:1000,max:1000}),ally=add('trooper',team,1020,1000,{hp:1000,max:1000});
  const funds=team?enemyBudget:ore;
  check(!launchBallistic(b,{x:1700,y:1200})&&(team?enemyBudget:ore)===funds,'range/fog rejects without payment');
  check(launchBallistic(b,{x:1000,y:1000}),'both factions launch conventional missiles');
  check((team?enemyBudget:ore)===2880&&(team?enemyMaterials:materials)===960,'paid conventional shot');
  check(!launchBallistic(b,{x:1000,y:1000}),'launcher reload blocks repeat');
  updateAtomic(0);check(target.hp===1000,'warning prevents instant damage');
  t=10;updateAtomic(0);check(target.hp===700&&ally.hp<1000,'conventional impact and friendly fire');
  check(!fx.some(f=>f.nuclearCloud),'conventional explosion is not a nuclear cloud');
 }
 for(const team of [0,1]){
  const b=fresh(team),battery=add('interceptor',1-team,1000,950);linked.add(battery.id);
  const target=add('trooper',1-team,1000,1000,{hp:1000,max:1000});
  launchBallistic(b,target);t=5;updateAtomic(0);check(atomicStrikes.length===1,'interception waits for terminal window');
  t=6;updateAtomic(0);check(!atomicStrikes.length&&target.hp===1000,'supplied battery intercepts');
  check((team?ore:enemyBudget)===2980&&(team?materials:enemyMaterials)===990,'defender pays for interceptor');
  const s={team,site:b,kind:'atomic',x:1000,y:1000,at:t+4};
  check(!interceptMissile(s),'reload creates saturation gap');
  t=20;linked.delete(battery.id);check(!interceptMissile(s),'isolation disables defense');
  linked.add(battery.id);if(team)materials=0;else enemyMaterials=0;check(!interceptMissile(s),'no free interceptor without materials');
 }
 let b=fresh(),a=add('interceptor',1,1000,950);linked.add(a.id);t=24;
 let s={team:0,site:b,kind:'hydrogen',x:1000,y:1000,at:28};
 check(!interceptMissile(s)&&s.defenseHits===1,'H-bomb survives one interceptor');
 const second=add('interceptor',1,1100,1000);linked.add(second.id);
 check(interceptMissile(s)&&s.defenseHits===2,'overlapping batteries stop H-bomb');
 second.interceptorReadyAt=0;a.interceptorReadyAt=0;
 check(!interceptMissile({...s,kind:'neutron',defenseHits:0}),'motorbike neutron payload bypasses ballistic defense');
 check(!interceptMissile({...s,kind:'atomic',x:1500,defenseHits:0}),'outside coverage is unprotected');
 a.hp=0;second.construction=10;check(!interceptMissile({...s,kind:'atomic',defenseHits:0}),'dead and unfinished batteries cannot shoot');
 b=fresh(1);const hidden=add('forge',0,1300,800);
 enemyMissileOrders();check(!atomicStrikes.length,'AI never targets unseen enemy');
 add('scout',1,1150,800);enemyMissileOrders();check(atomicStrikes.length===1,'AI attacks observed in-range targets');
 reset();check(!prerequisite('silo')&&!prerequisite('interceptor'),'research gates');
 technologies.add('ballistics');technologies.add('damageLimitation');check(prerequisite('silo')&&prerequisite('interceptor'),'research unlocks both structures');
 running=true;paused=false;ore=2000;materials=1000;selected=[alive(0).find(u=>u.type==='worker')];
 build('silo');command({x:490,y:1080});check(alive(0).some(u=>u.type==='silo'&&u.construction)&&ore===1720&&materials===880,'paid silo foundation');
 build('interceptor');command({x:400,y:1150});check(alive(0).some(u=>u.type==='interceptor'&&u.construction)&&ore===1500&&materials===780,'paid defense foundation');
 b=fresh();const target=add('trooper',1,1000,1000,{hp:1000,max:1000}),battery=add('interceptor',1,1000,950);linked.add(battery.id);
 const launchers=[b,add('silo',0,520,1080),add('silo',0,550,1150),add('silo',0,550,900)];launchers.forEach(v=>linked.add(v.id));
 check(launchers.slice(0,3).every(v=>launchBallistic(v,target))&&!launchBallistic(launchers[3],target),'three-missile flight cap');
 t=6;updateAtomic(0);check(atomicStrikes.length===2,'one battery stops one missile in a salvo');
 t=10;updateAtomic(0);check(target.hp===400,'remaining salvo penetrates during reload');
 b=fresh();linked.delete(b.id);check(!launchBallistic(b,{x:1000,y:1000}),'isolated launcher cannot fire');linked.add(b.id);
 launchBallistic(b,{x:1000,y:1000});b.hp=0;updateAtomic(0);check(!atomicStrikes.length,'launcher loss aborts guided strike');
 b=fresh();const factory=add('factory',0,500,1000);linked.add(factory.id);factory.atomicReady=true;
 add('hero',0,400,900);const nuclearBattery=add('interceptor',1,1000,950);linked.add(nuclearBattery.id);
 const shelter=add('shelter',1,1100,1000),worker=add('worker',1,1050,1000);
 check(launchAtomic(factory,{x:1000,y:1000}),'authorized atomic missile launch');
 updateAtomic(0);check(worker.civilDefense?.shelter===shelter,'nuclear missile triggers evacuation');
 t=14;updateAtomic(0);check(!atomicStrikes.length&&worker.hp===worker.max,'atomic interception prevents blast');
 t=18;updateAtomic(0);check(!worker.civilDefense,'interception gives all-clear');
 reset();check(!atomicStrikes.length,'reset clears missiles');
}
