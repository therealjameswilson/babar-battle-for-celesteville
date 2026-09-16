function populationChecks(check) {
  for(const team of [0,1]) {
    easy=true;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;
    const base=alive(team).find(b=>b.type==='core'),school=alive(team).find(b=>b.type==='forge');
    const home=add('relay',team,team?1600:340,team?450:1040);
    while(livingPopulation(team)<20)add('trooper',team,team?1400:600,team?300:1000);
    base.queue=['worker'];base.progress=defs.worker.time-.01;
    school.queue=['trooper'];school.progress=defs.trooper.time-.01;
    alive(team).filter(b=>b.type==='relay').forEach(b=>b.hp=0);rebuildSupply();
    const progress=base.progress;update(.05);
    check(livingPopulation(team)===20&&base.queue.length===1&&school.queue.length===1,`Faction ${team}: housing raid blocks paid queues at all producers`);
    check(base.progress===progress,`Faction ${team}: blocked recruitment retains exact training progress`);
    check(productionReport(base).text.includes('POPULATION BLOCKED'),`Faction ${team}: report explains the population block`);
    school.research={id:'drill',progress:0};update(.05);
    check(school.research.progress>0,`Faction ${team}: population loss does not stop research`);school.research=null;
    const casualty=alive(team).find(u=>u.type==='trooper');casualty.hp=0;update(.05);
    check(livingPopulation(team)===20&&base.queue.length===0&&school.queue.length===1,`Faction ${team}: one freed slot permits exactly one recruit across competing producers`);
    const foundation=add('relay',team,home.x,home.y,{construction:5,buildDuration:12});rebuildSupply();update(.05);
    check(school.queue.length===1,`Faction ${team}: an unfinished home cannot unblock recruitment`);
    foundation.construction=0;rebuildSupply();update(.05);
    check(school.queue.length===0&&livingPopulation(team)===21,`Faction ${team}: completed replacement home resumes retained recruitment`);
    // Commander returns obey the same live capacity, without charging while blocked.
    alive(team).filter(u=>u.type==='hero').forEach(u=>u.hp=0);
    while(livingPopulation(team)<cap(team))add('trooper',team,team?1400:600,team?300:1000);
    heroRecovery=[{team,name:'Returning commander',at:t}];ore=enemyBudget=100;
    update(.05);
    check(heroRecovery.length===1&&(team?enemyBudget:ore)===100,`Faction ${team}: recovering commander waits for capacity without charging`);
    alive(team).find(u=>u.type==='trooper').hp=0;update(.05);
    check(heroRecovery.length===0&&alive(team).some(u=>u.name==='Returning commander')&&(team?enemyBudget:ore)===0,`Faction ${team}: commander returns and pays once when space opens`);
  }
  easy=true;reset();running=true;nextWave=enemySpawn=9999;
  const base=alive(0).find(b=>b.type==='core');while(livingPopulation()<cap())add('trooper',0,600,1000);
  base.queue=['worker'];base.progress=3;selected=[base];const before=ore;cancelRecruit(base,0);
  check(ore===before+50&&base.queue.length===0&&base.progress===0,'Cancelling a population-blocked recruit still refunds its full cost');
  reset();
}
