const assert = require('node:assert/strict');
const { run, tick } = require('./smoke.cjs');
function fresh() {
  run('easy=true;reset();running=true;nextWave=9999;enemySpawn=9999;');
}
fresh();
run("const navUnit=add('scout',0,690,600);navUnit.order={kind:'move',x:1050,y:600}");
tick(300);
assert(run('navUnit.x>1000'), 'Scout routes around impassable forest.');
assert(run('!solidAt(navUnit.x,navUnit.y,navUnit.r)'), 'Path ends outside obstacles.');
fresh();
run("const navUnit2=add('trooper',0,200,900);navUnit2.order={kind:'move',x:440,y:850}");
tick(200);
assert(run('navUnit2.x>400 && !navUnit2.order && dist(navUnit2,{x:440,y:850})<12'), 'Unit routes around the palace footprint and completes a clear destination.');
fresh();
run("const outpost=add('forge',0,675,900);rebuildSupply();");
assert(run('supplied(outpost)'));
run("const raider=add('trooper',1,570,900);rebuildSupply()");
assert(!run('supplied(outpost)'), 'Raiders interrupt the supply segment.');
run('outpost.queue=["trooper"];const progressBefore=outpost.progress;update(.4)');
assert.equal(run('outpost.progress-progressBefore'), 0.1, 'Isolated training operates at 25%.');
run('raider.hp=0;rebuildSupply()');
assert(run('supplied(outpost)'), 'Clearing a route restores supply.');
fresh();
run(
  "const gun=add('walker',0,1050,600),exposed=add('trooper',1,1100,600),protectedUnit=add('trooper',1,1090,875);add('scout',0,1050,780);const oldExposed=exposed.hp,oldProtected=protectedUnit.hp;shoot(gun,exposed);shoot(gun,protectedUnit)"
);
assert(
  run('Math.abs((oldProtected-protectedUnit.hp)/(oldExposed-exposed.hp)-.65)<.0001'),
  'Cover reduces damage for enemy too.'
);
run('exposed.morale=20;updateTactics(.05)');
assert.equal(run('exposed.order.kind'), 'retreat', 'Suppressed enemy withdraws.');
fresh();
run(
  "const held=alive(0).find(u=>u.type==='trooper');selected=[held];tacticalOrders('hold');units=units.filter(u=>!defs[u.type].speed||u===held);const hx=held.x,hy=held.y;add('trooper',1,held.x+210,held.y)"
);
tick(10);
assert(run('Math.hypot(held.x-hx,held.y-hy)<3'), 'Hold does not chase targets out of range.');
fresh();
run(
  "const repairer=alive(0).find(u=>u.type==='worker'),damaged=alive(0).find(u=>u.type==='core');damaged.hp-=300;repairer.x=390;repairer.y=920;repairer.order={kind:'repair',target:damaged};const healthBefore=damaged.hp;ore=1000"
);
tick(100);
assert(run('damaged.hp>healthBefore'), 'Worker repairs damage.');
fresh();
run(
  "units=units.filter(u=>u.team===0||!defs[u.type].speed);const captureUnit=add('trooper',0,950,830);const budgetBefore=enemyBudget"
);
tick(170);
assert.equal(run('depot.team'), 0, 'Depot captured by holding ground.');
run('const depotBudget=enemyBudget');
tick(100);
assert.equal(run('enemyBudget'), run('depotBudget'), 'No passive reserves accrue when enemy workers and depot income are absent.');
run(
  "units.filter(u=>u.team===1&&u.type==='forge').forEach(u=>u.hp=0);enemySpawn=0;const enemyCount=alive(1).length"
);
tick(100);
assert.equal(
  run('alive(1).length'),
  run('enemyCount'),
  'Destroyed barracks cannot produce infantry during rebuilding.'
);
fresh();
run(
  "const hiddenEnemy=alive(1).find(u=>u.type==='hero');selected=[alive(0).find(u=>u.type==='hero')];mode='attack';command({x:hiddenEnemy.x,y:hiddenEnemy.y})"
);
assert(run('!selected[0].order.target'), 'Focus fire cannot acquire an unseen enemy.');
assert(!run('sees(1,selected[0])'), 'Enemy also lacks distant vision.');
fresh();
run(
  "units=units.filter(u=>!defs[u.type].speed);const recovering=add('trooper',0,390,970,{hp:50,morale:30});t=10;updateTactics(1)"
);
assert(run('recovering.hp>50&&recovering.morale>30'), 'Aid stations recover wounds and morale.');
fresh();
run(
  "ore=0;heroRecovery=[{team:0,name:'King Babar',at:0}];units=units.filter(u=>u.type!=='hero'&&u.type!=='worker');update(.05)"
);
assert.equal(run("alive(0).filter(u=>u.type==='hero').length"), 0, 'Commander needs return cost.');
run('ore=100;update(.05)');
assert.equal(run("alive(0).filter(u=>u.type==='hero').length"), 1);
// Direct focus fire can kill; suppression and retreat are tested separately.
fresh();
run(
  "const attacker=alive(0).find(u=>u.type==='hero'),victim=add('trooper',1,attacker.x+60,attacker.y);for(let i=0;i<10;i++)if(victim.hp>0)shoot(attacker,victim)"
);
assert(run('kills>0'));
console.log(
  'PASS: obstacle and building routes, blocked supply and restoration, isolated queues, cover, suppression, hold, repair, depot capture, finite recruitment, fog fairness, wounded recovery, paid commander return, lethal focus fire.'
);
run(require('node:fs').readFileSync(require('node:path').join(__dirname, 'support-checks.js'), 'utf8'));
run('supportChecks((ok, label) => { if (!ok) throw new Error(label); })');
console.log('PASS: shared original support-effect checks.');
fresh();
run('nextWave=0;enemyThink()');
assert.equal(
  run("alive(1).find(u=>u.type==='hero').order"),
  null,
  'Rataxes remains in reserve for wave one.'
);
run('nextWave=0;enemyThink()');
assert.equal(
  run("alive(1).find(u=>u.type==='hero').order.kind"),
  'attack',
  'Rataxes joins wave two.'
);
fresh();
run("selected=alive(0).filter(u=>u.type==='worker');controlGroup('1',true);selected=[];controlGroup('1')");
assert(run("selected.length>0 && selected.every(u=>u.type==='worker')"), 'Control groups recall assigned units.');
run("const lostGroupUnit=selected[0];lostGroupUnit.hp=0;controlGroup('1')");
assert(run('!selected.includes(lostGroupUnit)'), 'Dead units are omitted from groups.');
run("selected=[alive(0).find(u=>u.type==='core')];controlGroup('1',true,true);controlGroup('1')");
assert(run("selected.some(u=>u.type==='core') && selected.some(u=>u.type==='worker')"), 'Append preserves earlier group members.');
fresh();
run("const rallyBase=alive(0).find(u=>u.type==='core');selected=[rallyBase];const rallyCache=nodes[0];command(rallyCache);train('worker');rallyBase.progress=defs.worker.time;update(.01)");
assert(run("units.at(-1).order.kind==='gather' && units.at(-1).order.node===rallyCache"), 'New provisioners honor resource rally points.');
run("command({x:500,y:1000});train('worker');rallyBase.progress=defs.worker.time;update(.01)");
assert(run("units.at(-1).order.kind==='move' && units.at(-1).order.x===500"), 'Ground rally overrides automatic gathering.');
run('reset()');
assert.equal(run('Object.keys(controlGroups).length'), 0, 'Restart clears saved groups.');
console.log('PASS: control groups and production rally points.');
fresh();
run("const cancelBase=alive(0).find(u=>u.type==='core');selected=[cancelBase];train('worker');train('worker');cancelBase.progress=3;const cancelOre=ore;cancelRecruit(cancelBase,1)");
assert(run('ore===cancelOre+50 && cancelBase.queue.length===1 && cancelBase.progress===3'), 'Cancelling waiting recruit refunds cost and preserves current progress.');
run('cancelRecruit(cancelBase,0)');
assert(run('ore===cancelOre+100 && cancelBase.progress===0 && cancelBase.queue.length===0'), 'Cancelling active recruit resets progress and refunds.');
run('cancelRecruit(cancelBase,0)');
assert(run('ore===cancelOre+100'), 'Repeated cancellation cannot mint supplies.');
console.log('PASS: recruitment cancellation and refunds.');
fresh();
run("const routeScout=add('scout',0,600,1060);selected=[routeScout];mode='move';command({x:720,y:1060});mode='move';command({x:720,y:1150},true)");
assert(run('routeScout.order.x===720 && routeScout.order.y===1060 && routeScout.orders.length===1'), 'Appending preserves current waypoint.');
tick(140);
assert(run('Math.hypot(routeScout.x-720,routeScout.y-1150)<12 && !routeScout.order'), 'Queued route completes both waypoints.');
run("issueOrder(routeScout,{kind:'move',x:600,y:1100});issueOrder(routeScout,{kind:'move',x:500,y:1100},true);tacticalOrders('hold')");
assert(run("routeScout.order.kind==='hold' && routeScout.orders.length===0"), 'Hold clears pending waypoints.');
run("issueOrder(routeScout,{kind:'move',x:500,y:1100},true);orderRetreat(routeScout)");
assert(run('routeScout.orders.length===0'), 'Retreat clears pending waypoints.');
fresh();
run("const deliveryWorker=alive(0).find(u=>u.type==='worker');deliveryWorker.carrying=10;deliveryWorker.x=330;deliveryWorker.y=980;issueOrder(deliveryWorker,{kind:'gather',node:nodes[0]});issueOrder(deliveryWorker,{kind:'move',x:600,y:1100},true)");
tick(50);
assert(run("deliveryWorker.carrying===0 && deliveryWorker.order?.kind==='move'"), 'Gathering completes delivery before advancing queued order.');
console.log('PASS: queued waypoints, delivery transitions, hold and retreat cancellation.');
fresh();
run("const lab=alive(0).find(u=>u.type==='forge');selected=[lab];ore=500;startResearch('drill')");
assert(run("ore===350 && lab.research.id==='drill'"), 'Research reserves its documented supply cost.');
run("train('trooper')");
assert(run('lab.queue.length===0 && ore===350'), 'Research occupies the producer.');
run("const secondLab=add('forge',0,600,1050);selected=[secondLab];startResearch('drill')");
assert(run('!secondLab.research && ore===350'), 'Duplicate concurrent research is rejected.');
run('lab.research.progress=24.99;update(.1)');
assert(run("technologies.has('drill') && !lab.research"), 'Research completes and releases producer.');
run("const researchGuard=add('trooper',0,600,1050),researchRhino=add('trooper',1,650,1050);const rhinoBefore=researchRhino.hp;shoot(researchGuard,researchRhino)");
assert(Math.abs(run('rhinoBefore-researchRhino.hp')-14.4)<.001, 'Upgraded guard damage is 20% greater.');
assert.equal(run('weaponMultiplier(researchRhino)'),1,'Enemy does not inherit player upgrade.');
fresh();
run("const isolatedLab=add('factory',0,1000,1100);selected=[isolatedLab];ore=500;materials=60;startResearch('shells');update(1)");
assert.equal(run('isolatedLab.research.progress'),.25,'Isolated research progresses at 25%.');
run('cancelResearch(isolatedLab)');
assert.equal(run('ore'),455,'Cancellation refunds 75% of 180 supplies.');
run('cancelResearch(isolatedLab)');
assert.equal(run('ore'),455,'Research cancellation cannot duplicate refunds.');
run("startResearch('shells');isolatedLab.hp=0;update(.1)");
assert(!run("technologies.has('shells')"),'Destroying a lab does not complete its research.');
run('reset()');
assert.equal(run('technologies.size'),0,'Restart clears research.');
console.log('PASS: research cost, exclusive production, duplication guard, completion, damage, isolation, refunds and reset.');
fresh();
run("const king=alive(0).find(u=>u.type==='hero');king.x=600;king.y=1100;const protectedGuard=add('trooper',0,650,1100),distantGuard=add('trooper',0,900,1100),hostileGuard=add('trooper',1,700,1100);protectedGuard.morale=40;commanderAbility(king)");
assert(run('king.commandEnergy===10 && king.commandReadyAt===35 && protectedGuard.morale===60'), 'Babar pays energy and restores 20 nearby morale.');
assert(run('protectedGuard.disciplineUntil===8 && !distantGuard.disciplineUntil && !hostileGuard.disciplineUntil'), 'Protection only affects allies within 180m.');
run('const protectionHP=protectedGuard.hp;shoot(hostileGuard,protectedGuard)');
assert(Math.abs(run('protectionHP-protectedGuard.hp')-6.3)<.001, 'Protection reduces Story enemy damage by 25%.');
assert.equal(run('commanderAbility(king)'),false,'Cooldown/energy prevents repeated activation.');
run('t=9;const expiredHP=protectedGuard.hp;shoot(hostileGuard,protectedGuard)');
assert(Math.abs(run('expiredHP-protectedGuard.hp')-8.4)<.001,'Protection expires after eight seconds.');
fresh();
run("const rhinoKing=alive(1).find(u=>u.type==='hero');const escort=add('trooper',1,rhinoKing.x+30,rhinoKing.y);commanderAbility(rhinoKing);const suppressionTarget=add('trooper',0,rhinoKing.x+80,rhinoKing.y);shoot(escort,suppressionTarget)");
assert.equal(run('suppressionTarget.morale'),82,'Forced advance adds six suppression to a guard hit.');
assert(run('escort.advanceUntil===8 && rhinoKing.commandEnergy===10'), 'Rataxes applies timed advance and pays energy.');
fresh();
run("const unseenKing=alive(1).find(u=>u.type==='hero');enemyThink()");
assert.equal(run('unseenKing.commandEnergy'),60,'AI does not cast without a visible nearby enemy.');
run('updateTactics(8)');
assert.equal(run('unseenKing.commandEnergy'),70,'Command energy regenerates at 1.25 per second.');
console.log('PASS: commander range, energy, cooldown, morale, protection expiry, suppression and visibility gate.');
fresh();
run("ore=1000;selected=[alive(0).find(u=>u.type==='core')];build('relay');command({x:600,y:1030});const workerSite=units.at(-1);const assignedBuilder=alive(0).find(w=>w.order?.target===workerSite);const originalWork=workerSite.construction;update(.1)");
assert(run("assignedBuilder.type==='worker' && assignedBuilder.order.kind==='build'"),'Placement assigns a provisioner.');
assert.equal(run('workerSite.construction'),run('originalWork'),'Remote builder does not advance construction.');
run('assignedBuilder.hp=0');
tick(40);
assert.equal(run('workerSite.construction'),run('originalWork'),'Construction stops after builder loss.');
run("const replacement=alive(0).find(w=>w.type==='worker');replacement.x=560;replacement.y=1030;selected=[replacement];repairOrder(workerSite);update(.5)");
assert(run("replacement.order.kind==='build' && workerSite.construction<originalWork"),'Repair assigns a replacement and construction resumes on site.');
run('const suppliesBeforeCancel=ore;cancelConstruction(workerSite);cancelConstruction(workerSite)');
assert.equal(run('ore-suppliesBeforeCancel'),75,'Site cancellation refunds exactly 75% once.');
tick(2);
assert(run("replacement.order?.kind!=='build'"),'Cancellation releases the assigned builder.');
fresh();
run("for(const w of alive(0).filter(w=>w.type==='worker'))w.hp=0;ore=1000;selected=[alive(0).find(u=>u.type==='core')];const beforeNoBuilder=units.length;build('relay');command({x:600,y:1030})");
assert(run('ore===1000 && units.length===beforeNoBuilder'),'No worker means no charge and no unattended site.');
console.log('PASS: worker construction, travel, builder loss, replacement, cancellation and no-worker validation.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname, 'book-checks.js'), 'utf8'));
run('bookChecks((ok, label) => { if (!ok) throw new Error(label); })');
console.log('PASS: book roster preservation, eight numerical support effects, cooldowns, costs, archives and reset.');
run(require('node:fs').readFileSync(require('node:path').join(__dirname, 'siege-checks.js'), 'utf8'));
run('siegeChecks((ok, label) => { if (!ok) throw new Error(label); })');
console.log('PASS: siege transitions, spotting, splash, friendly fire, range, movement, retreat, research, AI and casualties.');
run(require('node:fs').readFileSync(require('node:path').join(__dirname, 'economy-checks.js'), 'utf8'));
run('economyChecks((ok, label) => { if (!ok) throw new Error(label); })');
console.log('PASS: material extraction, delivery, saturation, raids, prerequisites, dual-resource costs/refunds, multi-production, idle workers and enemy material limits.');

run(require("node:fs").readFileSync(require("node:path").join(__dirname,"enemy-economy-checks.js"),"utf8"));
run("enemyEconomyChecks((ok,message)=>{if(!ok)throw Error(message)})");
console.log("PASS: physical enemy economy, queues, worker replacement, paid rebuilding, population, depot, repair and fair expansion decisions.");

run(require("node:fs").readFileSync(require("node:path").join(__dirname,"counter-checks.js"),"utf8"));
run("counterChecks((ok,message)=>{if(!ok)throw Error(message)})");
console.log("PASS: anti-armor roles, sapper tech/costs, scouted counters, faction research and simulated matchups.");

run(require("node:fs").readFileSync(require("node:path").join(__dirname,"alert-checks.js"),"utf8"));
run("alertChecks((ok,message)=>{if(!ok)throw Error(message)})");
console.log("PASS: attack report grouping, expiry, camera cycling, order preservation, modal guards and reset.");

run(require('node:fs').readFileSync(require('node:path').join(__dirname, 'selection-checks.js'), 'utf8'));
run('selectionChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: selection subgroups, command isolation, cycling, casualty fallback, control groups and reset.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'resource-memory-checks.js'),'utf8'));
run('resourceMemoryChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: both factions use scouted stock memory, revisit depleted caches, avoid unknown stocks and deliver final cargo.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'production-checks.js'),'utf8'));
run('productionChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: production rates, queue reports, isolation, research, construction, site selection and report lifecycle.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'population-checks.js'),'utf8'));
run('populationChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: housing raids block both armies, queues retain progress, rebuilds resume, commanders wait and cancellations refund.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'waypoint-checks.js'),'utf8'));
run('waypointChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: blocked forest/building waypoints, new foundations and a 24-unit queued round trip.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'armor-checks.js'),'utf8'));
run('armorChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: infantry protection prerequisites, payments, cancellation, completion, damage outcomes and enemy research.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'patrol-checks.js'),'utf8'));
run('patrolChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: repeating patrols, queues, active origins, combat resumption, fog, hold, obstacles and spacing.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'intelligence-checks.js'),'utf8'));
run('intelligenceChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: fogged building memory, hidden-state isolation, scouted removal, expiry and faction symmetry.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'rapid-checks.js'),'utf8'));
run('rapidChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: researched infantry burst, health, duration, cooldown, speed/fire effects and fair enemy activation.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'camera-view-checks.js'),'utf8'));
run('cameraViewChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: saved camera snapshots, selection/order isolation, zoom, pause, shortcuts, modal guards and mission lifecycle.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'workforce-checks.js'),'utf8'));
run('workforceChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: read-only workforce assignment, extraction, hauling, waiting, fog knowledge, quarry supply and delivery feedback.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'build-queue-checks.js'),'utf8'));
run('buildQueueChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: paid queued construction, delivery handoff, cancellation, queue capacity, builder loss, replacement and blocked gathering.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'enemy-operation-checks.js'),'utf8'));
run('enemyOperationChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: scouted economic raids, persistent defense memory, stale workers, split armies, approach routes and preserved withdrawals.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'enemy-raid-scenario.js'),'utf8'));
console.log('PASS: rendered-compatible economic raid comparison',run('JSON.stringify(enemyRaidExecutionChecks((ok,label)=>{if(!ok)throw Error(label)}))'));

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'recon-checks.js'),'utf8'));
run('reconChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: paid recurring reconnaissance, route memory, visibility, withdrawal, recovery and mission reset.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'battery-checks.js'),'utf8'));
run('batteryChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: read-only battery readiness, observation, reload, blind spot, friendly fire and group status.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'minimap-checks.js'),'utf8'));
run('minimapChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: minimap commands, waypoints, rally points, camera dragging and placement guards.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'headquarters-checks.js'),'utf8'));
run('headquartersChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: field headquarters costs, supply roots, recruitment, destruction and fair enemy expansion.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'delivery-checks.js'),'utf8'));
run('deliveryChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: physical base delivery accounting, material separation, council bonus, destruction and faction parity.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'clock-checks.js'),'utf8'));
run('clockChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: fixed simulation cadence, frame jitter, interpolation, pause, restart and bounded catch-up.');

run(require('node:fs').readFileSync(require('node:path').join(__dirname,'type-selection-checks.js'),'utf8'));
run('typeSelectionChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: on-screen type selection, mixed append, Shift removal, buildings and input guards.');
run(require('node:fs').readFileSync(require('node:path').join(__dirname,'fire-discipline-checks.js'),'utf8'));
run('fireDisciplineChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: fire discipline, silent movement/patrol, ambush release, explicit focus, target loss, faction symmetry, mixed groups, routes, modal guards and reset.');
run(require('node:fs').readFileSync(require('node:path').join(__dirname,'hero-combat-checks.js'),'utf8'));
run('heroCombatChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: hero fighting, strike costs/cooldowns, focus, cover, fog/range, stance and state guards.');
run(require('node:fs').readFileSync(require('node:path').join(__dirname,'munitions-checks.js'),'utf8'));
run('munitionsChecks((ok,label)=>{if(!ok)throw Error(label)})');
console.log('PASS: Munitions income, denial, cap, conversion, costs, buffs, expiry, state guards and restart.');
