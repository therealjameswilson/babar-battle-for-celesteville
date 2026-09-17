// Controlled deployment to inspect the planner and raid travel/combat, not an earned opening.
let operationSite,operationPlan,operationWorkers;
function enemyRaidScenario(defended=false){
 easy=false;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;
 units=units.filter(u=>u.type==='core'||(u.team===0&&u.type==='hero'));
 if(!validBuild({x:570,y:1070},'relay'))throw Error('Invalid first outpost fixture');
 add('relay',0,570,1070);
 if(!validBuild({x:730,y:1070},'relay'))throw Error('Invalid raid outpost fixture');
 operationSite=add('relay',0,730,1070);
 const cache=nodes.find(n=>n.x===880);
 operationWorkers=[add('worker',0,840,950),add('worker',0,875,960)];
 for(const w of operationWorkers)issueOrder(w,{kind:'gather',node:cache});
 if(defended){if(!validBuild({x:700,y:970},'turret'))throw Error('Invalid defensive tower fixture');add('turret',0,700,970);}
 for(const [i,type] of ['scout','sapper','trooper','trooper','trooper','trooper','trooper','walker'].entries())add(type,1,1060+(i%4)*35,1020-Math.floor(i/4)*50);
 for(const u of units.filter(u=>defs[u.type].speed))if(solidAt(u.x,u.y,u.r))throw Error('Blocked fixture unit '+u.type);
 rebuildNav();rebuildSupply();sightAt=-1;refreshIntelligence(1);
 operationPlan=dispatchEnemyAssault(3);
 // Hold the main column so the visible result measures the detached squad alone.
 operationPlan.main.forEach((u,i)=>{u.x=1400+(i%4)*35;u.y=600+Math.floor(i/4)*35;issueOrder(u,{kind:'hold'});});
 sightAt=-1;
 selected=operationWorkers;cam={x:850,y:990,zoom:1};
}
function enemyRaidScenarioResult(){return {raiders:operationPlan.raiders.length,siteHealth:Math.max(0,Math.round(operationSite.hp)),workers:operationWorkers.filter(u=>u.hp>0).length,supplies:Math.round(ore),extracted:1800-nodes.find(n=>n.x===880).amount};}

function enemyRaidExecutionChecks(check){
 const outcomes=[];
 for(const defended of [false,true]){
  enemyRaidScenario(defended);
  const funds=enemyBudget,force=alive(1).length;
  dispatchEnemyAssault(3);
  check(enemyBudget===funds&&alive(1).length===force,'Raid dispatch uses existing troops without free reinforcements');
  // Reset after the accounting probe; isolate the detached force again.
  enemyRaidScenario(defended);
  for(let k=0;k<1200&&!ended;k++)update(.05);
  outcomes.push(enemyRaidScenarioResult());
 }
 check(outcomes[0].raiders===4&&outcomes[1].raiders===0,'Actually observed tower deters the controlled economic raid');
 check(outcomes[0].siteHealth<outcomes[1].siteHealth,'Raid traverses the terrain and damages the exposed outpost');
 check(outcomes[0].workers<outcomes[1].workers&&outcomes[0].extracted<outcomes[1].extracted,'Defending the approach preserves provisioners and resource extraction');
 return outcomes;
}
