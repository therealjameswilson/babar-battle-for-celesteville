function damageLimitationChecks(check){
 for(const team of [0,1]){
  reset();running=true;paused=false;nextWave=enemySpawn=1e9;ore=enemyBudget=1000;materials=enemyMaterials=200;
  const b=alive(team).find(u=>u.type==='forge');b.queue=[];linked.add(b.id);
  check(!prerequisite('shelter',team),'both factions start locked');
  check(!validBuild({x:490,y:1080},'shelter',team),'placement cannot bypass research');
  check(purchaseResearch(b,'damageLimitation'),'research starts for either faction');
  check((team?enemyBudget:ore)===850&&(team?enemyMaterials:materials)===150,'research charges both resources');
  check(!prerequisite('shelter',team),'purchase does not unlock before completion');
  b.research.progress=39.5;update(.1);
  check(!prerequisite('shelter',team),'partial research stays locked');
  b.research.progress=40;update(.1);
  check(prerequisite('shelter',team)&&!b.research,'completion unlocks shelters');
  check(!purchaseResearch(b,'damageLimitation'),'cannot purchase twice');
 }
 reset();running=true;paused=false;ore=1000;materials=200;selected=[alive(0).find(u=>u.type==='worker')];
 build('shelter');check(!placing&&ore===1000&&materials===200,'locked build spends nothing');
 const b=alive(0).find(u=>u.type==='forge');purchaseResearch(b,'damageLimitation');cancelResearch(b);
 check(!prerequisite('shelter')&&ore===962.5&&materials===187.5,'cancellation refunds without unlocking');
 purchaseResearch(b,'damageLimitation');b.hp=0;update(.1);check(!prerequisite('shelter'),'destroyed research site cannot unlock');
 reset();check(!prerequisite('shelter')&&!prerequisite('shelter',1),'restart clears unlock');
}
