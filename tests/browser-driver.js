/* Local-only browser QA. Not included in dist or deployed. */
let qaInterval = null;
let qaObserverInterval = null;
let qaMeasuring=false;
// Accelerated fixtures own simulation time. The normal RAF loop still renders,
// but must not add a second simulation step between the fixture's fixed steps.
const qaLiveLoop=loop;
loop=function(timestamp){
  if(qaMeasuring){last=timestamp;requestAnimationFrame(loop);}
  else if(qaInterval){last=timestamp;draw();requestAnimationFrame(loop);}
  else qaLiveLoop(timestamp);
};
function qaReport(s) {
  parent.document.getElementById('report').textContent = s;
}
function qaReset() {
  qaMeasuring=false;
  clearInterval(qaInterval);qaInterval=null;
  clearInterval(qaObserverInterval);qaObserverInterval=null;
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
    qaReset();const gaitScout=add('scout',0,600,1050);issueOrder(gaitScout,{kind:'move',x:750,y:1050});qaTicks(.5);
    check(gaitScout.walkDistance>20,'Actual navigation advances the visual walk-distance counter');
    const gaitDistance=gaitScout.walkDistance;issueOrder(gaitScout,{kind:'hold'});qaTicks(.3);
    check(gaitScout.walkDistance===gaitDistance,'Holding position does not advance walking distance');
    check(infantryWalkSheet.complete&&infantryWalkSheet.naturalWidth===1254,'Walk atlas loads at verified dimensions');
    check(infantryWalkPhase({movingUntil:t+1,walkDistance:0},false)===0&&infantryWalkPhase({movingUntil:t+1,walkDistance:14},false)===1&&infantryWalkPhase({movingUntil:t+1,walkDistance:28},false)===0,'Walk phases advance with distance, wrapping after two poses');
    check(infantryWalkPhase({movingUntil:t,walkDistance:14})===null,'Stationary infantry uses idle artwork');
    check(infantryWalkPhase({movingUntil:t+1,walkDistance:14},true)===null,'Reduced-motion rule uses static facing artwork');
    const walkCanvas=document.createElement('canvas');walkCanvas.width=1254;walkCanvas.height=1254;
    const wc=walkCanvas.getContext('2d');wc.drawImage(infantryWalkSheet,0,0);
    for(const [team,phases] of infantryWalkFrames.entries())for(const [phase,frames] of phases.entries())for(const [direction,[x,y,w,h]] of frames.entries()){
      const data=wc.getImageData(x,y,w,h).data;let occupied=0,clipped=false;
      for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(data[(yy*w+xx)*4+3]>20){occupied++;if(xx<3||yy<3||xx>=w-3||yy>=h-3)clipped=true;}
      check(occupied>3000&&!clipped,`Walk faction ${team}, pose ${phase}, direction ${direction}: complete transparent crop`);
    }
    check(infantrySheet.complete&&infantrySheet.naturalWidth===1254,'Directional infantry asset loads at its verified dimensions');
    check([0,Math.PI/2,Math.PI,-Math.PI/2].map(infantryDirection).join(',')==='0,1,2,3','Facing bearings select east, south, west and north frames');
    check(infantryDirection(-2*Math.PI)===0&&infantryDirection(2*Math.PI)===0,'Direction mapping wraps negative and full-circle angles');
    const alphaCanvas=document.createElement('canvas');alphaCanvas.width=1254;alphaCanvas.height=1254;
    const alphaContext=alphaCanvas.getContext('2d');alphaContext.drawImage(infantrySheet,0,0);
    for(const [team,frames] of infantryFrames.entries())for(const [direction,[x,y,w,h]] of frames.entries()) {
      const pixels=alphaContext.getImageData(x,y,w,h).data;
      let clipped=false,occupied=0;
      for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(pixels[(yy*w+xx)*4+3]>20){occupied++;if(xx<3||yy<3||xx>=w-3||yy>=h-3)clipped=true;}
      check(!clipped&&occupied>10000,`Faction ${team}, facing ${direction}: sprite has transparent crop margins and visible artwork`);
    }
    supportChecks(check);
    qaReset();
    const savedMotion=motionPreference, motionTime=t;
    const motionOrder=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind]));
    $('help').click();
    check($('help-dialog').open && paused,'Motion preferences open inside the paused field manual');
    $('motion-preference').value='reduced';$('motion-preference').dispatchEvent(new Event('change'));
    check(reducedMotion && infantryWalkPhase({movingUntil:t+1,walkDistance:14})===null,'Reduced-motion selector disables actual renderer walk poses');
    check(localStorage.getItem('babar-motion')==='reduced','Motion preference persists locally');
    check($('motion-status').textContent.startsWith('Reduced motion'),'Current motion behavior is explained visibly');
    $('motion-preference').value='full';$('motion-preference').dispatchEvent(new Event('change'));
    check(!reducedMotion && infantryWalkPhase({movingUntil:t+1,walkDistance:14})===1,'Full-motion selector restores renderer walking poses');
    $('motion-preference').value='system';$('motion-preference').dispatchEvent(new Event('change'));
    check(reducedMotion===matchMedia('(prefers-reduced-motion: reduce)').matches,'System option reads the actual browser media preference');
    check(t===motionTime && JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind]))===motionOrder,'Motion settings cannot alter simulation time, health or orders');
    $('motion-preference').value=savedMotion;$('motion-preference').dispatchEvent(new Event('change'));
    $('help-close').click();
    await new Promise(requestAnimationFrame);
    check(!paused && !$('help-dialog').open,'Closing motion settings restores command');
    togglePause();$('help').click();$('help-close').click();
    await new Promise(requestAnimationFrame);
    check(paused,'Closing the field manual preserves an existing pause');
    togglePause();
    batteryChecks(check);
    clockChecks(check);
    deliveryChecks(check);
    headquartersChecks(check);
    qaReset();ore=500;add('scout',0,960,980);cam={x:1020,y:1070,zoom:.7};
    selected=[alive(0).find(w=>w.type==='worker')];updateUI(true);
    const hqButton=[...$('actions').querySelectorAll('button')].find(b=>b.textContent.includes('Field Headquarters'));
    hqButton.scrollIntoView({block:'nearest'});const hqButtonRect=hqButton.getBoundingClientRect();
    check(hqButtonRect.top>=0&&hqButtonRect.bottom<=innerHeight&&hqButtonRect.left>=0&&hqButtonRect.right<=innerWidth,'Headquarters build control is reachable inside the game viewport');
    hqButton.click();
    check(placing==='headquarters','Visible headquarters build button arms remote construction');
    const hqCanvas=canvas.getBoundingClientRect(),hqPoint=screen({x:1020,y:1070});
    for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerType:'touch',pointerId:80,button:0,clientX:hqCanvas.left+hqPoint.x,clientY:hqCanvas.top+hqPoint.y}));
    check(alive(0).some(b=>b.type==='headquarters'&&b.construction)&&ore===100,'Touch placement creates one paid remote headquarters');
    minimapChecks(check);
    qaReset();const miniUnit=alive(0).find(u=>u.type==='trooper');selected=[miniUnit];
    const miniRect=mini.getBoundingClientRect();
    const miniEvent=(type,x,y,extra={})=>mini.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:91,pointerType:'touch',button:0,clientX:miniRect.left+x*miniRect.width,clientY:miniRect.top+y*miniRect.height,...extra}));
    miniEvent('pointerdown',.3,.3);miniEvent('pointermove',.6,.6);miniEvent('pointerup',.6,.6);
    check(Math.abs(cam.x-W*.6)<.01,'Minimap pointer listeners drag camera on touch');
    document.querySelector('[data-mode="attack"]').click();
    miniEvent('pointerdown',.4,.4);miniEvent('pointerup',.4,.4);
    check(miniUnit.order?.kind==='attack','Touch Attack-move button and minimap tap issue attack-move');
    miniEvent('pointerdown',.6,.4,{button:2,pointerType:'mouse',shiftKey:true});
    check(miniUnit.orders.length===1,'Mouse minimap event queues a waypoint with Shift');
    mode=null;miniEvent('pointerdown',.2,.2);miniEvent('pointercancel',.2,.2);
    check(minimapGesture===null,'Pointer cancellation clears minimap camera capture');
    reconChecks(check);
    enemyOperationChecks(check);
    enemyRaidExecutionChecks(check);
    buildQueueChecks(check);
    qaReset();ore=1000;const queueBuilder=alive(0).find(u=>u.type==='worker');selected=[queueBuilder];cam={x:500,y:1020,zoom:1};updateUI(true);
    const placePointer=(p,kind,shift)=>{const rect=canvas.getBoundingClientRect(),q=screen(p);for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new PointerEvent(type,{pointerId:91,pointerType:kind,button:0,buttons:type==='pointerdown'?1:0,shiftKey:shift,clientX:rect.left+q.x,clientY:rect.top+q.y,bubbles:true}));};
    [...$('actions').querySelectorAll('button')].find(b=>b.textContent.startsWith('Village Home')).click();placePointer({x:570,y:1070},'touch',false);
    const firstBuildTarget=queueBuilder.order.target;
    $('queue-orders').click();
    [...$('actions').querySelectorAll('button')].find(b=>b.textContent.startsWith('Village Home')).click();placePointer({x:620,y:970},'touch',false);
    check(queueBuilder.order.target===firstBuildTarget&&queueBuilder.orders.length===1,'Touch Queue and building placement append without replacing active construction');
    $('queue-orders').click();
    [...$('actions').querySelectorAll('button')].find(b=>b.textContent.startsWith('Village Home')).click();placePointer({x:680,y:1060},'mouse',true);
    check(queueBuilder.orders.length===2&&ore===700,'Shift placement appends a third paid foundation');
    selected=[queueBuilder.orders[0].target];updateUI(true);
    check($('selected-info').textContent.includes('Queued construction')&&$('tactical-status').textContent.includes('Paid foundation'),'Selected future foundation explains its queued builder and paid status');
    workforceChecks(check);
    qaReset();const reportingWorker=alive(0).find(u=>u.type==='worker');selected=[reportingWorker];qaTicks(2);updateUI(true);
    check($('selected-info').textContent.includes('assigned')&&$('selected-info').textContent.includes('extracting'),'Selected worker displays assignment and extraction counts');
    check($('tactical-status').textContent.includes('hauling')&&$('tactical-status').textContent.includes('approaching'),'Selected worker distinguishes delivery and approach');
    qaReset();const reportDeposit=nodes.find(n=>n.kind==='materials'&&n.x===275);
    const reportQuarry=add('quarry',0,reportDeposit.x,reportDeposit.y);const reportRaider=add('trooper',1,300,775);rebuildSupply();selected=[reportQuarry];updateUI(true);
    check($('selected-info').textContent.includes('QUARRY ISOLATED'),'Quarry selection displays the supply-cut cause and remedy');
    reportRaider.hp=0;rebuildSupply();updateUI(true);
    check(!$('selected-info').textContent.includes('QUARRY ISOLATED'),'Quarry status clears when its route is restored');
    qaReset();const buildWorkers=alive(0).filter(u=>u.type==='worker');selected=buildWorkers;updateUI(true);
    const preservedWork=new Map(buildWorkers.map(w=>[w.id,w.order]));const beforeBuildFunds=ore;
    [...$('actions').querySelectorAll('button')].find(b=>b.textContent.startsWith('Village Home')).click();command({x:570,y:1070});
    const assignedBuilders=buildWorkers.filter(w=>w.order?.kind==='build');
    check(assignedBuilders.length===1&&ore===beforeBuildFunds-100,'Worker-group construction pays once and assigns one provisioner');
    check(buildWorkers.filter(w=>!assignedBuilders.includes(w)).every(w=>w.order===preservedWork.get(w.id)),'Worker-group construction preserves other gatherers’ orders');
    selected=buildWorkers;updateUI(true);selected=[...buildWorkers.slice(0,-1),alive(0).find(u=>u.type==='hero')];updateUI();
    check(!$('actions').textContent.includes('Village Home'),'Equal-size mixed selection removes worker-group build commands');
    cameraViewChecks(check);
    qaReset();cam.x=420;cam.y=830;cam.zoom=1.1;
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'F5',shiftKey:true,cancelable:true}));
    cam.x=1100;
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'F5',cancelable:true}));
    check(cam.x===420&&cam.zoom===1.1,'Actual F5 keyboard handler saves and recalls the camera');
    $('camera-views-open').click();
    check(!$('camera-views-panel').hidden,'Actual Views button opens the live panel');
    const saveView=$('camera-view-rows').querySelector('[aria-label="Save camera view 2"]');
    cam.x=600;saveView.click();cam.x=1200;
    $('camera-view-rows').querySelector('[aria-label="Go to camera view 2"]').click();
    check(cam.x===600&&$('camera-views-panel').hidden,'Actual Save and Go buttons restore a view and close the panel');
    rapidChecks(check);
    qaReset();technologies.add('rapid');const burstGuard=alive(0).find(u=>u.type==='trooper');selected=[burstGuard];updateUI(true);
    const burstHealth=burstGuard.hp;window.dispatchEvent(new KeyboardEvent('keydown',{key:'v',code:'KeyV'}));
    check(burstGuard.hp===burstHealth-20&&rapidActive(burstGuard),'V keyboard command activates selected researched infantry');
    const burstButton=[...$('actions').querySelectorAll('button')].find(b=>b.textContent.includes('Rapid advance'));
    check(burstButton.disabled&&burstButton.textContent.includes('24s cooldown'),'Ability button shows disabled cooldown immediately after activation');
    check($('tactical-status').textContent.includes('RAPID 6s'),'Unit status shows the remaining burst duration');
    intelligenceChecks(check);
    patrolChecks(check);
    armorChecks(check);
    waypointChecks(check);
    populationChecks(check);
    qaReset();
    while(livingPopulation()<20)add('trooper',0,540,1050);
    const blockedBase=alive(0).find(b=>b.type==='core');
    selected=[blockedBase];ore=500;train('worker');blockedBase.progress=3;
    alive(0).filter(b=>b.type==='relay').forEach(b=>b.hp=0);updateUI(true);$('production-open').click();
    check($('production-capacity').textContent==='20 deployed + 1 queued / 20 population capacity','Live report distinguishes deployed population from paid reservations');
    check($('selected-info').textContent.includes('POPULATION BLOCKED'),'Selected producer explains its population block');
    $('production-close').click();
    const refundBefore=ore;
    [...$('actions').children].find(b=>b.textContent.includes('Cancel 1:')).click();
    check(ore===refundBefore+50&&!blockedBase.queue.length,'Actual cancellation control refunds a blocked recruit');
    productionChecks(check);
    qaReset();
    $('production-open').click();
    check(!$('production-panel').hidden&&!paused,'Actual Production button opens a live report');
    $('production-all').click();
    check(selected.length===2&&selected.every(b=>!defs[b.type].speed),'Actual all-producers button selects completed sites');
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'F4',code:'F4'}));
    check(!$('production-panel').hidden,'F4 opens production report');
    $('production-rows').lastElementChild.click();
    check(selected.length===1&&selected[0].type==='forge','Actual production row selects its school');
    resourceMemoryChecks(check);
    selectionChecks(check);
    qaReset();
    selected=[alive(0).find(u=>u.type==='hero'),alive(0).find(u=>u.type==='trooper'),add('walker',0,500,900)];updateUI(true);
    $('selection-groups').lastElementChild.click();
    check(selected.length===1 && selected[0].type==='walker','Actual artillery subgroup button isolates guns');
    $('selection-groups').firstElementChild.click();
    check(selected.length===3,'Actual All button restores mixed army');
    window.dispatchEvent(new KeyboardEvent('keydown',{key:'t',code:'KeyT'}));
    check(selected.length===1 && selected[0].type==='hero','T shortcut selects commander subgroup');
    check($('actions').textContent.includes('Stand together'),'Commander subgroup exposes ability button');
    alertChecks(check);
    qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
    const alertBase=alive(0).find(b=>b.type==='core'),alertSchool=alive(0).find(b=>b.type==='forge');
    selected=[alertSchool];damageUnit(alive(1).find(u=>u.type==='trooper'),alertBase,12);
    cam.x=1200;cam.y=100;$('attack-alert').click();
    check(cam.x===alertBase.x&&selected[0]===alertSchool,'Actual attack-report button jumps while preserving production selection');
    cam.x=1200;window.dispatchEvent(new KeyboardEvent('keydown',{key:'F3',code:'F3'}));
    check(cam.x===alertBase.x,'F3 shortcut jumps to the reported attack');
    counterChecks(check);
    qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
    selected=[alive(0).find(b=>b.type==='forge')];updateUI(true);
    check([...$('actions').querySelectorAll('button')].find(b=>b.textContent.includes('Field Sapper'))?.disabled,'Sapper UI is locked before Artillery Works');
    add('factory',0,500,1080);ore=90;materials=20;updateUI(true);
    [...$('actions').querySelectorAll('button')].find(b=>b.textContent.includes('Field Sapper')).click();
    check(selected[0].queue.includes('sapper')&&ore===0&&materials===0,'Actual Sapper button pays both costs into production');
    qaTicks(10.1);selected=alive(0).filter(u=>u.type==='sapper');updateUI(true);
    check($('selected-info').textContent.includes('+20 vs armored'),'Selected sapper explains its armor counter in the command panel');
    enemyEconomyChecks(check);
    economyChecks(check);
    qaReset();
    const uiWorker = alive(0).find(u=>u.type==='worker'); uiWorker.order={kind:'hold'};
    $('idle-workers').click();
    check(selected.length===1 && selected[0]===uiWorker, 'Idle button selects waiting provisioners');
    selected=[]; window.dispatchEvent(new KeyboardEvent('keydown',{key:'i',code:'KeyI'}));
    check(selected[0]===uiWorker, 'I shortcut selects idle provisioners');
    const uiSchool=alive(0).find(u=>u.type==='forge'), secondSchool=add('forge',0,560,1020);
    rebuildSupply(); selected=[uiSchool,secondSchool]; updateUI(true);
    const recruitButton=[...document.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Elephant Guard'));
    recruitButton.click();
    [...document.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Elephant Guard')).click();
    check(uiSchool.queue.length===1 && secondSchool.queue.length===1 && $('selected-name').textContent==='Production group', 'Multi-production UI distributes recruitment across both schools');
    check($('materials').textContent==='0', 'Materials stockpile is visible in the command header');
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
    check(nodes.filter(n=>n.kind!=='materials').length === 12, 'Badou and Colin discover separate supplies');
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
    check(enemyBudget === reserves, 'No enemy passive income without workers or owned depot');
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
    const patrolButton=document.querySelector('[data-mode="patrol"]');
    patrolButton.click();touch('pointerdown',{x:560,y:740});touch('pointerup',{x:560,y:740});
    check(leader.order.kind==='patrol','Touch patrol button and map tap issue a repeat route');
    // Desktop sidebars intentionally scroll when controls exceed available height.
    patrolButton.scrollIntoView({block:'nearest'});
    const patrolBounds=patrolButton.getBoundingClientRect();
    check(patrolBounds.top>=0&&patrolBounds.bottom<=innerHeight&&patrolBounds.left>=0&&patrolBounds.right<=innerWidth,'Patrol control is reachable inside the game viewport');
    mode=null;window.dispatchEvent(new KeyboardEvent('keydown',{key:'p',code:'KeyP'}));
    check(mode==='patrol','P shortcut arms the patrol command');
    mode=null;
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
function browserMixedVictory() {browserVictory('mixed');}
function browserVictory(plan = 'siege') {
  qaReset();
  startAudio();
  qaReport(
    'Accelerated Story playthrough: original starting resources, normal orders and earned supplies.'
  );
  qaInterval = setInterval(() => {
    if (!ended) {
      strategyStep(plan);
      qaTicks(1);
      cam.x = depot.team === 0 ? 1240 : 760;
      cam.y = depot.team === 0 ? 460 : 820;
    } else {
      clearInterval(qaInterval);qaInterval=null;
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
      clearInterval(qaInterval);qaInterval=null;
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
  if(qaInterval)return qaReport('Choose a live Battle fixture before measuring.');
  const samples=[],updates=[];qaMeasuring=true;
  const initial=await new Promise(requestAnimationFrame),startedAt=t;
  let previous=initial,steps=0,maxFrameMs=0,clippedMs=0;
  try{
    for(let n=0;n<120&&qaMeasuring;n++){
      const now=await new Promise(requestAnimationFrame);
      const elapsed=(now-previous)/1000;maxFrameMs=Math.max(maxFrameMs,elapsed*1000);clippedMs+=Math.max(0,elapsed-.25)*1000;
      let at=performance.now();steps+=advanceSimulation(elapsed);previous=now;
      updates.push(performance.now()-at);at=performance.now();draw();samples.push(performance.now()-at);
    }
  }finally{qaMeasuring=false;last=null;}
  const avg=a=>a.reduce((x,y)=>x+y,0)/a.length,p95=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length*.95)];
  qaReport(JSON.stringify({frames:samples.length,elapsedMs:Math.round(previous-initial),maxFrameMs,clippedMs,
    simulationSeconds:t-startedAt,simulationTicks:steps,drawMeanMs:avg(samples),drawP95Ms:p95(samples),
    updateMeanMs:avg(updates),updateP95Ms:p95(updates),units:units.length,navigation:navStats},null,2));
  if(!paused&&!ended)togglePause();
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
    selected = [gunLab]; materials = 60; startResearch('shells'); qaTicks(36);
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


function browserEconomy() {
  qaReset(); nextWave = enemySpawn = 9999; enemyScoutSent=true;
  cam={x:350,y:760,zoom:.9};
  selected=[alive(0).find(u=>u.type==='worker')];
  updateUI(true); draw();
  qaReport('Economy fixture uses starting resources. Build a Materials Quarry on the blue deposit northwest of the palace. Assign provisioners with Gather.');
}

function browserEnemyEconomy() {
  qaReset(); nextWave=9999; revealUntil=9999; enemyScoutSent=true;
  qaTicks(180);
  const barracks=alive(1).find(b=>b.type==='forge');
  if (barracks) barracks.hp=0;
  rebuildNav(); enemySpawn=0; enemyMacro();
  cam.x=1280;cam.y=550;cam.zoom=.8;selected=[];togglePause();
  updateUI(true);draw();
  qaReport('Economic AI inspection after 180 simulated seconds. Starting funds only; full-map reveal is a QA aid. Barracks destroyed by fixture: inspect the paid replacement and forward homes, then Resume to watch workers rebuild.');
}

function browserCounters() {
  qaReset();easy=false;nextWave=enemySpawn=9999;enemyScoutSent=true;
  units=units.filter(u=>u.type==='core');
  const a=add('sapper',0,780,990),b=add('sapper',0,780,1030);
  const gun=add('walker',1,950,1010);
  issueOrder(a,{kind:'attack',target:gun});issueOrder(b,{kind:'attack',target:gun});
  issueOrder(gun,{kind:'hold'});selected=[a];cam={x:860,y:990,zoom:1.25};
  updateUI(true);draw();
  qaReport('Counter fixture: two light Field Sappers face an unsupported armored gun. Observe anti-armor hits, suppression and withdrawal. Original infantry atlas has a brass demolition-pack overlay.');
}

function browserAlerts(){
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
  const base=alive(0).find(u=>u.type==='core'),school=alive(0).find(u=>u.type==='forge');
  selected=[school];cam={x:1200,y:450,zoom:.8};
  damageUnit(alive(1).find(u=>u.type==='trooper'),base,50);
  togglePause();updateUI(true);draw();
  qaReport('Attack report fixture: remote damage is injected only to exercise notifications. Click the named attack banner or press F3. Camera returns to the palace, preserving the school selection and pause.');
}
function browserCommander(){
  qaReset();easy=false;reset();running=true;$('overlay').classList.add('hidden');
  qaReport('Defensive Commander playthrough: normal starting funds, earned income and player orders.');
  qaInterval=setInterval(()=>{
    if(!ended){defenseStep();qaTicks(1);cam.x=depot.team===0?1200:460;cam.y=depot.team===0?500:860;}
    else{clearInterval(qaInterval);qaInterval=null;qaReport('Defensive Commander result: '+(alive(0).some(u=>u.type==='core')?'VICTORY':'LOSS')+' · '+time(t)+' · enemy casualties '+kills);}
  },50);
}

function browserSubgroups() {
  qaReset(); nextWave=enemySpawn=9999;enemyScoutSent=true;
  selected=[alive(0).find(u=>u.type==='hero'),alive(0).find(u=>u.type==='trooper'),add('walker',0,500,900)];
  updateUI(true);togglePause();draw();
  qaReport('Subgroup fixture: select Field Artillery, Babar, then All. Orders apply only to highlighted units. T cycles; Shift+T reverses.');
}

function browserAdaptiveExpansion() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;t=160;
  observeEnemyEconomy();const preferred=enemyExpansionSite();
  const raider=add('trooper',0,1090,640);issueOrder(raider,{kind:'hold'});
  t+=.05;observeEnemyEconomy();const alternate=enemyExpansionSite();
  const building=alternate&&enemyBuild('relay',alternate);
  if(building)building.expansion=true;
  // Reveal only for reviewing this fixture; enemy planning already used real sight.
  revealUntil=t+100;cam={x:1200,y:730,zoom:1};selected=[raider];
  updateUI(true);togglePause();draw();
  qaReport(`Actual AI expansion decision: clear road ${preferred?.x},${preferred?.y}; observed raider redirects to ${alternate?.x},${alternate?.y}. Foundation paid: ${building?.paid}. A real worker has the build order. Fixture is paused for review.`);
}

function browserResourceMemory() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
  const stock=nodes.find(n=>n.x===970),scout=add('scout',0,970,840);
  qaTicks(.1);scout.x=300;scout.y=900;stock.amount=0;qaTicks(.05);
  cam={x:980,y:850,zoom:1};selected=[scout];updateUI(true);togglePause();draw();
  qaReport('Scouting fixture: central Supplies were observed at 1800, then depleted outside vision. The remembered label remains '+resourceLabel(stock)+'. Move the scout back to discover the empty cache; unknown deposits remain ?.');
}

function browserProduction() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
  const school=alive(0).find(b=>b.type==='forge');school.queue=['trooper','scout'];school.progress=2;
  const remote=add('forge',0,675,900);remote.queue=['trooper'];remote.progress=2;
  add('trooper',1,570,900);rebuildSupply();
  updateUI(true);togglePause();toggleProduction();draw();
  qaReport('Production fixture: local training, an isolated remote school and idle palace. Report preserves pause; resume to watch progress. Select a row to manage its queue.');
}

function browserPopulation() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
  const base=alive(0).find(b=>b.type==='core');
  while(livingPopulation()<20)add('trooper',0,540,1050);
  base.queue=['worker'];base.progress=3;
  alive(0).filter(b=>b.type==='relay').forEach(b=>b.hp=0);rebuildSupply();
  selected=[base];updateUI(true);togglePause();toggleProduction();draw();
  qaReport('Housing raid fixture: 20 living units / 20 capacity, one paid worker retains 3s progress. Build a Village Home to resume. Cancel still refunds 50 Supplies.');
}

