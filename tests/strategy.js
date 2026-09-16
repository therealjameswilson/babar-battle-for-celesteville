// Reproducible balance opponent: only normal player actions and earned supplies.
// Shared by Node and the real-browser accelerated Story playthrough.
function strategyStep(plan = 'siege') {
  if (ended) return;
  const base = alive(0).find((u) => u.type === 'core');
  if (!base) return;
  let quarry = alive(0).find(u=>u.type==='quarry');
  const metal = nodes.find(n=>n.kind==='materials'&&n.x===275);
  if (!quarry && ore >= 100) { selected=[base]; build('quarry'); command(metal); quarry=alive(0).find(u=>u.type==='quarry'); }
  const workers = alive(0).filter(u=>u.type==='worker');
  if (workers.length + base.queue.length < 7 && ore >= 50) { selected=[base]; train('worker'); }
  if (quarry && !quarry.construction) {
    let assigned = workers.filter(w=>w.order?.node===metal).length;
    for (const worker of workers.filter(w=>w.order?.kind!=='build'&&w.order?.node!==metal)) {
      if (assigned >= 2) break;
      issueOrder(worker,{kind:'gather',node:metal}); assigned++;
    }
  }
  const factory = alive(0).find((u) => u.type === 'factory');
  if (!factory && materials >= materialCost('factory') && ore >= buildingCost('factory')) {
    selected = [base];
    build('factory');
    command({ x: 480, y: 1080 });
  }
  if (cap() < 60 && supply() > cap() - 6 && ore >= buildingCost('relay')) {
    for (const p of [
      { x: 570, y: 1070 },
      { x: 620, y: 970 },
      { x: 625, y: 1130 },
      { x: 675, y: 1060 },
      { x: 680, y: 920 },
      { x: 540, y: 1170 },
    ])
      if (validBuild(p, 'relay')) {
        selected = [base];
        build('relay');
        command(p);
        break;
      }
  }
  if (!benefits.has('celeste') && ore > 350) usePower('celeste');
  if (!benefits.has('troubadour') && ore > 400) usePower('troubadour');
  if (!benefits.has('pompadour') && ore > 400) usePower('pompadour');
  if (!benefits.has('old-tusk') && ore > 400) usePower('old-tusk');
  if (t % 45 < 2) usePower('babar');
  // A mixed opening must actually field its counter units before saving for guns.
  // Include queued units so a stalled producer cannot reserve the whole economy.
  const mixedSchool = alive(0).find(b=>b.type==='forge'&&!b.construction);
  const earlySappers = alive(0).filter(u=>u.type==='sapper').length +
    alive(0).reduce((n,b)=>n+b.queue.filter(q=>q==='sapper').length,0);
  if (plan==='mixed' && unitUnlocked('sapper') && earlySappers<3 && mixedSchool?.queue.length<2 && ore>=90 && materials>=20) {
    selected=[mixedSchool];train('sapper');
  }
  const guns = alive(0).filter((u) => u.type === 'walker').length;
  if (factory && !factory.construction && factory.queue.length < 2 && guns < 12) {
    selected = [factory];
    train('walker');
  }
  const school = alive(0).find((u) => u.type === 'forge');
  if (
    school &&
    !school.construction &&
    school.queue.length < 2 &&
    alive(0).filter((u) => u.type === 'trooper').length < 28 &&
    (guns >= 3 || !factory || factory.construction || materials < 25) &&
    ore > (!factory && materials >= 50 ? 300 : 60)
  ) {
    selected = [school];
    const sapperCount=alive(0).filter(u=>u.type==='sapper').length;
    train(plan==='mixed' && unitUnlocked('sapper') && materials>=20 && ore>=90 && sapperCount<6 && guns>=2 ? 'sapper' : 'trooper');
  }
  const army = alive(0).filter(
    (u) => defs[u.type].damage && defs[u.type].speed && u.order?.kind !== 'retreat'
  );
  if (army.length >= 18 || t > 350) {
    selected = army;
    mode = 'attack';
    command(depot.team === 0 ? { x: 1400, y: 360 } : { x: 950, y: 830 });
  }
}
