/* Local-only browser QA. Not included in dist or deployed. */
let qaInterval = null;
function qaReport(s) {
  parent.document.getElementById('report').textContent = s;
}
function qaReset() {
  clearInterval(qaInterval);
  easy = true;
  reset();
  running = true;
  paused = false;
  $('overlay').classList.add('hidden');
}
function qaTicks(seconds) {
  for (let n = 0; n < seconds * 20 && !ended; n++) update(0.05);
  draw();
}
async function browserSuite() {
  try {
    const results = [];
    const check = (ok, label) => {
      if (!ok) throw Error(label);
      results.push('PASS ' + label);
    };
    siegeChecks(check);
    qaReset(); nextWave = enemySpawn = 9999;
    const uiGun = add('walker', 0, 650, 755); selected = [uiGun]; updateUI(true);
    document.querySelector('#actions button').click();
    check(uiGun.artilleryTransition?.deploy === true && document.querySelector('#actions button').disabled, 'Deploy button starts setup and disables during transition');
    qaTicks(3.1);
    check(uiGun.deployed && document.querySelector('#actions button').textContent.includes('Pack artillery'), 'Deployed gun exposes the Pack button');
    document.querySelector('#actions button').click(); qaTicks(2.1);
    check(!uiGun.deployed && !uiGun.artilleryTransition, 'Pack button returns gun to mobile mode');
    window.dispatchEvent(new KeyboardEvent('keydown', {key:'d', code:'KeyD'}));
    check(uiGun.artilleryTransition?.deploy === true, 'D shortcut deploys selected guns');
    bookChecks(check);
    qaReset();
    check(
      spriteSheet.complete && spriteSheet.naturalWidth === 1254 && buildingSheet.complete,
      'Local character/building assets loaded'
    );
    check(ctx instanceof CanvasRenderingContext2D, 'Real Canvas context');
    qaTicks(12);
    check(ore > 300, 'Physical gathering and delivery');
    $('pause').click();
    check(paused, 'Pause button');
    $('pause').click();
    check(!paused, 'Resume button');
    $('court-open').click();
    check(paused && $('court-dialog').open, 'Council pauses and opens modal');
    $('tab-books').click();
    check(document.querySelectorAll('#court-roster .court-card').length === 22, 'Book filter contains 22 sourced book characters');
    $('court-search').value = 'Isabelle'; $('court-search').dispatchEvent(new Event('input'));
    check(document.querySelectorAll('#court-roster h4').length === 2, 'Search distinguishes both Isabelles');
    $('court-search').value = 'Professor'; $('court-search').dispatchEvent(new Event('input'));
    check(document.querySelectorAll('#court-roster h4').length === 3, 'Search finds book title and relatives');
    $('court-search').value = 'unmatched-example'; $('court-search').dispatchEvent(new Event('input'));
    check($('court-roster').textContent.includes('No matching characters'), 'Empty search gives useful feedback');
    $('court-search').value = 'Polomoche'; $('court-search').dispatchEvent(new Event('input'));
    check(document.querySelector('#court-roster button').disabled, 'Story archive has no purchasable power');
    $('court-search').value = ''; $('tab-elephants').click();
    check(document.querySelectorAll('#court-roster .court-card').length === 28, 'Faction tab retains original and new civilian characters');
    $('court-close').click();
    await new Promise(requestAnimationFrame);
    check(!paused && !$('court-dialog').open, 'Council closes and resumes');
    ore = 10000;
    for (const c of COURT.filter((c) => c.team === 0 && !c.storyOnly)) {
      check(usePower(c.id), c.name + ' power activates');
      if (!c.cooldown) check(!usePower(c.id), c.name + ' cannot charge twice');
    }
    check(cap() === 45, 'Madame and Celeste’s mother population');
    check(buildingCost('forge') === 128, 'Cornelius discount');
    check(nodes.length === 12, 'Badou and Colin discover separate supplies');
    check(vision(alive(0)[0]) === 375, 'Flora vision');
    const worker = add('worker', 0, 260, 720);
    check(worker.max === 135, 'Isabelle and Babar’s mother affect new recruits');
    const cannon = add('walker', 0, 450, 730);
    check(cannon.max === 320, 'Old Tusk affects new artillery');
    const hero = alive(0).find((u) => u.type === 'hero');
    hero.hp = 100;
    hero.morale = 20;
    usedPowers.babar = -100;
    usePower('babar');
    check(hero.hp === 180 && hero.morale === 55, 'Babar health and morale rally');
    usedPowers.truffles = -100;
    usePower('truffles');
    check(hero.hp === 280, 'Truffles army recovery');
    check(revealUntil > t, 'Zephir map reveal');
    heroRecovery = [{ team: 0, name: 'Babar', at: t + 45 }];
    benefits.delete('periwinkle');
    usePower('periwinkle');
    check(heroRecovery[0].at === t + 25, 'Periwinkle recovery time');
    qaReset();
    nextWave = 9999;
    enemySpawn = 9999;
    selected = [alive(0).find((u) => u.type === 'forge')];
    train('scout');
    qaTicks(7);
    check(
      alive(0).some((u) => u.type === 'scout'),
      'Scout recruitment'
    );
    ore = 1000;
    selected = [alive(0)[0]];
    build('relay');
    command({ x: 600, y: 1030 });
    qaTicks(25);
    check(cap() === 40, 'Construction finishes and increases population');
    const scout = alive(0).find((u) => u.type === 'scout');
    scout.x = 690;
    scout.y = 600;
    scout.order = { kind: 'move', x: 1050, y: 600 };
    qaTicks(15);
    check(scout.x > 1000 && !solidAt(scout.x, scout.y, scout.r), 'Pathfinding around forest');
    selected = [scout];
    $('stop').click();
    check(scout.order.kind === 'hold', 'Hold button');
    $('retreat').click();
    check(scout.order.kind === 'retreat', 'Retreat button');
    const outpost = add('forge', 0, 675, 900);
    rebuildSupply();
    check(supplied(outpost), 'Connected outpost');
    const raider = add('trooper', 1, 675, 900);
    rebuildSupply();
    check(!supplied(outpost), 'Raider cuts supply');
    raider.hp = 0;
    rebuildSupply();
    check(supplied(outpost), 'Supply restored after clearing raider');
    const b = alive(0).find((u) => u.type === 'core'),
      w = alive(0).find((u) => u.type === 'worker');
    b.hp = 1200;
    w.x = 400;
    w.y = 920;
    selected = [w];
    setMode('repair');
    command(b);
    qaTicks(5);
    check(b.hp > 1200, 'Damaged building repaired');
    qaReset();
    units = units.filter((u) => !defs[u.type].speed);
    add('trooper', 0, 950, 830);
    nextWave = 9999;
    enemySpawn = 9999;
    qaTicks(9);
    check(depot.team === 0, 'Depot capture');
    const reserves = enemyBudget;
    qaTicks(3);
    check(enemyBudget === reserves, 'Captured depot stops reserve income');
    const old = cam.zoom;
    $('zoom-in').click();
    check(cam.zoom > old, 'Zoom controls');
    $('pan').click();
    check(panMode, 'Pan mode');
    $('pan').click();
    const soundBefore = muted;
    $('mute').click();
    check(muted !== soundBefore, 'Mute toggle');
    check(localStorage.getItem('babar-muted') === String(muted), 'Mute preference persisted');
    $('mute').click();
    qaReset();
    nextWave = 9999;
    enemySpawn = 9999;
    const touch = (type, p) => {
      const rect = canvas.getBoundingClientRect(),
        q = screen(p);
      canvas.dispatchEvent(
        new PointerEvent(type, {
          pointerId: 7,
          pointerType: 'touch',
          button: 0,
          buttons: type === 'pointerdown' ? 1 : 0,
          clientX: rect.left + q.x,
          clientY: rect.top + q.y,
          bubbles: true,
        })
      );
    };
    const leader = alive(0).find((u) => u.type === 'hero');
    touch('pointerdown', leader);
    touch('pointerup', leader);
    check(selected[0] === leader, 'Touch pointer selects a unit');
    setMode('move');
    touch('pointerdown', { x: 560, y: 740 });
    touch('pointerup', { x: 560, y: 740 });
    check(leader.order.kind === 'move', 'Touch pointer issues explicit move');
    check(
      getComputedStyle(canvas).touchAction === 'none',
      'Battlefield prevents browser touch scrolling'
    );
    const startCamera = cam.x;
    $('pan').click();
    touch('pointerdown', { x: 400, y: 800 });
    touch('pointermove', { x: 440, y: 800 });
    touch('pointerup', { x: 440, y: 800 });
    check(cam.x !== startCamera, 'Touch drag pans map');
    $('pan').click();
    const marked = add('trooper', 1, leader.x + 130, leader.y);
    sightAt = -1;
    selected = [leader];
    setMode('attack');
    touch('pointerdown', marked);
    touch('pointerup', marked);
    check(leader.order.target === marked, 'Touch focus-fire acquires a visible enemy');
    qaReport(results.join('\n'));
    qaReset();
    paused = true;
    draw();
    parent.document.getElementById('status').textContent = results.length + ' checks passed';
  } catch (e) {
    qaReport('FAIL ' + e.stack);
    parent.document.getElementById('status').textContent = 'FAILED';
    throw e;
  }
}
function browserVictory() {
  qaReset();
  startAudio();
  qaReport(
    'Accelerated Story playthrough: original starting resources, normal orders and earned supplies.'
  );
  qaInterval = setInterval(() => {
    if (!ended) {
      strategyStep();
      qaTicks(1);
      cam.x = depot.team === 0 ? 1240 : 760;
      cam.y = depot.team === 0 ? 460 : 820;
    } else {
      clearInterval(qaInterval);
      qaReport(
        'Story result: ' +
          (alive(0).some((u) => u.type === 'core') ? 'VICTORY' : 'LOSS') +
          ' · ' +
          time(t) +
          ' · casualties ' +
          kills +
          ' · supplies ' +
          Math.floor(ore)
      );
    }
  }, 50);
}
function browserLoss() {
  qaReset();
  qaReport('Accelerated loss playthrough: no defense orders.');
  qaInterval = setInterval(() => {
    if (!ended) qaTicks(1);
    else {
      clearInterval(qaInterval);
      qaReport(
        'Unattended Story result: ' +
          (alive(0).some((u) => u.type === 'core') ? 'VICTORY' : 'LOSS') +
          ' · ' +
          time(t)
      );
    }
  }, 50);
}
function browserBattle() {
  qaReset();
  ore = 1600;
  revealUntil = 9999;
  units = units.filter((u) => !defs[u.type].speed);
  for (let i = 0; i < 30; i++) {
    add(i % 5 === 0 ? 'walker' : 'trooper', 0, 610 + (i % 6) * 40, 730 + Math.floor(i / 6) * 40, {
      order: { kind: 'attack', x: 1180, y: 850 },
    });
    add(i % 6 === 0 ? 'walker' : 'trooper', 1, 1170 + (i % 6) * 40, 700 + Math.floor(i / 6) * 40, {
      order: { kind: 'attack', x: 600, y: 850 },
    });
  }
  cam = { x: 990, y: 810, zoom: 0.9 };
  nextWave = 9999;
  enemySpawn = 9999;
  selected = alive(0).filter((u) => defs[u.type].speed);
  updateUI(true);
  qaReport('Representative battle: 60 combatants, infantry and field artillery.');
}
async function browserPerformance() {
  const samples = [],
    updates = [];
  const initial = performance.now();
  for (let n = 0; n < 120; n++) {
    await new Promise(requestAnimationFrame);
    let a = performance.now();
    draw();
    samples.push(performance.now() - a);
    a = performance.now();
    if (!ended) update(1 / 60);
    updates.push(performance.now() - a);
  }
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length,
    p95 = (a) => a.sort((x, y) => x - y)[Math.floor(a.length * 0.95)];
  qaReport(
    JSON.stringify(
      {
        frames: 120,
        elapsedMs: Math.round(performance.now() - initial),
        drawMeanMs: avg(samples),
        drawP95Ms: p95(samples),
        updateMeanMs: avg(updates),
        updateP95Ms: p95(updates),
        units: units.length,
        navigation: navStats,
      },
      null,
      2
    )
  );
}

