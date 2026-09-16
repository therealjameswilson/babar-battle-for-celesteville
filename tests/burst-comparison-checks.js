function burstComparisons(check,seed=()=>{}){
 const results=[];
 for(const scenario of ['engage','wounded','withdraw','withdraw-close'])for(const policy of ['normal','burst']){
  seed();burstSetup(scenario,policy);const checkpoints=[];
  check(units.filter(u=>burstIds.includes(u.id)||burstOpponentIds.includes(u.id)).every(u=>!solidAt(u.x,u.y,u.r)),`${scenario}/${policy}: all deployed troops start on navigable ground`);
  for(let k=1;k<=240;k++){
   update(.05);
   if([60,120,240].includes(k))checkpoints.push(burstResult());
  }
  check(checkpoints.every(r=>Number.isFinite(r.health)&&Number.isFinite(r.enemyHealth)&&r.survivors>=0&&r.survivors<=4),`${scenario}/${policy}: engagement resolves with valid health and casualties`);
  results.push({scenario,policy,checkpoints});
 }
 const pair=scenario=>results.filter(r=>r.scenario===scenario).map(r=>r.checkpoints);
 const [normal,burst]=pair('engage');
 check(burst[0].enemyHealth<normal[0].enemyHealth,'Healthy burst inflicts more damage during the first three seconds');
 check(burst[0].health<normal[0].health,'Early damage gain still pays a visible health cost');
 const [wounded,woundedBurst]=pair('wounded');
 check(woundedBurst[0].survivors<wounded[0].survivors,'Bursting wounded infantry can lose soldiers earlier than keeping their health');
 const [withdraw,withdrawBurst]=pair('withdraw');
 check(withdrawBurst[0].distance<withdraw[0].distance,'Burst reaches a withdrawal waypoint sooner');
 check(withdrawBurst[0].health<withdraw[0].health,'The first unthreatened seconds of withdrawal spend health without preventing damage');
 return results;
}
