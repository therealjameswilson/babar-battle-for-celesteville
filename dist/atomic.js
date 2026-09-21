'use strict';
// Fictional endgame ability; all values are game balance, not weapon specifications.
const ATOMIC={cost:650,materials:200,build:75,warning:18,radius:150,damage:900};
let atomicStrikes=[],atomicTargetSite=null,atomicAIAt=0;
function atomicBusy(team){return alive(team).some(b=>b.atomicJob||b.atomicReady)||atomicStrikes.some(s=>s.team===team);}
function assembleAtomic(b){
  if(!running||paused||ended||!b||b.hp<=0||b.type!=='factory'||b.construction||b.research||b.queue.length||!supplied(b)||!factionResearch(b.team).has('atomic')||atomicBusy(b.team))return false;
  if((b.team?enemyBudget:ore)<ATOMIC.cost||(b.team?enemyMaterials:materials)<ATOMIC.materials)return false;
  if(b.team){enemyBudget-=ATOMIC.cost;enemyMaterials-=ATOMIC.materials;enemySpent+=ATOMIC.cost;}else{ore-=ATOMIC.cost;materials-=ATOMIC.materials;}
  b.atomicJob={progress:0};updateUI(true);return true;
}
function aimAtomic(b){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||b.team!==0)return false;
  atomicTargetSite=b;mode='atomic';placing=null;
  say('Select a visible target. Blast radius 150m; friendly fire. Launch gives 18 seconds warning.');return true;
}
function launchAtomic(b,p){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||!supplied(b)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>W||p.y<0||p.y>H||!observesPosition(b.team,p))return false;
  b.atomicReady=false;
  atomicStrikes.push({team:b.team,site:b,x:p.x,y:p.y,at:t+ATOMIC.warning});
  say((b.team?'RHINO':'ELEPHANT')+' ATOMIC LAUNCH. Evacuate the marked area. Destroy or isolate the launching Artillery Works to abort.');
  battleSound('cannon');updateUI(true);return true;
}
function updateAtomic(dt){
  for(const b of units.filter(b=>b.hp>0&&b.atomicJob)){
    if(supplied(b))b.atomicJob.progress+=dt;
    if(b.atomicJob.progress>=ATOMIC.build){b.atomicJob=null;b.atomicReady=true;if(!b.team)say('Atomic bomb ready at the Artillery Works.');updateUI(true);}
  }
  for(const strike of [...atomicStrikes]){
    if(strike.site.hp<=0||!supplied(strike.site)){
      atomicStrikes=atomicStrikes.filter(s=>s!==strike);say('Atomic launch aborted: command link lost. Payload expended.');continue;
    }
    if(t<strike.at)continue;
    const source={type:'factory',team:strike.team,id:strike.site.id,x:strike.x,y:strike.y};
    for(const u of units.filter(u=>u.hp>0&&dist(u,strike)<=ATOMIC.radius))
      damageUnit(source,u,ATOMIC.damage*(1-.5*dist(u,strike)/ATOMIC.radius));
    fx.push({x:strike.x,y:strike.y,life:1.5,max:1.5,burst:true,r:ATOMIC.radius});
    battleSound('cannon');say('Atomic impact. Both armies inside the blast area take damage.');
    atomicStrikes=atomicStrikes.filter(s=>s!==strike);
  }
  if(t<atomicAIAt)return;atomicAIAt=t+5;
  const factory=alive(1).find(b=>b.type==='factory'&&!b.construction&&supplied(b));
  if(!factory||!enemyTechnologies.has('atomic'))return;
  if(!atomicBusy(1)&&enemyBudget>=ATOMIC.cost+120)assembleAtomic(factory);
  if(!factory.atomicReady)return;
  const seen=alive(0).filter(u=>sees(1,u));
  const target=seen.map(u=>({u,score:seen.filter(v=>dist(u,v)<ATOMIC.radius).reduce((n,v)=>n+(defs[v.type].speed?1:4),0)}))
    .filter(({u,score})=>score>=4&&!alive(1).some(v=>dist(u,v)<ATOMIC.radius+40))
    .sort((a,b)=>b.score-a.score)[0]?.u;
  if(target)launchAtomic(factory,{x:target.x,y:target.y});
}
function atomicActions(a,u){
  if(selected.length!==1||u?.type!=='factory'||u.team!==0||u.construction)return;
  if(u.atomicJob)a.push(['Assembling atomic bomb',Math.ceil(ATOMIC.build-u.atomicJob.progress)+'s · '+(supplied(u)?'supplied':'ISOLATED'),()=>{},true]);
  else if(u.atomicReady)a.push(['Launch atomic bomb','Tap visible target · 18s warning · friendly fire',()=>aimAtomic(u),!supplied(u)]);
  else if(technologies.has('atomic'))a.push(['Assemble atomic bomb','650 S · 200 M · 75s · one per faction',()=>assembleAtomic(u),atomicBusy(0)||!!u.research||!!u.queue.length||!supplied(u)||ore<650||materials<200]);
}
function drawAtomicWarnings(){
  for(const s of atomicStrikes){
    ctx.save();ctx.strokeStyle='#ffba77';ctx.lineWidth=3;ctx.setLineDash([9,6]);
    ctx.beginPath();ctx.arc(s.x,s.y,ATOMIC.radius,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='#fff0cf';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText('ATOMIC IMPACT · '+Math.ceil(Math.max(0,s.at-t))+'s',s.x,s.y-ATOMIC.radius-12);ctx.restore();
  }
}