function browserReview() {
  browserBattle();
  add('turret', 0, 650, 700, { hp: 180 });
  parent.document.querySelector('nav').style.display = 'none';
  parent.document.getElementById('report').style.display = 'none';
  parent.document.getElementById('play').style.height = '100vh';
}

async function browserExpansion() {
  const checks = [];
  const check = (ok, label) => { if (!ok) throw Error(label); checks.push('PASS ' + label); };
  try {
    qaReset(); nextWave = 9999; enemySpawn = 9999;
    const school = alive(0).find(u => u.type === 'forge');
    selected = [school]; ore = 1000;
    startResearch('drill');
    train('trooper');
    check(school.queue.length === 0, 'Research prevents parallel recruitment');
    qaTicks(26);
    check(technologies.has('drill'), 'Infantry research completes in the browser');
    const gunLab = add('factory', 0, 500, 1080);
    selected = [gunLab]; startResearch('shells'); qaTicks(36);
    check(technologies.has('shells'), 'Artillery research completes in the browser');
    const gun = add('walker', 0, 600, 1100), target = add('trooper', 1, 650, 1100);
    const oldHP = target.hp; shoot(gun, target);
    check(Math.abs(oldHP - target.hp - 60) < .001, 'Calibrated shell deals 60 damage');
    qaReset(); nextWave = 9999; enemySpawn = 9999;
    const leader = alive(1).find(u => u.type === 'hero');
    leader.x = 1050; leader.y = 1100;
    const escort = add('trooper', 1, 1080, 1100);
    add('trooper', 0, 1180, 1100); sightAt = -1;
    enemyThink();
    check(leader.commandEnergy === 10 && escort.advanceUntil > t, 'Rataxes AI casts when a visible enemy and escort are near');
    const startX = escort.x; move(escort, {x:1150,y:1100}, .1, 0);
    check(Math.abs(escort.x - startX - defs.trooper.speed * 1.3 * .1) < .01, 'Forced advance increases actual movement 30%');
    qaReset(); nextWave = 9999; enemySpawn = 9999; ore = 1000;
    selected = [alive(0).find(u => u.type === 'core')]; build('relay'); command({x:600,y:1030});
    const site = units.at(-1), builder = alive(0).find(u => u.order?.target === site);
    builder.hp = 0; const work = site.construction; qaTicks(2);
    check(site.construction === work, 'Builder loss halts site in the browser');
    const replacement = alive(0).find(u => u.type === 'worker'); replacement.x = 560; replacement.y = 1030;
    selected = [replacement]; repairOrder(site); qaTicks(1);
    check(site.construction < work, 'Replacement builder resumes site');
    selected = [site]; updateUI(true);
    const cancel = [...$('actions').querySelectorAll('button')].find(b => b.textContent.includes('Cancel construction'));
    check(!!cancel, 'Construction cancellation is exposed in the actual DOM');
    cancel.click(); check(site.hp === 0, 'Construction cancellation button removes site');
    qaReset(); paused = true; draw();
    qaReport(checks.join('\n')); parent.document.getElementById('status').textContent = checks.length + ' expansion checks passed';
  } catch (error) { qaReport(checks.join('\n') + '\nFAIL ' + error.message); throw error; }
}

function browserSiege() {
  qaReset(); nextWave = enemySpawn = 9999; enemyScoutSent = true;
  units = units.filter(u => !defs[u.type].speed);
  const gun = add('walker', 0, 650, 755);
  add('scout', 0, 760, 770, { order: { kind: 'hold' } });
  for (let i = 0; i < 3; i++) add('trooper', 0, 705 + i * 30, 860, { order: { kind: 'hold' } });
  for (let i = 0; i < 5; i++) add('trooper', 1, 980 + (i % 3) * 25, 750 + Math.floor(i / 3) * 30, { order: { kind: 'hold' } });
  selected = [gun]; cam = { x: 800, y: 760, zoom: .85 };
  updateUI(true); draw();
  qaReport('Siege fixture: select Deploy artillery (D). Scout spots the rhino formation. Use Move to pack.');
}
