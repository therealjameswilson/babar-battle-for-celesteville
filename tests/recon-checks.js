function reconChecks(check){
 function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;intel[1]=[];}
 function field(){fresh();units=units.filter(u=>u.type==='core');rebuildNav();return add('scout',1,1100,600,{recon:true});}
 fresh();let school=alive(1).find(u=>u.type==='forge');t=21;
 check(!recruitEnemyRecon([school]),'Recon waits for its opening recruitment time');
 t=22;let funds=enemyBudget;
 check(recruitEnemyRecon([school])&&enemyBudget===funds-defs.scout.cost&&school.queue[0]==='scout','Recon is paid through a real school queue');
 check(!recruitEnemyRecon([school])&&school.queue.length===1,'Pending reconnaissance recruitment cannot duplicate its queue');
 for(let k=0;k<400&&!alive(1).some(u=>u.recon);k++)update(.05);
 let scout=alive(1).find(u=>u.recon);
 check(scout?.type==='scout'&&scout.order?.kind==='move','Completed scout receives an actual reconnaissance move order');
 t=100;check(!recruitEnemyRecon([school]),'A living reconnaissance scout prevents replacement purchases');
 scout.hp=0;t=40;check(!recruitEnemyRecon([school]),'Scout loss cannot bypass the paid replacement interval');
 t=100;funds=enemyBudget;check(recruitEnemyRecon([school])&&enemyBudget===funds-defs.scout.cost,'A lost scout can be replaced for the normal resource cost');
 fresh();school=alive(1).find(u=>u.type==='forge');t=30;enemyBudget=0;
 check(!recruitEnemyRecon([school])&&!school.queue.length&&enemyReconNextAt===22,'Insufficient supplies cannot create a scout or consume the retry opportunity');
 enemyBudget=1000;school.hp=0;check(!recruitEnemyRecon([]),'Destroying the school blocks reconnaissance recruitment');
 scout=field();let hidden=add('turret',0,650,880);enemyReconThink();
 check(scout.order.kind==='move'&&scout.reconGoal.key===0,'Unseen defenses do not influence a scouting route');
 hidden.hp=0;enemyReconThink();check(scout.reconGoal.key===0,'Hidden destruction does not update scouting plans');
 intel[1]=[{id:hidden.id,type:'turret',x:650,y:880,seen:0}];t=100;enemyReconThink();
 check(scout.reconGoal.key!==0,'Remembered static defenses redirect reconnaissance after sixty seconds');
 intel[1]=[{id:900,type:'trooper',x:650,y:880,seen:0}];
 check(reconSiteSafe(RECON_SITES[0]),'Expired mobile reports do not permanently block a route');
 scout=field();const threat=add('trooper',0,950,600);sightAt=-1;enemyReconThink();
 check(scout.order.kind==='retreat','A visible weapon threat triggers scout withdrawal');
 const withdrawal=scout.order;enemyReconThink();check(scout.order===withdrawal,'Repeated planning preserves the active withdrawal');
 threat.hp=0;scout.order={kind:'hold'};scout.hp=scout.max*.7;t=20;enemyReconThink();
 check(scout.order.kind==='hold','An injured scout waits for recovery rather than immediately returning');
 scout.hp=scout.max;scout.morale=100;sightAt=-1;enemyReconThink();
 check(scout.order.kind==='move','Recovered scouts resume reconnaissance');
 const reconOrder=scout.order;dispatchEnemyAssault(3);check(scout.order===reconOrder,'Main assaults and economic raids do not commandeer the reconnaissance scout');
 scout=field();for(let k=0;k<2400;k++){if(k%60===0)enemyReconThink();update(.05);}
 check(Object.keys(scout.reconVisits||{}).length>=3,'Normal movement revisits multiple reconnaissance routes over a long observation');
 check(intel[1].some(r=>r.type==='core'),'Physical reconnaissance discovers the player capital through ordinary vision');
 fresh();check(enemyReconNextAt===22,'Mission restart resets reconnaissance recruitment timing');
}
