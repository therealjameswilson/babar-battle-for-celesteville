// Shared rendered-browser/VM tests: remembered quantities never alias world state.
function resourceMemoryChecks(check) {
  for(const team of [0,1]) {
    easy=true;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;
    const worker=alive(team).find(u=>u.type==='worker');
    units=units.filter(u=>u.type==='core'||u===worker);
    worker.x=800;worker.y=1000;worker.carrying=0;
    const empty={x:800,y:1000,r:20,amount:0};
    const remembered={x:1100,y:1000,r:20,amount:100};
    const unknown={x:1500,y:1100,r:20,amount:900};
    nodes=[empty,remembered,unknown];resourceMemory=[new Map(),new Map()];
    observeResources();
    check(nextKnownResource(worker)===null,`Faction ${team}: empty cache does not reveal distant stocks`);
    const scout=add('scout',team,1100,1000);observeResources();scout.hp=0;
    check(knownResourceAmount(remembered,team)===100,`Faction ${team}: scouting preserves last-known inventory`);
    remembered.amount=0;
    if(team===0)check(resourceLabel(remembered)==='~100','Resource label distinguishes last-seen stock from live inventory');
    check(knownResourceAmount(remembered,team)===100,`Faction ${team}: hidden depletion leaves memory unchanged`);
    issueOrder(worker,{kind:'gather',node:empty});update(.05);
    check(worker.order?.node===remembered,`Faction ${team}: fallback uses remembered stock despite hidden depletion`);
    worker.x=1000;worker.y=1000;update(.05);
    check(knownResourceAmount(remembered,team)===0 && !worker.order,`Faction ${team}: revisiting empty stock stops automatic gathering without revealing unknown caches`);
    check(knownResourceAmount(unknown,team)===undefined,`Faction ${team}: unseen stock remains unknown`);
    remembered.amount=100;observeResources();
    remembered.kind='materials';
    check(nextKnownResource(worker,'materials')===null,`Faction ${team}: automatic reassignment avoids deposits lacking a supplied quarry`);
    worker.carrying=7;worker.cargoKind='supplies';worker.x=alive(team).find(u=>u.type==='core').x+65;worker.y=alive(team).find(u=>u.type==='core').y;
    issueOrder(worker,{kind:'gather',node:empty});const before=team?enemyBudget:ore;update(.05);
    check((team?enemyBudget:ore)===before+7,`Faction ${team}: final cargo is delivered before searching for more work`);
  }
  for(const team of [0,1]) {
    reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;
    units=units.filter(u=>u.type==='core');
    const base=alive(team)[0],hidden={x:900,y:1100,r:20,amount:100};
    nodes=[hidden];resourceMemory=[new Map(),new Map()];
    base.queue=['worker'];base.progress=defs.worker.time;update(.05);
    check(!alive(team).find(u=>u.type==='worker').order?.node,`Faction ${team}: new worker does not acquire an unscouted stock`);
    resourceMemory[team].set(hidden,100);hidden.amount=0;
    base.rally={x:hidden.x,y:hidden.y,node:hidden};base.queue=['worker'];base.progress=defs.worker.time;update(.05);
    check(alive(team).filter(u=>u.type==='worker').at(-1).order?.node===hidden,`Faction ${team}: resource rally preserves remembered assignment until scouting confirms depletion`);
  }
  reset();
  check(!resourceMemory[0].has(nodes.find(n=>n.x===1560)), 'Restart clears distant resource knowledge');
}
