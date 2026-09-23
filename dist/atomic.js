'use strict';
// Fictional endgame ability; all values are game balance, not weapon specifications.
const ATOMIC={cost:650,materials:200,uranium:40,build:75,warning:18,radius:150,damage:900};
const HBOMB={cost:1000,materials:350,uranium:80,build:110,warning:28,radius:230,damage:1350};
function payloadSpec(kind){return kind==='ballistic'?BALLISTIC:kind==='neutron'?NEUTRON:kind==='hydrogen'?HBOMB:ATOMIC;}
function payloadLabel(kind){return kind==='ballistic'?'BALLISTIC':kind==='neutron'?'NEUTRON':kind==='hydrogen'?'H-BOMB':'ATOMIC';}
function payloadName(kind){return kind==='ballistic'?'ballistic missile':kind==='neutron'?'neutron bomb':kind==='hydrogen'?'H-bomb':'atomic bomb';}
let atomicStrikes=[],atomicTargetSite=null,atomicAIAt=0;
function atomicBusy(team){return alive(team).some(b=>b.atomicJob||b.atomicReady)||atomicStrikes.some(s=>s.team===team&&s.kind!=='ballistic');}
function assembleAtomic(b,kind='atomic'){
  if(!['atomic','hydrogen'].includes(kind))return false;
  const spec=payloadSpec(kind);
  if(!running||paused||ended||!b||b.hp<=0||b.type!=='factory'||b.construction||b.research||b.queue.length||!supplied(b)||!factionResearch(b.team).has(kind)||atomicBusy(b.team))return false;
  if((b.team?enemyBudget:ore)<spec.cost||(b.team?enemyMaterials:materials)<spec.materials||(b.team?enemyUranium:uranium)<spec.uranium)return false;
  if(b.team){enemyBudget-=spec.cost;enemyMaterials-=spec.materials;enemyUranium-=spec.uranium;enemySpent+=spec.cost;}else{ore-=spec.cost;materials-=spec.materials;uranium-=spec.uranium;}
  b.atomicJob={progress:0,kind};updateUI(true);return true;
}
function aimAtomic(b){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||b.team!==0||nuclearAuthority(b.team).reason||selected.length!==1||selected[0]!==nuclearAuthority(b.team).leader)return false;
  atomicTargetSite=b;mode='atomic';placing=null;
  const spec=payloadSpec(b.atomicKind);
  say(payloadLabel(b.atomicKind)+': select a visible target. Blast radius '+spec.radius+'m; friendly fire. Launch gives '+spec.warning+' seconds warning.');return true;
}
function launchAtomic(b,p){
  if(!running||paused||ended||!b?.atomicReady||b.hp<=0||nuclearAuthority(b.team).reason||atomicStrikes.some(s=>s.team===b.team&&s.kind!=='ballistic')||!supplied(b)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>W||p.y<0||p.y>H||!observesPosition(b.team,p))return false;
  const kind=b.atomicKind||'atomic',spec=payloadSpec(kind);
  b.atomicReady=false;
  atomicStrikes.push({team:b.team,site:b,kind,x:p.x,y:p.y,at:t+spec.warning});
  say((b.team?'RATAXES':'BABAR')+' AUTHORIZES '+payloadLabel(kind)+' LAUNCH. Evacuate the marked area. Destroy or isolate the launching Artillery Works to abort.');
  battleSound('cannon');updateUI(true);return true;
}
function updateAtomic(dt){
  updateCivilDefense();
  for(const b of units.filter(b=>b.hp>0&&b.atomicJob)){
    if(supplied(b))b.atomicJob.progress+=dt;
    if(b.atomicJob.progress>=payloadSpec(b.atomicJob.kind).build){nuclearAcquired[b.team]=true;b.atomicKind=b.atomicJob.kind||'atomic';b.atomicJob=null;b.atomicReady=true;if(!b.team)say(payloadName(b.atomicKind)+' ready at the Artillery Works.');updateUI(true);}
  }
  for(const strike of [...atomicStrikes]){
    const spec=payloadSpec(strike.kind);
    if(!strikeCommandActive(strike)){
      atomicStrikes=atomicStrikes.filter(s=>s!==strike);say(payloadLabel(strike.kind)+' launch aborted: command link lost. Payload expended.');continue;
    }
    if(interceptMissile(strike)){atomicStrikes=atomicStrikes.filter(s=>s!==strike);continue;}
    if(t<strike.at)continue;
    const source={type:'factory',team:strike.team,id:strike.site.id,x:strike.x,y:strike.y};
    // Snapshot shelter protection before damage so unit iteration order cannot change survival.
    const protectedWorkers=new Set(units.filter(civilDefenseProtected));
    for(const u of units.filter(u=>u.hp>0&&dist(u,strike)<=spec.radius))
      damageUnit(source,u,(strike.kind==='neutron'&&!defs[u.type].speed?NEUTRON.buildingDamage:spec.damage)*(1-.5*dist(u,strike)/spec.radius),strike.kind!=='ballistic'&&protectedWorkers.has(u)?.05:1);
    fx.push(strike.kind==='ballistic'?{x:strike.x,y:strike.y,life:1,max:1,burst:true,r:BALLISTIC.radius}:mushroomCloudEffect(strike));
    battleSound('cannon');say(payloadLabel(strike.kind)+' impact. Both armies inside the blast area take damage.');
    atomicStrikes=atomicStrikes.filter(s=>s!==strike);
  }
  enemyMissileOrders();
  if(t<atomicAIAt)return;atomicAIAt=t+5;
  const factory=alive(1).find(b=>b.type==='factory'&&!b.construction&&supplied(b));
  if(!factory||!enemyTechnologies.has('atomic'))return;
  const kind=enemyTechnologies.has('hydrogen')&&enemyBudget>=HBOMB.cost+120&&enemyMaterials>=HBOMB.materials&&enemyUranium>=HBOMB.uranium?'hydrogen':'atomic';
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
  if(selected.length===1&&u?.type==='hero'&&u.team===0){leaderNuclearActions(a,u);return;}
  if(selected.length!==1||u?.type!=='factory'||u.team!==0||u.construction)return;
  if(u.atomicJob)a.push(['Assembling '+payloadName(u.atomicJob.kind),Math.ceil(payloadSpec(u.atomicJob.kind).build-u.atomicJob.progress)+'s · '+(supplied(u)?'supplied':'ISOLATED'),()=>{},true]);
  else if(u.atomicReady)a.push([payloadName(u.atomicKind)+' ready','Select Babar to authorize launch; direct sight to headquarters required.',()=>{},true]);
  else for(const kind of ['atomic','hydrogen'])if(technologies.has(kind)){
    const spec=payloadSpec(kind);
    a.push(['Assemble '+payloadName(kind),spec.cost+' S · '+spec.materials+' M · '+spec.uranium+' U · '+spec.build+'s · shared one-payload limit',()=>assembleAtomic(u,kind),atomicBusy(0)||!!u.research||!!u.queue.length||!supplied(u)||ore<spec.cost||materials<spec.materials||uranium<spec.uranium]);
  }
}