function browserWaypoints() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;
  units=units.filter(u=>u.team===0||u.type==='core');rebuildNav();
  const scout=add('scout',0,650,600);
  issueOrder(scout,{kind:'move',x:840,y:620});issueOrder(scout,{kind:'move',x:1050,y:850},true);
  selected=[scout];cam={x:840,y:720,zoom:1};updateUI(true);
  qaReport('Live waypoint fixture: scout first approaches a blocked forest waypoint, then must continue to 1050,850. No accelerated simulation.');
  qaInterval=setInterval(()=>{
    update(.05);
    if(!scout.order){clearInterval(qaInterval);qaInterval=null;togglePause();updateUI(true);draw();qaReport('Waypoint route completed at '+Math.round(scout.x)+','+Math.round(scout.y)+' with '+scout.orders.length+' queued orders remaining.');}
  },50);
}

function browserDirections() {
  qaReset();nextWave=enemySpawn=9999;enemyScoutSent=true;units=units.filter(u=>u.type==='core');rebuildNav();
  const figures=[];
  for(let team=0;team<2;team++)for(let i=0;i<4;i++)figures.push(add('trooper',team,400+i*110,760+team*150,{angle:i*Math.PI/2,order:{kind:'hold'}}));
  revealUntil=100;cam={x:565,y:805,zoom:1.6};selected=figures.filter(u=>u.team===0);
  updateUI(true);togglePause();draw();
  qaReport('Four-direction infantry review: elephant row above, rhino row below. Left to right: east, south, west, north. Actual loaded atlas, paused at 1.6× zoom. No walk-cycle animation is claimed.');
}

