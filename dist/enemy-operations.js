'use strict';
// Plans use intelligence snapshots. Hidden live objects never enter target scoring.
function enemyRaidTarget() {
  const reports=intel[1];
  const targets=reports.filter(r=>['quarry','relay','worker'].includes(r.type)&&
    (r.type!=='worker'||t-r.seen<=30));
  const ranked=targets.map(r=>{
    const defenders=reports.filter(d=>defs[d.type].damage&&(!defs[d.type].speed||t-d.seen<=60)&&dist(d,r)<260);
    const danger=defenders.reduce((n,d)=>n+(d.type==='turret'?3:d.type==='walker'?2:1),0);
    const value=r.type==='quarry'?6:r.type==='relay'?4:2;
    return {r,danger,score:value-danger*2};
  }).filter(p=>p.danger<3&&p.score>0);
  ranked.sort((a,b)=>b.score-a.score||b.r.seen-a.r.seen||a.r.id-b.r.id);
  const best=ranked[0]?.r;
  return best?{x:best.x,y:best.y,type:best.type,id:best.id}:null;
}
function dispatchEnemyAssault(number) {
  const troops=alive(1).filter(u=>!u.recon&&defs[u.type].damage&&defs[u.type].speed&&
    (u.type!=='hero'||number>=2)&&u.morale>50&&u.hp/u.max>=.4&&u.order?.kind!=='retreat');
  const known=intel[1].filter(k=>k.type==='core').sort((a,b)=>b.seen-a.seen)[0];
  const goal=known?{x:known.x,y:known.y}:{x:320,y:900};
  const target=number%3===0?enemyRaidTarget():null;
  // Preserve at least four troops in the main column; guns and officers stay there.
  const count=target?Math.min(easy?3:4,Math.max(0,troops.length-4)):0;
  const raiders=count>=2?troops.filter(u=>['scout','sapper','trooper'].includes(u.type))
    .sort((a,b)=>({scout:0,sapper:1,trooper:2}[a.type]-{scout:0,sapper:1,trooper:2}[b.type])||a.id-b.id).slice(0,count):[];
  if(raiders.length<2)raiders.length=0;
  const staging=target?{x:950,y:target.y>800?1050:430}:null;
  for(const u of troops){
    u.followup=null;
    if(raiders.includes(u)){
      issueOrder(u,{kind:'attack',...staging});
      issueOrder(u,{kind:'attack',x:target.x,y:target.y},true);
    }else issueOrder(u,{kind:'attack',...goal});
  }
  return {raiders,main:troops.filter(u=>!raiders.includes(u)),target:raiders.length?target:null};
}
