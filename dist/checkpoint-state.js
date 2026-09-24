'use strict';
// Versioned graph snapshots preserve entity identity across orders, maps and queues.
// Only engine state is stored: never DOM nodes, artwork, audio or callbacks.
const CHECKPOINT_SCHEMA=1, CHECKPOINT_LIMIT=4*1024*1024;
function checkpointGraph(root){
  const seen=new Map(),graph=[];
  function encode(value){
    if(value===undefined)return {u:1};
    if(value===null||typeof value==='string'||typeof value==='boolean')return value;
    if(typeof value==='number'){
      if(!Number.isFinite(value))throw Error('Non-finite checkpoint value');
      return value;
    }
    if(typeof value!=='object')throw Error('Unsupported checkpoint value');
    if(seen.has(value))return {r:seen.get(value)};
    if(graph.length>=50000)throw Error('Checkpoint too complex');
    const id=graph.length;seen.set(value,id);graph.push(null);
    if(Array.isArray(value))graph[id]=['array',value.map(encode)];
    else if(value instanceof Map)graph[id]=['map',[...value].map(([k,v])=>[encode(k),encode(v)])];
    else if(value instanceof Set)graph[id]=['set',[...value].map(encode)];
    else {
      if(![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw Error('Unsupported checkpoint object');
      graph[id]=['object',Object.entries(value).map(([k,v])=>[k,encode(v)])];
    }
    return {r:id};
  }
  return {root:encode(root),graph};
}
function restoreCheckpointGraph(data){
  if(!data||!Array.isArray(data.graph)||data.graph.length>50000)throw Error('Invalid checkpoint graph');
  const allowed=['array','object','map','set'];
  for(const node of data.graph)if(!Array.isArray(node)||node.length!==2||!allowed.includes(node[0])||!Array.isArray(node[1])||node[1].length>20000)throw Error('Invalid graph node');
  const objects=data.graph.map(([type])=>type==='array'?[]:type==='map'?new Map():type==='set'?new Set():Object.create(null));
  function decode(value){
    if(value===null||typeof value==='boolean'||typeof value==='string'&&value.length<=10000)return value;
    if(typeof value==='number'&&Number.isFinite(value))return value;
    if(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===1){
      if(value.u===1)return undefined;
      if(Number.isInteger(value.r)&&value.r>=0&&value.r<objects.length)return objects[value.r];
    }
    throw Error('Invalid checkpoint reference');
  }
  data.graph.forEach(([type,entries],i)=>{
    const target=objects[i];
    for(const entry of entries){
      if(type==='array')target.push(decode(entry));
      else if(type==='set')target.add(decode(entry));
      else {
        if(!Array.isArray(entry)||entry.length!==2)throw Error('Invalid checkpoint entry');
        if(type==='map')target.set(decode(entry[0]),decode(entry[1]));
        else {
          const key=entry[0];
          if(typeof key!=='string'||key.length>120||['__proto__','prototype','constructor'].includes(key)||Object.hasOwn(target,key))throw Error('Invalid checkpoint property');
          target[key]=decode(entry[1]);
        }
      }
    }
  });
  return decode(data.root);
}
function checkpointState(){
  return {units,nodes,selected,uid,t,wave,nextWave,enemySpawn,kills,easy,ore,
    materials,enemyMaterials,uranium,enemyUranium,munitions,cam,
    technologies,enemyTechnologies,benefits,usedPowers,revealUntil,heroRecovery,
    depot,enemyBudget,enemySpent,linked,intel,logbook,supplyClock,resourceMemory,
    enemyResourceReports,enemyThreatReports,enemyScoutSent,enemyReconNextAt,
    atomicStrikes,atomicAIAt,nuclearAcquired,controlGroups,queueOrders,cameraViews,
    navVersion,attackReports,attackCursor,attackToneAt,fieldGuide:typeof guideProgress==='undefined'?null:guideProgress};
}
function validateCheckpointState(s){
  const fail=()=>{throw Error('This checkpoint contains invalid game state');};
  const finite=(n,min=-1e9,max=1e9)=>Number.isFinite(n)&&n>=min&&n<=max;
  if(!s||typeof s!=='object')fail();
  for(const key of ['uid','t','wave','nextWave','enemySpawn','kills','ore','materials','enemyMaterials','uranium','enemyUranium','munitions','revealUntil','enemyBudget','enemySpent','supplyClock','enemyReconNextAt','atomicAIAt','navVersion','attackCursor','attackToneAt'])if(!finite(s[key]))fail();
  for(const key of ['uid','wave','kills','navVersion','attackCursor'])if(!Number.isInteger(s[key])||s[key]<0)fail();
  if(s.t<0||s.munitions<0||s.munitions>100||typeof s.easy!=='boolean'||typeof s.enemyScoutSent!=='boolean'||typeof s.queueOrders!=='boolean')fail();
  for(const key of ['units','nodes','selected','heroRecovery','intel','logbook','resourceMemory','atomicStrikes','nuclearAcquired','cameraViews','attackReports'])if(!Array.isArray(s[key]))fail();
  if(s.units.length>2000||s.nodes.length>128||s.selected.length>2000||s.intel.length!==2||s.resourceMemory.length!==2||s.cameraViews.length!==4||s.nuclearAcquired.length!==2)fail();
  for(const key of ['technologies','enemyTechnologies','benefits','linked'])if(!(s[key] instanceof Set))fail();
  for(const key of ['enemyResourceReports','enemyThreatReports'])if(!(s[key] instanceof Map))fail();
  if(!s.resourceMemory.every(m=>m instanceof Map)||!s.nuclearAcquired.every(v=>typeof v==='boolean'))fail();
  for(const tech of [...s.technologies,...s.enemyTechnologies])if(!Object.hasOwn(researchDefs,tech))fail();
  for(const benefit of s.benefits)if(!COURT.some(c=>c.id===benefit))fail();
  if(!s.usedPowers||!s.controlGroups||typeof s.usedPowers!=='object'||typeof s.controlGroups!=='object')fail();
  if(!s.cam||!finite(s.cam.x,0,W)||!finite(s.cam.y,0,H)||!finite(s.cam.zoom,.3,2))fail();
  if(!s.depot||![-1,0,1].includes(s.depot.team)||!finite(s.depot.progress,0,100)||!finite(s.depot.x,0,W)||!finite(s.depot.y,0,H))fail();
  const point=p=>p&&finite(p.x,-100,W+100)&&finite(p.y,-100,H+100);
  const entity=u=>point(u)&&Object.hasOwn(defs,u.type)&&[0,1].includes(u.team)&&Number.isInteger(u.id)&&finite(u.hp);
  function order(o){
    if(!o)return;
    if(!['move','attack','gather','repair','build','hold','retreat','patrol'].includes(o.kind))fail();
    if(['gather'].includes(o.kind)&&!s.nodes.includes(o.node))fail();
    if(o.target&&!entity(o.target))fail();
    if(o.x!==undefined&&(!finite(o.x)||!finite(o.y)))fail();
  }
  for(const entry of s.heroRecovery)if(!entry||![0,1].includes(entry.team)||!finite(entry.at)||typeof entry.name!=='string')fail();
  for(const entry of s.logbook)if(typeof entry!=='string'&&(!entry||typeof entry.text!=='string'||!finite(entry.at)))fail();
  for(const report of s.attackReports)if(!point(report)||!finite(report.at)||typeof report.label!=='string')fail();
  for(const [id,report] of s.enemyThreatReports)if(!Number.isInteger(id)||!point(report)||!finite(report.at))fail();
  for(const map of s.resourceMemory)for(const amount of map.values())if(!finite(amount,0))fail();
  for(const report of s.enemyResourceReports.values())if(!point(report)||!finite(report.amount,0)||!finite(report.at))fail();
  if(s.fieldGuide&&(typeof s.fieldGuide.enabled!=='boolean'||!Number.isInteger(s.fieldGuide.startUid)||s.fieldGuide.startUid<0||s.fieldGuide.startUid>s.uid||!Array.isArray(s.fieldGuide.done)||s.fieldGuide.done.length>6||s.fieldGuide.done.some(id=>!['supplies','recruit','materials','scout','depot','artillery'].includes(id))))fail();
  const ids=new Set();
  for(const u of s.units){
    if(!u||!Object.hasOwn(defs,u.type)||![0,1].includes(u.team)||!Number.isInteger(u.id)||u.id<1||u.id>s.uid||ids.has(u.id))fail();
    ids.add(u.id);
    if(!finite(u.x,-100,W+100)||!finite(u.y,-100,H+100)||!finite(u.hp,-100000,100000)||!finite(u.max,1,100000)||!finite(u.r,1,100)||!finite(u.morale,0,100)||!finite(u.cool)||!finite(u.progress,0)||!Array.isArray(u.queue)||u.queue.length>5||u.queue.some(type=>!Object.hasOwn(defs,type)||!defs[type].speed))fail();
    if(u.research&&(!Object.hasOwn(researchDefs,u.research.id)||!finite(u.research.progress,0)))fail();
    if(u.atomicJob&&(!['atomic','hydrogen'].includes(u.atomicJob.kind)||!finite(u.atomicJob.progress,0)))fail();
    if(u.orders&&(!Array.isArray(u.orders)||u.orders.length>16))fail();
    order(u.order);for(const o of u.orders||[])order(o);
    if(u.path&&(!Array.isArray(u.path)||u.path.length>10000||!u.path.every(point)))fail();
    if(u.civilDefense&&(!entity(u.civilDefense.shelter)||!finite(u.civilDefense.until)))fail();
  }
  if(!s.units.some(u=>u.team===0&&u.type==='core'&&u.hp>0)||!s.units.some(u=>u.team===1&&u.type==='core'&&u.hp>0))fail();
  if(s.selected.some(u=>!s.units.includes(u)||u.team!==0||u.hp<=0))fail();
  for(const n of s.nodes)if(!n||!finite(n.x,0,W)||!finite(n.y,0,H)||!finite(n.amount,0)||!finite(n.r,1,100)||![undefined,'supplies','materials','uranium'].includes(n.kind))fail();
  for(const map of [...s.resourceMemory,s.enemyResourceReports])for(const [node] of map)if(!s.nodes.includes(node))fail();
  for(const rows of s.intel){if(!Array.isArray(rows)||rows.length>4000)fail();for(const row of rows)if(!Object.hasOwn(defs,row.type)||!finite(row.x)||!finite(row.y)||!finite(row.seen))fail();}
  for(const strike of s.atomicStrikes)if(!strike||!['atomic','hydrogen','ballistic','neutron'].includes(strike.kind)||![0,1].includes(strike.team)||!strike.site||!finite(strike.site.hp)||!finite(strike.site.id,1)||!finite(strike.x,0,W)||!finite(strike.y,0,H)||!finite(strike.at,s.t-1))fail();
  for(const group of Object.values(s.controlGroups))if(!Array.isArray(group)||group.length>2000||group.some(id=>!Number.isInteger(id)||id<1))fail();
  for(const value of Object.values(s.usedPowers))if(!finite(value))fail();
  for(const view of s.cameraViews)if(view&&(!finite(view.x,0,W)||!finite(view.y,0,H)||!finite(view.zoom,.3,2)))fail();
  return s;
}
function createCheckpoint(missionId){
  if(!running||ended)throw Error('No active battle to save');
  const state=validateCheckpointState(checkpointState());
  const text=JSON.stringify({game:'babar-siege',schema:CHECKPOINT_SCHEMA,missionId,savedAt:Date.now(),data:checkpointGraph(state)});
  if(text.length>CHECKPOINT_LIMIT)throw Error('Checkpoint exceeds storage limit');
  return text;
}
function readCheckpoint(text){
  if(typeof text!=='string'||text.length>CHECKPOINT_LIMIT)throw Error('Invalid checkpoint size');
  const record=JSON.parse(text);
  if(record.game!=='babar-siege'||record.schema!==CHECKPOINT_SCHEMA)throw Error('This checkpoint uses an unsupported version');
  if(typeof record.missionId!=='string'||record.missionId.length>100||!Number.isFinite(record.savedAt))throw Error('Invalid checkpoint header');
  record.state=validateCheckpointState(restoreCheckpointGraph(record.data));return record;
}
function applyCheckpoint(record){
  const s=validateCheckpointState(record.state);
  helpWasPaused=true;courtWasPaused=true;$('groups-dialog').onclose=null;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  ({units,nodes,selected,uid,t,wave,nextWave,enemySpawn,kills,easy,ore,
    materials,enemyMaterials,uranium,enemyUranium,munitions,cam,
    technologies,enemyTechnologies,benefits,usedPowers,revealUntil,heroRecovery,
    depot,enemyBudget,enemySpent,linked,intel,logbook,supplyClock,resourceMemory,
    enemyResourceReports,enemyThreatReports,enemyScoutSent,enemyReconNextAt,
    atomicStrikes,atomicAIAt,nuclearAcquired,controlGroups,queueOrders,cameraViews,
    navVersion,attackReports,attackCursor,attackToneAt}=s);
  // Recreate derived caches while retaining valid path versions and graph identity.
  navStamp='';navVersion--;rebuildNav();solidCacheAt=solidCacheCount=sightAt=sightCount=-1;
  navStats={searches:0,expanded:0};fx=[];resetSimulationClock();resetSubgroups();minimapGesture=null;lastUnitTap=null;
  running=true;paused=true;ended=false;mode=placing=atomicTargetSite=down=null;keys={};panMode=false;
  closeCameraViews();closeProduction();if(typeof controllerPanel==='function')controllerPanel(false);
  $('overlay').classList.add('hidden');$('pause').textContent='Resume';$('pan').setAttribute('aria-pressed','false');
  $('queue-orders').setAttribute('aria-pressed',String(queueOrders));
  if($('difficulty'))$('difficulty').value=easy?'easy':'normal';
  if(typeof restoreFieldGuide==='function')restoreFieldGuide(s.fieldGuide);
  actionKey='';uiTime=t;updateAttackAlert();updateUI(true);
  $('toast').textContent='Checkpoint restored. Return to command when ready.';toastUntil=t+5;
  if(typeof updatePresentation==='function')updatePresentation();
  return true;
}