function browserTechnology(){
  qaReset();nextWave=enemySpawn=9999;ore=800;materials=200;
  selected=[alive(0).find(b=>b.type==='forge')];cam.x=selected[0].x;cam.y=selected[0].y;
  updateUI(true);draw();
  qaReport('Research review: 800 Supplies / 200 Materials. Protection II locked behind tier I and Artillery Works. Use the real research buttons; research occupies recruitment and takes 30 seconds.');
}

function browserPatrol(){
 qaReset();nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');rebuildNav();
 const scout=add('scout',0,650,850);selected=[scout];cam.x=820;cam.y=850;cam.zoom=1.15;
 mode='patrol';command({x:1050,y:850});updateUI(true);draw();
 qaReport('Normal-speed patrol from 650,850 to 1050,850. Inspect return travel and use Hold or Patrol (P) to replace the order.');
}

function browserIntelligence(){
 qaReset();nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');
 const scout=add('scout',0,1000,650);add('forge',1,1080,650);add('factory',1,1250,710);
 t=10;sightAt=-1;refreshIntelligence(0);scout.x=400;scout.y=1000;t=45;sightAt=-1;
 refreshIntelligence(0);cam.x=1130;cam.y=680;cam.zoom=1.15;selected=[scout];
 updateUI(true);togglePause();draw();
 qaReport('Last-seen structures: muted silhouettes and hollow minimap marks. No live health, queue or research is shown. Revisit to verify.');
}