// Public launch warnings trigger civil defense for both factions, including friendly fire.
function civilDefenseProtected(w){
  const b=w.civilDefense?.shelter;
  return w.hp>0&&w.type==='worker'&&b?.hp>0&&!b.construction&&dist(w,b)<=110;
}
function updateCivilDefense(){
  const warnings=atomicStrikes.filter(s=>s.kind!=='ballistic'&&strikeCommandActive(s));
  for(const w of units.filter(w=>w.hp>0&&w.type==='worker')){
    if(!warnings.length){
      if(w.civilDefense&&t>=w.civilDefense.until){w.civilDefense=null;w.path=null;w.resolvedDestination=null;}
      continue;
    }
    const shelters=alive(w.team).filter(b=>b.type==='shelter'&&!b.construction);
    shelters.sort((a,b)=>{
      const risk=p=>warnings.some(s=>dist(p,s)<payloadSpec(s.kind).radius+110)?10000:0;
      return risk(a)+dist(w,a)-risk(b)-dist(w,b);
    });
    const shelter=shelters[0];
    if(!shelter){w.civilDefense=null;continue;}
    if(w.civilDefense?.shelter!==shelter){w.path=null;w.resolvedDestination=null;}
    w.civilDefense={shelter,until:t+3};
  }
}
function civilianEvacuation(w,dt){
  const b=w.civilDefense?.shelter;
  if(!b)return false;
  if(b.hp<=0||b.construction){w.civilDefense=null;w.path=null;return false;}
  const angle=(w.id%16)/16*Math.PI*2,radius=60+Math.floor(w.id/16)%2*28;
  move(w,{x:b.x+Math.cos(angle)*radius,y:b.y+Math.sin(angle)*radius},dt,5);
  return true;
}

