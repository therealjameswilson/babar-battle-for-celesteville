'use strict';
// Optional, non-blocking field guidance. It observes play; it never grants resources
// or issues orders. Show-me controls use the same selection/placement UI as players.
const GUIDE_STEPS=['supplies','recruit','materials','scout','depot','artillery'];
let guideProgress={enabled:false,done:[],startUid:0},guideStamp='',guideOpen=false;
function resetFieldGuide(){
  guideProgress={enabled:!!$('guide-enabled')?.checked,done:[],startUid:uid};
  guideOpen=false;guideStamp='';
}
function restoreFieldGuide(saved){
  guideProgress=saved||{enabled:false,done:[],startUid:uid};guideOpen=false;guideStamp='';
}
function fieldGuideFacts(){
  const friends=alive(0),finished=type=>friends.find(u=>u.type===type&&!u.construction);
  return {friends,worker:finished('worker'),school:finished('forge'),quarry:finished('quarry'),
    supplies:friends.reduce((n,u)=>n+(u.deliveredSupplies||0),0),
    materials:friends.reduce((n,u)=>n+(u.deliveredMaterials||0),0),
    recruit:friends.some(u=>u.type==='trooper'&&u.id>guideProgress.startUid),
    scout:friends.find(u=>u.type==='scout'&&dist(u,depot)<vision(u)),
    depot:depot.team===0,gun:finished('walker'),factory:finished('factory')};
}
function fieldGuideAdvice(f){
  const step=GUIDE_STEPS.find(id=>!guideProgress.done.includes(id));
  // Recovery advice supersedes the lesson without erasing completed milestones.
  if(!f.worker)return {id:step||'complete',title:'Replace your provisioners',text:'Select the palace and recruit a Provisioner for 50 Supplies. Deliveries pay for every part of your army.',action:'Open palace',kind:'core'};
  if(populationBlocked(0))return {id:step||'complete',title:'Make room for reinforcements',text:'Your paid recruits are waiting for population space. Build a Village Home for 100 Supplies; a completed home adds 10 places.',action:'Place Village Home',kind:'relay'};
  if(!step)return {id:'complete',title:'Field training complete',text:'Keep supply routes open, combine infantry and artillery, and scout the fortress before advancing. The field manual explains the later technology branches.',action:'Open field manual',kind:'manual'};
  if(step==='supplies')return {id:step,title:'Bring supplies home',text:`${Math.min(20,Math.floor(f.supplies))}/20 delivered. Your provisioners begin gathering automatically. A full basket must reach a supplied palace or home before it can be spent. Select a provisioner, choose Gather, then tap a supplies cache to reassign it.`,action:'Find a provisioner',kind:'worker'};
  if(!f.school)return {id:step,title:'Rebuild the Guard School',text:'The Guard School recruits infantry and scouts. Place one near your palace so its supply link stays protected. Cost: 150 Supplies.',action:'Place Guard School',kind:'forge'};
  if(step==='recruit')return {id:step,title:'Recruit your first reinforcement',text:'Open the Guard School, then choose Elephant Guard. Its progress appears in the production report. Research occupies the same building and suspends recruitment.',action:'Open Guard School',kind:'school'};
  if(step==='materials')return {id:step,title:'Start materials deliveries',text:`${Math.min(20,Math.floor(f.materials))}/20 Materials delivered. Place a Materials Quarry on a grey rock deposit (100 Supplies). Its builder begins mining when it is complete. Keep the quarry linked to your palace; an isolated quarry stops extraction.`,action:f.quarry?'Inspect quarry':'Place Materials Quarry',kind:f.quarry?'quarry-view':'quarry'};
  if(step==='scout')return {id:step,title:'Scout the central depot',text:'Recruit a Scout at the Guard School. Select it, choose Move for reconnaissance without engaging, then tap near the central depot. Use the minimap to find the centre. Keep clear of enemy guns.',action:f.friends.some(u=>u.type==='scout')?'Find scout':'Open Guard School',kind:f.friends.some(u=>u.type==='scout')?'scout':'school'};
  if(step==='depot')return {id:step,title:'Secure the supply depot',text:'Bring infantry to the central depot and clear nearby enemies. Hold the area to capture it: +2 Supplies and +0.5 Munitions per second. Troops attack-move by default; Retreat withdraws wounded troops.',action:'View central depot',kind:'depot'};
  return {id:step,title:'Add a field gun',text:'Build Artillery Works after a Guard School (240 Supplies + 50 Materials), then recruit Field Artillery. Infantry should protect its minimum-range blind spot. Deploy the gun for longer range and keep a scout ahead for sight.',action:f.factory?'Open Artillery Works':'Place Artillery Works',kind:f.factory?'factory-view':'factory'};
}
function updateFieldGuide(force=false){
  const stamp=[running,ended,paused,guideProgress.enabled,guideOpen,Math.floor(t*4)].join(':');
  if(!force&&guideStamp===stamp)return;guideStamp=stamp;
  const toggle=$('guide-toggle'),panel=$('guide-panel');
  toggle.hidden=!running||ended||!guideProgress.enabled;
  panel.hidden=toggle.hidden||!guideOpen;
  if(toggle.hidden)return;
  const f=fieldGuideFacts(),conditions={supplies:f.supplies>=20,recruit:f.recruit,materials:f.materials>=20,scout:!!f.scout,depot:f.depot,artillery:!!f.gun};
  if(!paused)for(const id of GUIDE_STEPS)if(conditions[id]&&!guideProgress.done.includes(id))guideProgress.done.push(id);
  const advice=fieldGuideAdvice(f),number=GUIDE_STEPS.indexOf(advice.id)+1;
  toggle.textContent=number?`${number}/6 · ${advice.title}`:'Field adviser · complete';
  toggle.setAttribute('aria-label','Field adviser: '+advice.title);
  toggle.setAttribute('aria-expanded',String(guideOpen));
  $('guide-title').textContent=advice.title;$('guide-copy').textContent=advice.text;
  $('guide-action').textContent=advice.action;$('guide-action').disabled=paused;
  $('guide-action').dataset.kind=advice.kind;
}
function guideShowMe(){
  if(!running||paused||ended||document.querySelector('dialog[open]'))return;
  const kind=$('guide-action').dataset.kind,f=fieldGuideFacts();
  if(kind==='manual'){$('help').click();return;}
  if(['relay','forge','quarry','factory'].includes(kind)){
    selected=[f.worker].filter(Boolean);resetSubgroups();updateUI(true);build(kind);
    if(placing!==kind){updateFieldGuide(true);return;}
    if(kind==='quarry'){
      const deposit=nearest(f.worker,nodes.filter(n=>n.kind==='materials'&&n.amount>0));
      if(deposit){cam.x=deposit.x;cam.y=deposit.y;}
    }
  }else if(kind==='depot'){cam.x=depot.x;cam.y=depot.y;}
  else{
    const type={school:'forge','quarry-view':'quarry','factory-view':'factory'}[kind]||kind;
    const unit=f.friends.find(u=>u.type===type&&!u.construction);
    if(unit){
      if(!defs[unit.type].speed){selectProduction([unit]);if(['school','factory-view','core'].includes(kind)){actionCategory='recruit';renderActionFilters();}}
      else {selected=[unit];resetSubgroups();mode=placing=null;cam.x=unit.x;cam.y=unit.y;updateUI(true);}
    }
  }
  guideOpen=false;updateFieldGuide(true);
}
$('guide-toggle').onclick=()=>{guideOpen=!guideOpen;updateFieldGuide(true);};
$('guide-close').onclick=()=>{guideOpen=false;updateFieldGuide(true);$('guide-toggle').focus();};
$('guide-action').onclick=guideShowMe;
$('guide-dismiss').onclick=()=>{guideProgress.enabled=false;guideOpen=false;updateFieldGuide(true);};
$('guide-help').onclick=()=>{guideProgress.enabled=true;guideOpen=true;$('help-close').click();updateFieldGuide(true);};

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&guideOpen&&!document.querySelector('dialog[open]')){e.preventDefault();e.stopImmediatePropagation();$('guide-close').click();}
},true);