function browserRaid(){
 clearInterval(qaInterval);qaInterval=null;raidSetup('sappers');paused=false;$('overlay').classList.add('hidden');
 cam.x=1250;cam.y=630;cam.zoom=.9;
 qaInterval=setInterval(()=>{
  raidStep('raid');for(let k=0;k<20&&!ended;k++){update(.05);raidObserve();}
  qaReport(JSON.stringify(raidResult(),null,2));
  if(t>=180||ended){clearInterval(qaInterval);qaInterval=null;paused=true;updateUI(true);draw();}
 },50);
}

function browserEarnedRaid(){
 clearInterval(qaInterval);qaInterval=null;earnedRaidSetup();paused=false;$('overlay').classList.add('hidden');
 cam.x=930;cam.y=780;cam.zoom=.7;
 qaInterval=setInterval(()=>{
  earnedRaidStep('raid');for(let k=0;k<20&&!ended;k++){update(.05);earnedRaidObserve();}
  qaReport(JSON.stringify(earnedRaidResult(),null,2));
  if(t>=900||ended){clearInterval(qaInterval);qaInterval=null;paused=true;updateUI(true);draw();}
 },50);
}

function browserWalking(){
 qaReset();nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');rebuildNav();
 const walkers=[];for(let team=0;team<2;team++)for(let i=0;i<4;i++){
  const u=add('scout',team,400+i*100,750+team*170);walkers.push(u);
  issueOrder(u,{kind:'move',x:700-i*70,y:750+team*170});
 }
 revealUntil=9999;cam.x=560;cam.y=830;cam.zoom=1.6;selected=walkers.filter(u=>!u.team);
 qaInterval=setInterval(()=>{
  for(const u of walkers)if(!u.order)issueOrder(u,{kind:'move',x:u.x<550?750:400,y:u.y});
  update(.05);
 },50);
 updateUI(true);draw();qaReport('Normal-speed infantry walking review: stride/passing frames and grounded feet during repeated east-west travel. Reduced motion keeps static artwork.');
}

