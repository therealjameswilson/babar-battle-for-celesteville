// Controlled paired scenario: identical forces and economies; change only raid orders.
// Deployment is a fixture, not an earned-resource opening or a general balance claim.
let raidQuarryId=0,raidQuarryLost=false,raidIds=[],raidBirths=new Set(),raidProduced={worker:0,trooper:0,scout:0,sapper:0,walker:0};
function raidSetup(composition="guards"){
 easy=false;uid=0;reset();running=true;nextWave=9999;
 if(composition==='sappers'){units=units.filter(u=>u.team!==0||u.type!=='trooper');for(let i=0;i<4;i++)add('sapper',0,1030+i*35,850);}
 const guards=alive(0).filter(u=>u.type==='trooper'||u.type==='sapper');
 guards.forEach((u,i)=>{u.x=1030+(i%3)*35;u.y=850+Math.floor(i/3)*35;issueOrder(u,{kind:'hold'});});
 raidQuarryId=alive(1).find(u=>u.type==='quarry').id;raidQuarryLost=false;
 raidIds=guards.map(u=>u.id);raidBirths=new Set(units.map(u=>u.id));
 raidProduced={worker:0,trooper:0,scout:0,sapper:0,walker:0};rebuildNav();sightAt=-1;
}
function raidStep(plan){
 const squad=alive(0).filter(u=>raidIds.includes(u.id));
 if(plan==='raid'&&t<45&&Math.floor(t)%3===0){
  const workers=alive(1).filter(u=>u.type==='worker'&&sees(0,u)&&dist(u,{x:1260,y:610})<230);
  selected=squad.filter(u=>u.order?.kind!=='retreat');
  const quarry=alive(1).find(u=>u.type==='quarry'&&sees(0,u));
  mode='attack';command(squad.some(u=>u.type==='sapper')&&quarry?quarry:workers[0]||{x:1260,y:610});
 }
 if(plan==='raid'&&t>=45&&t<46){selected=squad;tacticalOrders('retreat');}
}
function raidObserve(){
 if(!alive(1).some(u=>u.id===raidQuarryId))raidQuarryLost=true;
 for(const u of alive(1))if(!raidBirths.has(u.id)){
  raidBirths.add(u.id);if(Object.hasOwn(raidProduced,u.type))raidProduced[u.type]++;
 }
}
function raidResult(){return {seconds:Math.round(t),enemyMaterials:Math.round(enemyMaterials),
 extractedMaterials:1600-nodes.find(n=>n.kind==='materials'&&n.x===1260).amount,
 enemyProduced:{...raidProduced},raidersAlive:alive(0).filter(u=>raidIds.includes(u.id)).length,
 originalQuarryDestroyed:raidQuarryLost,quarryAlive:alive(1).some(u=>u.type==='quarry'&&!u.construction),enemyWorkers:alive(1).filter(u=>u.type==='worker').length,enemySpent:Math.round(enemySpent)};}
