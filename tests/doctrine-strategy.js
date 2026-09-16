// Paid full-match policies. No resource, research, unit or visibility grants.
let doctrinePurchases=[],doctrineReadyAt=null,doctrineActivations=0,doctrineBirths=new Set(),doctrineProduced={};
let doctrineSchoolId=null,doctrineSchoolBuilds=[],doctrineSchoolReadyAt=null,doctrineOverlap=0,doctrinePreviousProgress=null;
function doctrineSetup(story=false){
 uid=0;easy=story;reset();running=true;paused=false;
 doctrinePurchases=[];doctrineReadyAt=null;doctrineActivations=0;
 doctrineSchoolId=null;doctrineSchoolBuilds=[];doctrineSchoolReadyAt=null;doctrineOverlap=0;doctrinePreviousProgress=null;
 doctrineBirths=new Set(units.map(u=>u.id));doctrineProduced={trooper:0,scout:0,sapper:0,walker:0};
}
function doctrineStep(policy='troops',startAt=120){
 const parallel=policy==='rapid-parallel';
 if(parallel&&t>=startAt&&!doctrineSchoolId){
  const base=alive(0).find(u=>u.type==='core');
  if(base&&ore>=buildingCost('forge'))for(const p of [{x:410,y:720},{x:350,y:680},{x:300,y:720}])if(validBuild(p,'forge')){
   const priorIds=new Set(units.map(u=>u.id)),before=ore;selected=[base];build('forge');command(p);
   const site=alive(0).find(u=>u.type==='forge'&&!priorIds.has(u.id));
   if(site){doctrineSchoolId=site.id;doctrineSchoolBuilds.push({at:Math.round(t),supplies:before-ore,unfinished:!!site.construction});}
   break;
  }
 }
 const secondary=alive(0).find(u=>u.id===doctrineSchoolId);
 if(secondary&&!secondary.construction&&doctrineSchoolReadyAt===null)doctrineSchoolReadyAt=Math.round(t);
 const primary=alive(0).find(u=>u.type==='forge'&&u.id!==doctrineSchoolId);
 if(secondary?.research&&primary?.queue.length){
  const progress={research:secondary.research.progress,recruit:primary.progress,id:secondary.research.id};
  if(doctrinePreviousProgress&&progress.id===doctrinePreviousProgress.id&&progress.research>doctrinePreviousProgress.research&&progress.recruit>doctrinePreviousProgress.recruit)doctrineOverlap++;
  doctrinePreviousProgress=progress;
 }else doctrinePreviousProgress=null;
 const tech=policy==='troops'?null:!technologies.has('drill')?'drill':(policy==='rapid'||parallel)&&!technologies.has('rapid')?'rapid':null;
 const reserve=!!tech&&t>=startAt;
 if(reserve){
  const school=parallel?(secondary&&!secondary.construction?secondary:null):alive(0).find(u=>u.type==='forge'&&!u.construction);
  if(school&&!school.research&&!school.queue.length){
   const suppliesBefore=ore,materialsBefore=materials;selected=[school];startResearch(tech);
   if(school.research?.id===tech)doctrinePurchases.push({id:tech,at:Math.round(t),supplies:suppliesBefore-ore,materials:materialsBefore-materials});
  }
 }
 // Reserving funds is a spending choice, never an inventory mutation.
 const savings=parallel&&reserve&&secondary&&!secondary.construction&&!secondary.research?researchDefs[tech].cost:0;
 defenseStep([],true,reserve&&!parallel,savings);
 if(technologies.has('rapid')){
  if(doctrineReadyAt===null)doctrineReadyAt=Math.round(t);
  const visibleThreats=alive(1).filter(u=>defs[u.type].damage&&sees(0,u));
  for(const u of alive(0))if(rapidReady(u)&&u.hp>u.max*.6&&u.morale>50&&u.order?.kind!=='retreat'&&visibleThreats.some(e=>dist(u,e)<weaponRange(u)+e.r+70)){
   if(activateRapid(u))doctrineActivations++;
  }
 }
 for(const u of alive(0))if(!doctrineBirths.has(u.id)){
  doctrineBirths.add(u.id);if(Object.hasOwn(doctrineProduced,u.type))doctrineProduced[u.type]++;
 }
}
function doctrineResult(){return {seconds:Math.round(t),ended,win:ended&&alive(0).some(u=>u.type==='core'),
 palace:Math.round(alive(0).find(u=>u.type==='core')?.hp||0),supplies:Math.round(ore),materials:Math.round(materials),
 technologies:[...technologies],purchases:doctrinePurchases,readyAt:doctrineReadyAt,activations:doctrineActivations,
 secondSchool:{builds:doctrineSchoolBuilds,readyAt:doctrineSchoolReadyAt,overlapSeconds:doctrineOverlap},
 produced:{...doctrineProduced},army:alive(0).filter(u=>defs[u.type].damage&&defs[u.type].speed).length,kills};}
// Diagnostic snapshots locate browser/harness divergence without hidden UI reads.
function doctrineSnapshot(){return {t,ore,materials,enemyBudget,enemyMaterials,units:units.map(u=>({id:u.id,type:u.type,team:u.team,x:u.x,y:u.y,hp:u.hp,morale:u.morale,carrying:u.carrying,harvest:u.harvest,order:u.order?.kind,target:u.order?.target?.id,progress:u.progress,research:u.research?.progress}))};}