function browserRapid(){
 qaReset();nextWave=enemySpawn=9999;technologies.add('drill');technologies.add('rapid');
 selected=alive(0).filter(u=>u.type==='trooper');cam.x=540;cam.y=820;cam.zoom=1.2;
 updateUI(true);draw();qaReport('Rapid advance researched for this ability fixture. Use the real button or V: selected infantry spends 20 health for 6s of movement/fire boost, followed by cooldown.');
}

function browserBurstBattle(){
 qaReset();burstSetup('engage','normal');selected=alive(0).filter(u=>burstIds.includes(u.id));
 cam.x=760;cam.y=780;cam.zoom=1.8;updateUI(true);draw();
 qaReport('Normal-speed matched infantry engagement. Doctrine is granted for the fixture. Use the actual Rapid advance button or V to trade health for tempo; orders stay intact.');
}
function browserBurstComparisons(){
 qaReset();const checks=[];
 try{
  const results=burstComparisons((ok,label)=>{if(!ok)throw Error(label);checks.push('PASS '+label);});
  paused=true;updateUI(true);draw();qaReport(checks.join('\n')+'\n'+JSON.stringify(results,null,2));
 }catch(error){paused=true;qaReport('FAIL '+error.message);throw error;}
}

function browserDoctrine(policy='rapid'){
 qaReset();doctrineSetup(false);$('overlay').classList.add('hidden');
 cam.x=850;cam.y=740;cam.zoom=.65;
 qaInterval=setInterval(()=>{
  doctrineStep(policy);for(let k=0;k<20&&!ended;k++)update(.05);
  qaReport(JSON.stringify(doctrineResult(),null,2));
  if(t>=900||ended){clearInterval(qaInterval);qaInterval=null;paused=true;updateUI(true);draw();}
 },50);
}

