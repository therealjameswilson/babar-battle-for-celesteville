/* Shared browser/VM checks for combined arms and faction research. */
function counterChecks(check) {
  function freshCounters() {easy=false;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;}
  function steps(seconds) {for(let i=0;i<seconds*20&&!ended;i++)update(.05);}
  freshCounters();
  check(armorClass({type:'trooper'})==='light'&&armorClass({type:'sapper'})==='light'&&armorClass({type:'walker'})==='armored'&&armorClass({type:'forge'})==='armored','Armor classes distinguish infantry from guns and buildings');
  const sapper=add('sapper',0,800,1050),guard=add('trooper',1,900,1050),gun=add('walker',1,950,1050),building=add('forge',1,1030,1050);
  damageUnit(sapper,guard,10);damageUnit(sapper,gun,10);damageUnit(sapper,building,10);
  check(guard.hp===135&&gun.hp===210&&building.hp===820,'Sapper deals 10 to light troops and 30 to armored guns and buildings');
  technologies.add('drill');const old=gun.hp;damageUnit(sapper,gun,10);
  check(Math.abs(old-gun.hp-36)<.001,'Infantry research upgrades both sapper base damage and armor bonus');
  gun.x=1090;gun.y=875;const covered=gun.hp;damageUnit(sapper,gun,10);
  check(Math.abs(covered-gun.hp-36*.65)<.001,'Cover reduces anti-armor damage normally');
  freshCounters();selected=[alive(0).find(b=>b.type==='forge')];ore=500;materials=100;
  train('sapper');check(selected[0].queue.length===0&&ore===500&&materials===100,'Sappers require completed Artillery Works before recruitment');
  const works=add('factory',0,500,1080,{construction:1});train('sapper');check(!selected[0].queue.length,'An unfinished Artillery Works does not unlock sappers');
  works.construction=0;train('sapper');check(selected[0].queue[0]==='sapper'&&ore===410&&materials===80,'Sapper recruitment pays 90 Supplies and 20 Materials');
  cancelRecruit(selected[0],0);check(ore===500&&materials===100,'Sapper cancellation refunds both resources');
  train('sapper');steps(10.1);check(alive(0).some(u=>u.type==='sapper'),'Sapper emerges after normal ten-second training');
  freshCounters();t=110;const buildings=alive(1).filter(b=>!defs[b.type].speed);
  const spottedGun=add('walker',0,500,1050);
  check(enemyCounterChoice(4,buildings)!=='sapper','Hidden player artillery does not trigger counter recruitment');
  spottedGun.x=1200;spottedGun.y=550;t+=1;updateTactics(.6);
  check(enemyCounterChoice(4,buildings)==='sapper','Recently scouted artillery prompts anti-armor recruitment');
  spottedGun.x=500;spottedGun.y=1050;t+=61;check(enemyCounterChoice(4,buildings)!=='sapper','Expired scouting reports do not sustain armor counter recruitment');
  freshCounters();const lab=alive(1).find(b=>b.type==='forge');enemyBudget=500;enemyMaterials=100;
  const playerFunds=ore;check(purchaseResearch(lab,'drill')&&enemyBudget===350&&ore===playerFunds,'Enemy research uses enemy funds only');
  check(!purchaseResearch(lab,'drill')&&!enemyQueue('trooper'),'Research excludes duplicate purchase and recruitment at that site');
  steps(25.1);check(enemyTechnologies.has('drill')&&!technologies.has('drill'),'Completed enemy research stays separate from player technologies');
  check(weaponMultiplier({team:1,type:'sapper'})===1.2&&weaponMultiplier({team:0,type:'sapper'})===1,'Enemy upgrade applies to its current and future infantry only');
  freshCounters();const doomed=alive(1).find(b=>b.type==='factory');enemyBudget=500;enemyMaterials=100;
  check(purchaseResearch(doomed,'shells')&&enemyBudget===320&&enemyMaterials===40,'Enemy shell research pays both resources');
  doomed.hp=0;steps(36);check(!enemyTechnologies.has('shells'),'Destroying enemy research site prevents completion');
  freshCounters();t=110;enemyBudget=1000;enemyMaterials=100;add('trooper',1,1400,380);
  const queueSite=alive(1).find(b=>b.type==='forge');queueSite.queue=['trooper'];
  enemyResearchPlan(alive(1).filter(b=>!defs[b.type].speed));
  check(queueSite.plannedResearch==='drill'&&!enemyQueue('trooper'),'Basil reserves a research site while its paid recruitment queue drains');
  alive(1).filter(u=>u.type==='trooper').slice(0,4).forEach(u=>u.hp=0);
  enemyResearchPlan(alive(1).filter(b=>!defs[b.type].speed));
  check(!queueSite.plannedResearch,'Heavy army losses clear planned research so replacement recruitment can resume');
  for(let i=0;i<3;i++)add('trooper',1,1400+i*30,380);
  steps(7.1);enemyResearchPlan(alive(1).filter(b=>!defs[b.type].speed));
  check(queueSite.research?.id==='drill'&&!queueSite.plannedResearch,'Basil starts paid research after existing recruits finish');
  function duel(typesA,typesB) {
    freshCounters();units=units.filter(u=>u.type==='core');
    const a=typesA.map((type,i)=>add(type,0,780,1020+i*36));
    const b=typesB.map((type,i)=>add(type,1,920,1020+i*36));
    a.forEach(u=>issueOrder(u,{kind:'attack',x:920,y:1030}));b.forEach(u=>issueOrder(u,{kind:'attack',x:780,y:1030}));
    steps(35);return {a:a.filter(u=>u.hp>0).length,b:b.filter(u=>u.hp>0&&u.x<1100).length};
  }
  let fight=duel(['trooper'],['sapper']);check(fight.a===1&&fight.b===0,'Guard survives and drives a more expensive sapper off the contested ground');
  fight=duel(['sapper','sapper'],['walker']);check(fight.a>0&&fight.b===0,'A sapper pair survives and forces an unsupported field gun to withdraw');
  reset();check(!enemyTechnologies.size&&!technologies.size,'Restart clears both factions’ research');
}
