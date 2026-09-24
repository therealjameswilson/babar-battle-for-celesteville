/* Shared rule checks for bounded, non-omniscient attack reports. */
function alertChecks(check){
  easy=false;reset();running=true;nextWave=enemySpawn=9999;
  const initialIds=units.map(u=>u.id).join(',');reset();running=true;nextWave=enemySpawn=9999;
  check(units.map(u=>u.id).join(',')===initialIds,'Restart uses the same unit IDs for reproducible movement tie-breaks');
  const core=alive(0).find(u=>u.type==='core'),worker=alive(0).find(u=>u.type==='worker'),enemy=alive(1).find(u=>u.type==='trooper');
  const oldSelection=selected,oldOrder=worker.order;
  damageUnit(enemy,core,12);
  check(activeAttacks().length===1&&activeAttacks()[0].x===core.x&&activeAttacks()[0].y===core.y,'Attack report records victim location, not hidden attacker position');
  check(!$('attack-alert').hidden&&$('attack-alert').textContent.includes('Royal Palace'),'Damaged base produces a visible named attack report');
  const firstTone=attackToneAt;
  t+=1;damageUnit(enemy,core,12);
  check(activeAttacks().length===1&&attackToneAt===firstTone,'Nearby repeated hits merge and do not spam the alert tone');
  cam.x=1200;cam.y=200;jumpToAttack();
  check(cam.x===core.x&&cam.y===core.y&&selected===oldSelection&&worker.order===oldOrder,'Jump centers the report without changing selection or orders');
  const outpost=add('relay',0,1000,1000);t+=1;damageUnit(enemy,outpost,12);
  check(activeAttacks().length===2&&$('attack-alert').textContent.includes('2 fronts'),'Distant raids create separate report fronts');
  attackCursor=0;jumpToAttack();const firstCamera=cam.x;jumpToAttack();
  check(firstCamera!==cam.x,'Repeated jump cycles distinct active attacks');
  const before=activeAttacks().length;damageUnit(core,worker,1);
  check(activeAttacks().length===before,'Friendly fire does not create enemy attack warnings');
  t+=16;updateAttackAlert();
  check(!activeAttacks().length&&$('attack-alert').hidden,'Quiet fronts expire after fifteen seconds');
  for(let i=0;i<8;i++){t+=.1;recordAttack(enemy,{type:'trooper',team:0,x:100+i*240,y:100});}
  check(attackReports.length===5,'Reports are bounded to five recent fronts');
  paused=true;const beforePause=paused;jumpToAttack();check(paused===beforePause,'Reviewing attack reports never resumes a paused game');
  const savedX=cam.x;$('court-dialog').open=true;attackCursor=0;jumpToAttack();
  check(cam.x===savedX,'Council dialog prevents the attack shortcut moving the map behind it');
  $('court-dialog').open=false;finish(false);check($('attack-alert').hidden,'End-of-match hides the actionable attack banner');
  const oldAudio=audioContext,oldMuted=muted,oldGraph=audioGraph;let notes=0;
  const parameter={setValueAtTime(){},setTargetAtTime(){},exponentialRampToValueAtTime(){}};
  const node=()=>({connect(){return this;},disconnect(){}});
  const fake={state:'running',currentTime:0,destination:{},createOscillator(){notes++;return{...node(),frequency:parameter,start(){},stop(){}}},createGain(){return{...node(),gain:parameter}},createDynamicsCompressor(){return{...node(),threshold:{},knee:{},ratio:{},attack:{},release:{}}}};
  try{
    audioGraph=null;audioContext=fake;muted=false;attackSound();check(notes===2,'Attack dispatch uses two synthesized notes');
    muted=true;attackSound();check(notes===2,'Muted attack reports create no audio nodes');
    muted=false;fake.state='suspended';attackSound();check(notes===2,'Attack reports do not resume suspended audio');
    audioContext=null;attackSound();check(audioContext===null,'Attack report cannot start audio before user interaction');
  }finally{stopAudioVoices();audioContext=oldAudio;audioGraph=oldGraph;muted=oldMuted;}
  reset();check(!attackReports.length&&attackCursor===0&&$('attack-alert').hidden,'Restart clears attack locations and hides the banner');
}