function browserParallelDoctrine(){browserDoctrine('rapid-parallel');}

function browserExactDoctrine(){
 qaReset();doctrineSetup(false);$('overlay').classList.add('hidden');
 const trace=[];
 for(let n=0;n<900&&!ended;n++){
  doctrineStep('rapid-parallel');for(let k=0;k<20&&!ended;k++)update(.05);
  if([1,10,30,60,120,180,240].includes(n+1))trace.push(doctrineSnapshot());
 }
 paused=true;updateUI(true);draw();qaReport(JSON.stringify({result:doctrineResult(),trace},null,2));
}

function browserCameraViews(){
 qaReset();selected=alive(0).filter(u=>u.type==='trooper');
 cam={x:380,y:870,zoom:1};saveCameraView(0);
 cam={x:950,y:830,zoom:.7};saveCameraView(1);
 cam={x:275,y:650,zoom:1.2};saveCameraView(2);
 cam={x:380,y:870,zoom:1};toggleCameraViews();
 qaReport('Use the actual Go buttons to visit base, central approach and quarry. Selection and orders remain intact; battle continues. View 4 is empty. Shift+F5–F8 saves; F5–F8 recalls.');
}

function browserWorkforce(){
 qaReset();nextWave=enemySpawn=9999;
 const cache=nodes[0],workers=alive(0).filter(w=>w.type==='worker');
 workers.forEach(w=>issueOrder(w,{kind:'gather',node:cache}));selected=workers;
 cam={x:230,y:820,zoom:1.2};updateUI(true);draw();
 say('Four provisioners assigned to this Supplies cache.');
 qaReport('All four starting provisioners share one Supplies cache. Observe assigned/extracting counts and the hauling cycle; use Gather to spread them to other caches.');
}

