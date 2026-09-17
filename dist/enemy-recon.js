'use strict';
const RECON_SITES=[{x:650,y:880},{x:650,y:440},{x:1040,y:900},{x:1100,y:430}];
let enemyReconNextAt=22;
function recruitEnemyRecon(buildings){
  if(t<enemyReconNextAt||alive(1).some(u=>u.recon)||buildings.some(b=>b.queue.includes('scout')))return false;
  if(!enemyQueue('scout'))return false;
  enemyReconNextAt=t+(easy?75:55);
  return true;
}
function reconSiteSafe(p){
  return !intel[1].some(r=>defs[r.type].damage&&(!defs[r.type].speed||t-r.seen<=60)&&
    dist(r,p)<(r.type==='walker'?SIEGE.range:(defs[r.type].range||0))+defs[r.type].r+70);
}
function enemyReconThink(){
  for(const scout of alive(1).filter(u=>u.recon)){
    if(scout.order?.kind==='retreat')continue;
    const threatened=alive(0).some(u=>defs[u.type].damage&&sees(1,u)&&
      dist(u,scout)<weaponRange(u)+u.r+70);
    if(threatened||scout.hp<scout.max*.6||scout.morale<60){
      scout.reconRestUntil=t+8;scout.reconGoal=null;orderRetreat(scout);continue;
    }
    if(t<(scout.reconRestUntil||0)||scout.hp<scout.max*.8||scout.morale<80)continue;
    scout.reconVisits ||= {};
    if(scout.reconGoal&&dist(scout,scout.reconGoal)<35){
      scout.reconVisits[scout.reconGoal.key]=t;scout.reconGoal=null;
    }
    if(scout.reconGoal&&reconSiteSafe(scout.reconGoal)&&scout.order?.kind==='move')continue;
    const options=RECON_SITES.map((p,key)=>({...p,key})).filter(reconSiteSafe)
      .sort((a,b)=>(scout.reconVisits[a.key]??-1)-(scout.reconVisits[b.key]??-1)||a.key-b.key);
    const goal=options[0];
    if(!goal){scout.reconRestUntil=t+8;scout.reconGoal=null;orderRetreat(scout);continue;}
    scout.reconGoal=goal;issueOrder(scout,{kind:'move',x:goal.x,y:goal.y});
  }
}