// Nuclear release requires the living faction leader's own sight, never allied vision.
function nuclearAuthority(team){
  const leader=alive(team).find(u=>u.type==='hero');
  const name=team?'Rataxes':'Babar';
  if(!leader)return {leader:null,hq:null,reason:name+' is unavailable. Nuclear launch locked.'};
  const hq=alive(team).find(b=>['core','headquarters'].includes(b.type)&&!b.construction&&leaderSeesHeadquarters(leader,b));
  return {leader,hq,reason:hq?'':name+' needs direct line of sight to a friendly Palace/Fortress or Field Headquarters.'};
}
function leaderSeesHeadquarters(leader,hq){
  if(dist(leader,hq)>vision(leader))return false;
  const length=dist(leader,hq),dx=hq.x-leader.x,dy=hq.y-leader.y;
  const blockers=units.filter(b=>b.hp>0&&!defs[b.type].speed&&b.type!=='trench'&&b!==hq);
  // Sample the open segment at <=4m; terrain rectangles and structures occlude sight.
  for(let d=4;d<length-hq.r;d+=4){
    const p={x:leader.x+dx*d/length,y:leader.y+dy*d/length};
    if(obstacles.some(o=>p.x>o.x&&p.x<o.x+o.w&&p.y>o.y&&p.y<o.y+o.h)||
      blockers.some(b=>dist(p,b)<b.r))return false;
  }
  return true;
}
function leaderNuclearActions(a,u){
  const authority=nuclearAuthority(u.team),locked=!!authority.reason;
  for(const b of alive(u.team).filter(b=>b.type==='factory'&&b.atomicReady)){
    a.push(['Launch '+payloadName(b.atomicKind),authority.reason||'Leader authorization · '+payloadSpec(b.atomicKind).warning+'s warning',()=>aimAtomic(b),locked||!supplied(b)||atomicStrikes.some(s=>s.team===u.team&&s.kind!=='ballistic')]);
  }
  const bike=alive(u.team).find(v=>v.type==='bike');
  if(bike){
    const status=authority.reason||(!nuclearAcquired[u.team]?'Complete your first atomic or H-bomb':
      t<(bike.neutronReadyAt||0)?Math.ceil(bike.neutronReadyAt-t)+'s cooldown':'Authorize Arthur · 400 S · 120 M · 30 U · 360m from motorbike');
    a.push(['Authorize neutron strike',status,()=>aimNeutron(bike),locked||!neutronReady(bike)]);
  }
}

// Contextual, non-modal reference card. Enemy projects are shown only while observed.
function nuclearBriefingContext() {
  const pursuing = b => ['atomic','hydrogen'].includes(b.research?.id) || b.atomicJob || b.atomicReady;
  const chosen = selected.length === 1 ? selected[0] : null;
  if (chosen?.team === 0 && chosen.hp > 0 &&
      ((chosen.type === 'factory' && !chosen.construction &&
        (pursuing(chosen) || technologies.has('atomic') || !researchRequirement('atomic',0))) ||
       (chosen.type === 'hero' && technologies.has('atomic')))) return 0;
  if (alive(0).some(pursuing)) return 0;
  if (alive(1).some(b => pursuing(b) && visible(b))) return 1;
  return null;
}
function renderNuclearBriefing() {
  const card = $('nuclear-briefing');
  if (!card) return;
  const team = nuclearBriefingContext();
  card.hidden = team === null;
  if (team === null) return;
  $('nuclear-briefing-title').textContent = (team ? 'Rataxes' : 'Babar') + ' · Nuclear decision';
  $('nuclear-briefing-text').textContent = team
    ? 'Scouts report a Rhino nuclear project. Prepare Civil Defense, protect supply lines and position missile defenses.'
    : 'Nuclear research commits scarce supplies. Secure Uranium deliveries, prepare Civil Defense and keep the king in sight of headquarters for launch.';
}