function browserWorkerBattle(){
 browserBattle();selected=alive(0).filter(u=>u.type==='worker');updateUI(true);
 qaReport('Representative battle with provisioners selected and visible resource workload labels.');
}

function browserBuildQueue(){
 qaReset();nextWave=enemySpawn=9999;ore=700;
 selected=[alive(0).find(u=>u.type==='worker')];cam={x:500,y:1020,zoom:1};
 build('relay');command({x:570,y:1070},false);
 build('forge');command({x:620,y:970},true);
 updateUI(true);draw();qaReport('One provisioner: build the home, then the queued school, then resume gathering. Select the school or open Production to inspect its queued status. Foundations are paid at placement; cancellation refunds 75%.');
}

function browserEnemyRaid(){
 qaReset();enemyRaidScenario();draw();updateUI(true);
 qaReport('Controlled raid: the rhino scout observed this outpost. Four raiders approach via the southern road while the main column holds for this fixture. Withdraw the provisioners or defend the home.');
}

function browserDefendedOutpost(){
 qaReset();enemyRaidScenario(true);draw();updateUI(true);
 qaReport('Controlled defended outpost: the observed tower deters the raid. Watch two provisioners deliver around the home, tower and forest, then return to the cache. The main rhino force holds away from the test.');
}

function browserReconCircuit(){
 qaReset();easy=false;nextWave=enemySpawn=9999;t=22;
 units=units.filter(u=>u.type==='core'||(u.team===1&&u.type==='forge'));
 const school=alive(1).find(u=>u.type==='forge');recruitEnemyRecon([school]);
 for(let k=0;k<500&&!alive(1).some(u=>u.recon);k++)update(.05);
 revealUntil=t+600;cam={x:920,y:640,zoom:.65};selected=[];updateUI(true);draw();
 qaObserverInterval=setInterval(()=>{
  enemyReconThink();
  const scout=alive(1).find(u=>u.recon);
  qaReport('Normal-speed reconnaissance fixture; player fog revealed for visual review only. Scout paid through school. '+JSON.stringify(scout?{order:scout.order?.kind,goal:scout.reconGoal?.key,visited:Object.keys(scout.reconVisits||{}),health:Math.round(scout.hp)}:{scout:'lost'}));
 },3000);
}

