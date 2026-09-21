'use strict';
// Fictional endgame ability; all values are game balance, not weapon specifications.
const ATOMIC={cost:650,materials:200,build:75,warning:18,radius:150,damage:900};
const HBOMB={cost:1000,materials:350,build:110,warning:28,radius:230,damage:1350};
function payloadSpec(kind){return kind==='hydrogen'?HBOMB:ATOMIC;}
function payloadLabel(kind){return kind==='hydrogen'?'H-BOMB':'ATOMIC';}
function payloadName(kind){return kind==='hydrogen'?'H-bomb':'atomic bomb';}
let atomicStrikes=[],atomicTargetSite=null,atomicAIAt=0;
function atomicBusy(team){return alive(team).some(b=>b.atomicJob||b.atomicReady)||atomicStrikes.some(s=>s.team===team);}
function assembleAtomic(b,kind='atomic'){
  if(!['atomic','hydrogen'].includes(kind))return false;
  const spec=payloadSpec(kind);
  if(!running||paused||ended||!b||b.hp<=0||b.type!=='factory'||b.construction||b.research||b.queue.length||!supplied(b)||!factionResearch(b.team).has(kind)||atomicBusy(b.team))return false;
  if((b.team?enemyBudget:ore)<spec.cost||(b.team?enemyMaterials:materials)<spec.materials)return false;
  if(b.team){enemyBudget-=spec.cost;enemyMaterials-=spec.materials;enemySpent+=spec.cost;}else{ore-=spec.cost;materials-=spec.materials;}
  b.atomicJob={progress:0,kind};updateUI(true);return true;
}
function aimAtomic(b){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||b.team!==0)return false;
  atomicTargetSite=b;mode='atomic';placing=null;
  const spec=payloadSpec(b.atomicKind);
  say(payloadLabel(b.atomicKind)+': select a visible target. Blast radius '+spec.radius+'m; friendly fire. Launch gives '+spec.warning+' seconds warning.');return true;
}
function launchAtomic(b,p){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||!supplied(b)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>W||p.y<0||p.y>H||!observesPosition(b.team,p))return false;
  const kind=b.atomicKind||'atomic',spec=payloadSpec(kind);
  b.atomicReady=false;
  atomicStrikes.push({team:b.team,site:b,kind,x:p.x,y:p.y,at:t+spec.warning});
  say((b.team?'RHINO':'ELEPHANT')+' '+payloadLabel(kind)+' LAUNCH. Evacuate the marked area. Destroy or isolate the launching Artillery Works to abort.');
  battleSound('cannon');updateUI(true);return true;
}
function updateAtomic(dt){
  for(const b of units.filter(b=>b.hp>0&&b.atomicJob)){
    if(supplied(b))b.atomicJob.progress+=dt;
    if(b.atomicJob.progress>=payloadSpec(b.atomicJob.kind).build){b.atomicKind=b.atomicJob.kind||'atomic';b.atomicJob=null;b.atomicReady=true;if(!b.team)say(payloadName(b.atomicKind)+' ready at the Artillery Works.');updateUI(true);}
  }
  for(const strike of [...atomicStrikes]){
    const spec=payloadSpec(strike.kind);
    if(strike.site.hp<=0||!supplied(strike.site)){
      atomicStrikes=atomicStrikes.filter(s=>s!==strike);say(payloadLabel(strike.kind)+' launch aborted: command link lost. Payload expended.');continue;
    }
    if(t<strike.at)continue;
    const source={type:'factory',team:strike.team,id:strike.site.id,x:strike.x,y:strike.y};
    for(const u of units.filter(u=>u.hp>0&&dist(u,strike)<=spec.radius))
      damageUnit(source,u,spec.damage*(1-.5*dist(u,strike)/spec.radius));
    fx.push({x:strike.x,y:strike.y,life:1.5,max:1.5,burst:true,r:spec.radius});
    battleSound('cannon');say(payloadLabel(strike.kind)+' impact. Both armies inside the blast area take damage.');
    atomicStrikes=atomicStrikes.filter(s=>s!==strike);
  }
  if(t<atomicAIAt)return;atomicAIAt=t+5;
  const factory=alive(1).find(b=>b.type==='factory'&&!b.construction&&supplied(b));
  if(!factory||!enemyTechnologies.has('atomic'))return;
  const kind=enemyTechnologies.has('hydrogen')&&enemyBudget>=HBOMB.cost+120&&enemyMaterials>=HBOMB.materials?'hydrogen':'atomic';
  if(!atomicBusy(1)&&enemyBudget>=payloadSpec(kind).cost+120)assembleAtomic(factory,kind);
  if(!factory.atomicReady)return;
  const spec=payloadSpec(factory.atomicKind);
  const seen=alive(0).filter(u=>sees(1,u));
  const target=seen.map(u=>({u,score:seen.filter(v=>dist(u,v)<spec.radius).reduce((n,v)=>n+(defs[v.type].speed?1:4),0)}))
    .filter(({u,score})=>score>=4&&!alive(1).some(v=>dist(u,v)<spec.radius+40))
    .sort((a,b)=>b.score-a.score)[0]?.u;
  if(target)launchAtomic(factory,{x:target.x,y:target.y});
}
function atomicActions(a,u){
  if(selected.length!==1||u?.type!=='factory'||u.team!==0||u.construction)return;
  if(u.atomicJob)a.push(['Assembling '+payloadName(u.atomicJob.kind),Math.ceil(payloadSpec(u.atomicJob.kind).build-u.atomicJob.progress)+'s · '+(supplied(u)?'supplied':'ISOLATED'),()=>{},true]);
  else if(u.atomicReady)a.push(['Launch '+payloadName(u.atomicKind),'Tap visible target · '+payloadSpec(u.atomicKind).warning+'s warning · friendly fire',()=>aimAtomic(u),!supplied(u)]);
  else for(const kind of ['atomic','hydrogen'])if(technologies.has(kind)){
    const spec=payloadSpec(kind);
    a.push(['Assemble '+payloadName(kind),spec.cost+' S · '+spec.materials+' M · '+spec.build+'s · shared one-payload limit',()=>assembleAtomic(u,kind),atomicBusy(0)||!!u.research||!!u.queue.length||!supplied(u)||ore<spec.cost||materials<spec.materials]);
  }
}
