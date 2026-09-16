// Paid full-match policies. No resource, research, unit or visibility grants.
let doctrinePurchases=[],doctrineReadyAt=null,doctrineActivations=0,doctrineBirths=new Set(),doctrineProduced={};
function doctrineSetup(story=false){
 uid=0;easy=story;reset();running=true;paused=false;
 doctrinePurchases=[];doctrineReadyAt=null;doctrineActivations=0;
 doctrineBirths=new Set(units.map(u=>u.id));doctrineProduced={trooper:0,scout:0,sapper:0,walker:0};
}
function doctrineStep(policy='troops',startAt=120){
 const tech=policy==='troops'?null:!technologies.has('drill')?'drill':policy==='rapid'&&!technologies.has('rapid')?'rapid':null;
 const reserve=!!tech&&t>=startAt;
 if(reserve){
  const school=alive(0).find(u=>u.type==='forge'&&!u.construction);
  if(school&&!school.research&&!school.queue.length){
   const suppliesBefore=ore,materialsBefore=materials;selected=[school];startResearch(tech);
   if(school.research?.id===tech)doctrinePurchases.push({id:tech,at:Math.round(t),supplies:suppliesBefore-ore,materials:materialsBefore-materials});
  }
 }
 defenseStep([],true,reserve);
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
 produced:{...doctrineProduced},army:alive(0).filter(u=>defs[u.type].damage&&defs[u.type].speed).length,kills};}