function browserPush(policy,size=18){
 qaReset();pushSetup(size);paused=false;$('overlay').classList.add('hidden');
 qaInterval=setInterval(()=>{
  if(!ended&&t<899.99){pushStep(policy);for(let k=0;k<20&&!ended&&t<899.99;k++){update(.05);pushObserve(.05);}}
  cam={...PUSH_LINE[pushStage],zoom:.8};draw();qaReport(JSON.stringify({policy,...pushResult()},null,2));
  if(ended||t>=899.99){clearInterval(qaInterval);qaInterval=null;if(!ended)togglePause();}
 },50);
}
function browserStagedPush(){browserPush('staged');}
function browserMarchPush(){browserPush('march');}
function browserBatteryStatus(){
 qaReset();nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');rebuildNav();
 const gun=add('walker',0,650,750,{deployed:true,order:{kind:'hold'}});
 add('scout',0,820,750);add('trooper',0,910,770);add('trooper',1,950,750);
 selected=[gun];cam={x:780,y:750,zoom:1};togglePause();sightAt=-1;updateUI(true);draw();
 qaReport('Paused battery review: forward scout reveals the target; friendly infantry is inside its splash radius. Status warns but does not prevent firing. Resume, pack or reposition the screen.');
}

function browserEarlyPush(){browserPush('staged',14);}

function browserBatteryBattle(){
 browserBattle();selected=alive(0).filter(u=>u.type==='walker');
 for(const gun of selected){gun.deployed=true;issueOrder(gun,{kind:'hold'});}
 updateUI(true);draw();qaReport('Representative battle with the six-gun live battery report selected.');
}

function browserHeadquarters(){
 qaReset();expansionSetup(true);cam={x:1000,y:960,zoom:.9};
 selected=[expansionLedger.site];updateUI(true);
 qaInterval=setInterval(()=>{for(let i=0;i<20&&!ended&&t<239.99;i++)update(.05);
 qaReport(JSON.stringify(expansionResult(),null,2));
 if(ended||t>=239.99){clearInterval(qaInterval);qaInterval=null;togglePause();}
 },50);
}

function browserExpansionOpening(policy){
 qaReset();expansionOpeningSetup(policy);let stepCount=0;
 qaInterval=setInterval(()=>{
  for(let k=0;k<20&&!ended&&t<899.99;k++){
   if(stepCount%20===0)expansionOpeningStep();
   update(.05);expansionOpeningObserve(.05);stepCount++;
  }
  const e=expansionOpening;
  cam.x=e.site?.x||PUSH_LINE[pushStage].x;cam.y=e.site?.y||PUSH_LINE[pushStage].y;cam.zoom=.7;
  if(e.site?.hp>0)selected=[e.site];updateUI();
  qaReport(JSON.stringify(expansionOpeningResult(),null,2));
  if(ended||t>=899.99){clearInterval(qaInterval);qaInterval=null;if(!ended)togglePause();}
 },50);
}
function browserEarlyCampMatch(){browserExpansionOpening('early');}
function browserSecuredCampMatch(){browserExpansionOpening('secured');}
function browserArmyMatch(){browserExpansionOpening('army');}

function browserClockReplay(){qaReset();const result=clockScenario(60);paused=true;updateUI(true);draw();qaReport(JSON.stringify(result,null,2));}
