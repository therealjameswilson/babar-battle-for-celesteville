function uraniumChecks(check){
 for(const team of [0,1]){
  reset();running=true;paused=false;units=units.filter(u=>u.type==='core');nextWave=enemySpawn=1e9;
  const base=alive(team)[0],n={x:base.x+110,y:base.y+100,r:24,amount:6,kind:'uranium'};nodes=[n];
  const w=add('worker',team,n.x,n.y,{order:{kind:'gather',node:n}});
  check(!canHarvest(w,n),'Works gate for both factions');
  const b=add('factory',team,base.x-110,base.y+70);rebuildSupply();
  check(canHarvest(w,n),'completed Works unlock extraction');
  for(let i=0;i<16;i++)update(.2);
  check(w.carrying===4&&n.amount===2,'slow four-unit finite extraction');
  check((team?enemyUranium:uranium)===0,'cargo not credited before delivery');
  for(let i=0;i<220;i++)update(.2);
  check((team?enemyUranium:uranium)===6&&n.amount===0,'physical delivery and depletion');
  factionResearch(team).add('atomic');ore=enemyBudget=5000;materials=enemyMaterials=2000;linked.add(b.id);
  const before=team?enemyBudget:ore;
  check(!assembleAtomic(b)&&(team?enemyBudget:ore)===before,'insufficient Uranium spends nothing');
  if(team)enemyUranium=40;else uranium=40;
  check(assembleAtomic(b)&&(team?enemyUranium:uranium)===0,'atomic consumes forty Uranium');
  b.atomicJob=null;factionResearch(team).add('hydrogen');
  if(team)enemyUranium=79;else uranium=79;
  check(!assembleAtomic(b,'hydrogen'),'H-bomb needs eighty');
  if(team)enemyUranium=80;else uranium=80;
  check(assembleAtomic(b,'hydrogen')&&(team?enemyUranium:uranium)===0,'H-bomb consumes eighty');
 }
 reset();check(uranium===0&&enemyUranium===0&&nodes.filter(n=>n.kind==='uranium').length===3,'reset and three deposits');
 check(nodes.filter(n=>n.kind==='uranium').every(n=>!solidAt(n.x,n.y,15)),'deposits accessible');
 t=430;enemyAssignWorkers();check(alive(1).filter(w=>w.order?.node?.kind==='uranium').length>=1,'AI assigns visible Uranium haulers');
}
