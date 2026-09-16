// Paired full matches with normal starting assets, paid recruitment and active waves.
let earnedRaidTiming="established",earnedRaidPaid=0,earnedRaidStart=null,earnedRaidReturned=false,earnedRaidIds=[];
let earnedBirths=new Set(),earnedEnemyGuns=0,earnedQuarryId=0,earnedQuarryDestroyed=false;
function earnedRaidSetup(timing="established"){
 earnedRaidTiming=timing;
 easy=false;uid=0;reset();running=true;
 earnedRaidPaid=0;earnedRaidStart=null;earnedRaidReturned=false;earnedRaidIds=[];
 earnedBirths=new Set(units.map(u=>u.id));earnedEnemyGuns=0;
 earnedQuarryId=alive(1).find(u=>u.type==='quarry').id;earnedQuarryDestroyed=false;
}
function earnedRaidStep(plan){
 const own=alive(0),sappers=own.filter(u=>u.type==='sapper'),school=own.find(u=>u.type==='forge');
 const established=earnedRaidTiming==='early'||(t>=180&&own.filter(u=>u.type==='walker').length>=5);
 if(established&&earnedRaidPaid<4&&unitUnlocked('sapper')&&school&&school.queue.length<2&&ore>=90&&materials>=20){
  const queued=school.queue.length;selected=[school];train('sapper');
  if(school.queue.length>queued)earnedRaidPaid++;
 }
 if(earnedRaidStart===null&&sappers.length===4){earnedRaidStart=t;earnedRaidIds=sappers.map(u=>u.id);}
 const assembling=earnedRaidStart===null;
 const active=plan==='raid'&&(assembling||t<earnedRaidStart+90);
 defenseStep((assembling||active)?sappers.map(u=>u.id):[],!assembling);
 if(assembling)for(const [i,u] of sappers.entries())if(!u.order||u.order.kind!=='move')issueOrder(u,{kind:'move',x:300+i*35,y:1130});
 if(plan!=='raid'||earnedRaidStart===null||!active)return;
 const squad=alive(0).filter(u=>earnedRaidIds.includes(u.id));
 if(t-earnedRaidStart>=60){
  if(!earnedRaidReturned){selected=squad;tacticalOrders('retreat');earnedRaidReturned=true;}
 }else if(Math.floor(t)%3===0){
  const quarry=alive(1).find(u=>u.type==='quarry'&&sees(0,u));
  selected=squad.filter(u=>u.order?.kind!=='retreat');mode='attack';command(quarry||{x:1260,y:610});
 }
}
function earnedRaidObserve(){
 if(!alive(1).some(u=>u.id===earnedQuarryId))earnedQuarryDestroyed=true;
 for(const u of alive(1))if(!earnedBirths.has(u.id)){earnedBirths.add(u.id);if(u.type==='walker')earnedEnemyGuns++;}
}
function earnedRaidResult(){return {seconds:Math.round(t),ended,win:ended&&alive(0).some(u=>u.type==='core'),
 palace:Math.round(alive(0).find(u=>u.type==='core')?.hp||0),paidSappers:earnedRaidPaid,
 raidReadyAt:earnedRaidStart===null?null:Math.round(earnedRaidStart),raidersAlive:alive(0).filter(u=>earnedRaidIds.includes(u.id)).length,
 enemyGunsProduced:earnedEnemyGuns,enemyMaterials:Math.round(enemyMaterials),enemySpent:Math.round(enemySpent),
 originalQuarryDestroyed:earnedQuarryDestroyed,extractedMaterials:1600-nodes.find(n=>n.kind==='materials'&&n.x===1260).amount};}
