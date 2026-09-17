// Ordinary paid Commander openings. The same staged army controller is used by
// all policies; an expansion competes for its Supplies, workers and escorts.
let expansionOpening=null;
const CAMP_POINT={x:1020,y:1070};
function expansionOpeningSetup(policy){
 pushSetup(14);
 expansionOpening={policy,startedAt:null,paidAt:null,finishedAt:null,lostAt:null,
   site:null,scoutId:null,escortIds:[],workerIds:[],paid:0,recruited:0};
}
function expansionOpeningStep(){
 const e=expansionOpening,own=alive(0),workers=own.filter(u=>u.type==='worker');
 if(e.policy!=='army'&&e.startedAt===null&&t>=60&&(e.policy==='early'||depot.team===0))e.startedAt=Math.round(t);
 const expanding=e.startedAt!==null;
 const candidate=own.find(u=>u.type==='scout'&&u.hp>u.max*.8);
 if(e.scoutId&&!own.some(u=>u.id===e.scoutId))e.scoutId=null;
 if(expanding&&!e.scoutId&&candidate)e.scoutId=candidate.id;
 if(expanding&&!e.escortIds.length)e.escortIds=own.filter(u=>u.type==='trooper'&&u.hp>u.max*.8).slice(0,2).map(u=>u.id);
 const detached=expanding?[e.scoutId,...e.escortIds].filter(Boolean):[];
 pushStep('staged',expanding&&!e.site?buildingCost('headquarters'):0,detached);
 if(!expanding)return;
 const scout=alive(0).find(u=>u.id===e.scoutId);
 if(scout&&scout.order?.kind!=='retreat'&&Math.floor(t)%3===0){
  const danger=alive(1).some(u=>sees(0,u)&&defs[u.type].damage&&dist(u,scout)<weaponRange(u)+80);
  if(danger)orderRetreat(scout);else issueOrder(scout,{kind:'move',x:980,y:1000});
 }
 for(const escort of alive(0).filter(u=>e.escortIds.includes(u.id))){
  if(escort.hp<escort.max*.4)orderRetreat(escort);
  else if(escort.order?.kind!=='retreat'&&Math.floor(t)%3===0)issueOrder(escort,{kind:'attack',x:1040,y:1000});
 }
 if(!e.site&&ore>=buildingCost('headquarters')&&validBuild(CAMP_POINT,'headquarters')){
  const builder=workers.filter(w=>!w.carrying&&w.order?.kind==='gather').sort((a,b)=>dist(a,CAMP_POINT)-dist(b,CAMP_POINT))[0];
  if(builder){selected=[builder];build('headquarters');command(CAMP_POINT);e.site=alive(0).find(u=>u.type==='headquarters');if(e.site){e.paidAt=Math.round(t);e.paid=e.site.paid;}}
 }
 if(!e.site)return;
 if(e.site.hp<=0){e.lostAt??=Math.round(t);return;}
 if(e.site.construction)return;
 e.finishedAt??=Math.round(t);
 const stocks=nodes.filter(n=>!n.kind&&observesResource(0,n)&&knownResourceAmount(n,0)>0&&dist(n,e.site)<350);
 if(!stocks.length)return;
 const safe=stocks.filter(n=>!alive(1).some(u=>sees(0,u)&&defs[u.type].damage&&dist(u,n)<240));
 if(!safe.length)return;
 for(const w of workers.filter(w=>w.order?.kind==='gather'&&!w.carrying).sort((a,b)=>dist(a,e.site)-dist(b,e.site))){
  if(e.workerIds.filter(id=>alive(0).some(u=>u.id===id)).length>=8)break;
  if(!e.workerIds.includes(w.id))e.workerIds.push(w.id);
 }
 for(const [i,w] of alive(0).filter(u=>e.workerIds.includes(u.id)).entries()){
  if(w.order?.kind==='retreat'||w.order?.kind==='build'||w.order?.kind==='repair'||w.carrying)continue;
  const stock=safe[i%safe.length];if(w.order?.node!==stock)issueOrder(w,{kind:'gather',node:stock});
 }
 const total=alive(0).filter(u=>u.type==='worker').length+alive(0).reduce((n,b)=>n+b.queue.filter(q=>q==='worker').length,0);
 if(total<15&&e.site.queue.length<2&&ore>=50){selected=[e.site];const before=ore;train('worker');if(ore<before){e.recruited++;e.paid+=50;e.site.rally={x:safe[0].x,y:safe[0].y,node:safe[0]};}}
}
function expansionOpeningObserve(dt){
 pushObserve(dt);
 const e=expansionOpening;
 if(e.site?.hp<=0)e.lostAt??=Math.round(t);

}
function expansionOpeningResult(){const e=expansionOpening;return {...pushResult(),policy:e.policy,startedAt:e.startedAt,paidAt:e.paidAt,finishedAt:e.finishedAt,lostAt:e.lostAt,investment:e.paid,campHealth:Math.round(Math.max(0,e.site?.hp||0)),campDeliveries:Math.round(e.site?.deliveredSupplies||0),workers:alive(0).filter(u=>u.type==='worker').length};}
