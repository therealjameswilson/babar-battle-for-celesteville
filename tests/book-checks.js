/* Shared deterministic checks, also executed inside the real browser QA fixture. */
function bookChecks(check) {
  function freshBooks() {
    easy = true; reset(); running = true; ore = 1000;
    nextWave = enemySpawn = 9999;
  }
  freshBooks();
  check(COURT.length === 33 && new Set(COURT.map(c => c.id)).size === 33, '33 unique characters');
  const original = ['babar','celeste','pom','flora','alexander','isabelle','arthur','cornelius','pompadour','troubadour','zephir','madame','truffles','periwinkle','badou','babar-mother','celeste-mother','old-tusk','rataxes','lady','basil','victor','rhudi'];
  check(original.every(id => COURT.some(c => c.id === id)), 'All original 23 characters preserved');
  check(COURT.find(c => c.id === 'isabelle').book !== COURT.find(c => c.id === 'princess-isabelle').book, 'Two Isabelles have distinct identities');
  const palace = alive(0).find(u => u.type === 'core');
  palace.hp = 600;
  const site = add('relay', 0, 620, 1060, { hp: 1, construction: 9 });
  const enemy = alive(1).find(u => u.type === 'core');
  enemy.hp = 600;
  check(usePower('grifaton') && palace.hp === 720 && site.hp === 1 && enemy.hp === 600, 'Grifaton repairs only completed friendly buildings');
  check(!usePower('grifaton') && ore === 900, 'Grifaton cooldown prevents duplicate charges');
  t += 80; check(usePower('grifaton') && palace.hp === 840, 'Grifaton cooldown expires');
  const beforeNodes = nodes.length;
  usePower('colin');
  check(nodes.length === beforeNodes + 1 && nodes.at(-1).amount === 800, 'Colin marks a finite physical cache');
  check(!usePower('colin'), 'Colin cache cannot duplicate');
  revealUntil = 0; usePower('nadine');
  check(revealUntil === t + 18, 'Nadine reveals for 18 seconds');
  usedPowers.nadine = -1000; revealUntil = t + 25; usePower('nadine');
  check(revealUntil === t + 25, 'Nadine never shortens an existing reveal');
  const worker = alive(0).find(u => u.type === 'worker');
  worker.morale = 20; worker.hp = 1;
  usePower('princess-isabelle');
  check(worker.morale === 50 && worker.hp === 1, 'Monkey princess restores 30 morale without healing');
  usePower('eleonore');
  check(worker.hp === 81 && palace.hp === 840, 'Eleonore restores 80 provisioner health only');
  const home = add('relay', 0, 460, 1050, { hp: 100 });
  usePower('crustadele');
  check(home.hp === 300 && site.hp === 1 && palace.hp === 840, 'Crustadele restores 200 completed-home health only');
  const scout = add('scout', 0, 460, 1020, { hp: 1, morale: 10 });
  usePower('duck');
  check(scout.hp === 61 && scout.morale === 30 && worker.hp === 81, 'Duck recovers scout health and morale only');
  const beforeGift = ore;
  check(usePower('father-christmas') && ore === beforeGift + 200 && !usePower('father-christmas'), 'Father Christmas gives 200 supplies once');
  const beforeArchive = ore, beforeUnits = units.length;
  check(!usePower('old-king') && !usePower('polomoche') && ore === beforeArchive && units.length === beforeUnits, 'Archives never charge or spawn characters');
  freshBooks();
  usePower('colin');
  const cache = nodes.at(-1), afterCacheCost = ore;
  for (const provisioner of alive(0).filter(u => u.type === 'worker'))
    issueOrder(provisioner, { kind: 'gather', node: cache });
  for (let step = 0; step < 600; step++) update(.05);
  check(cache.amount < 800 && ore > afterCacheCost, 'Provisioners reach Colin’s cache and deliver its supplies');
  freshBooks();
  ore = 39;
  check(!usePower('duck') && ore === 39, 'Book powers enforce supply costs');
  check(!benefits.has('father-christmas') && !usedPowers.grifaton, 'Restart clears book powers and cooldowns');
}
