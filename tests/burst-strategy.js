// Controlled tactical comparison. Research and deployment are fixture grants;
// this measures engagement decisions, not a paid opening or general balance.
let burstIds=[],burstOpponentIds=[];
function burstSetup(scenario,policy){
 easy=false;uid=0;reset();running=true;paused=false;
 nextWave=enemySpawn=9999;enemyScoutSent=true;enemyBudget=enemyMaterials=0;
 units=units.filter(u=>u.type==='core');heroRecovery=[];
 technologies.add('drill');enemyTechnologies.add('drill');technologies.add('rapid');
 const squad=[];
 for(let i=0;i<4;i++)squad.push(add('trooper',0,650+(i%2)*35,750+Math.floor(i/2)*40));
 if(scenario==='wounded')for(const u of squad)u.hp=45;
 const withdrawing=scenario.startsWith('withdraw');
 const opposition=[];
 for(let i=0;i<4;i++)opposition.push(add('trooper',1,(scenario==='withdraw-close'?760:850)+(i%2)*35,750+Math.floor(i/2)*40));
 burstIds=squad.map(u=>u.id);burstOpponentIds=opposition.map(u=>u.id);
 for(const u of opposition)issueOrder(u,{kind:withdrawing?'attack':'hold',x:500,y:u.y});
 for(const u of squad)issueOrder(u,{kind:withdrawing?'move':'attack',x:withdrawing?400:850,y:u.y});
 if(policy==='burst')for(const u of squad)activateRapid(u);
 rebuildNav();rebuildSupply();sightAt=-1;
}
function burstResult(){
 const squad=units.filter(u=>burstIds.includes(u.id)),enemy=units.filter(u=>burstOpponentIds.includes(u.id));
 return {seconds:Number(t.toFixed(2)),survivors:squad.filter(u=>u.hp>0).length,
  health:Number(squad.reduce((sum,u)=>sum+Math.max(0,u.hp),0).toFixed(1)),
  enemies:enemy.filter(u=>u.hp>0).length,enemyHealth:Number(enemy.reduce((sum,u)=>sum+Math.max(0,u.hp),0).toFixed(1)),
  distance:squad.length?Number((squad.reduce((sum,u)=>sum+Math.abs(u.x-400),0)/squad.length).toFixed(1)):null};
}
