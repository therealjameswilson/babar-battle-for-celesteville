/* Original council effects, shared by Node and actual browser QA. */
function supportChecks(check) {
  function fresh() {
    easy=true;reset();running=true;ore=1000;nextWave=enemySpawn=9999;
  }
  fresh();usePower('pom');selected=[alive(0)[0]];
  build('relay');command({x:600,y:1030});
  check(alive(0).find(u=>u.x===600).buildDuration===6.3,'Pom cuts construction time by 30%');
  fresh();usePower('troubadour');selected=[alive(0).find(u=>u.type==='forge')];train('trooper');update(1);
  check(selected[0].progress===1.25,'Troubadour adds 25% production speed (20% less time)');
  fresh();units=units.filter(u=>u.type!=='worker');
  add('worker',0,388,900,{carrying:10,order:{kind:'gather',node:nodes[0]}});
  usePower('pompadour');const oldOre=ore;update(.05);
  check(ore-oldOre===12.5,'Pompadour increases physical delivery by 25%');
  fresh();const runner=add('scout',0,550,650),beforeX=runner.x;
  move(runner,{x:700,y:650},.1);const plainDistance=runner.x-beforeX;
  runner.x=beforeX;usePower('arthur');move(runner,{x:700,y:650},.1);
  check(Math.abs((runner.x-beforeX)/plainDistance-1.15)<.001,'Arthur adds 15% movement speed');
  fresh();units=units.filter(u=>!defs[u.type].speed);
  const patient=add('trooper',0,390,970,{hp:50});usePower('celeste');t=10;updateTactics(1);
  check(patient.hp===56,'Celeste increases recovery to 6 health per second');
  fresh();const beforeWave=nextWave;usePower('alexander');
  check(nextWave===beforeWave+25,'Alexander delays the next assault by 25 seconds');
  fresh();const fortress=alive(1).find(u=>u.type==='core'),oldMax=fortress.max,oldHealth=fortress.hp;
  nextWave=0;enemyThink();
  check(fortress.max===oldMax+250&&fortress.hp===oldHealth+250,'Louise fortifies the fortress by 250 after wave one');
  nextWave=0;enemyThink();
  check(fortress.max===oldMax+250,'Louise fortification is not repeated on later waves');
  fresh();t=50;nextWave=50;wave=2;enemyThink();
  check(nextWave===170,'Victor buys 20 extra seconds after wave three');
  fresh();wave=2;const basilSchool=alive(1).find(b=>b.type==='forge');basilSchool.queue=['trooper'];rebuildSupply();
  for(let i=0;i<20;i++)update(.05);
  check(Math.abs(basilSchool.progress-1.25)<.0001,'Basil reduces actual training time by 20% after wave two');
  fresh();const rhino=add('scout',1,1000,650),startX=rhino.x;
  wave=0;move(rhino,{x:1150,y:650},.1);const ordinary=rhino.x-startX;
  rhino.x=startX;wave=4;move(rhino,{x:1150,y:650},.1);
  check(Math.abs((rhino.x-startX)/ordinary-1.1)<.001,'Rhudi adds 10% movement speed after wave four');
}
