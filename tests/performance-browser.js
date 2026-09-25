'use strict';
document.querySelector('iframe').onload=async()=>{
 const params=new URLSearchParams(location.search),renderEnabled=params.get('render')!=='off',manual=params.get('clock')==='manual';
 const g=document.querySelector('iframe').contentWindow,d=g.document,out=document.querySelector('#result');
 d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 out.textContent='Preparing deterministic battle';
 // Sprites warm during the first five simulated seconds.

 try {g.eval(`
  // Repeat the same seeded 25-second battle: warmup 0–5s, measure 5–25s.
  this.benchRandom=Math.random;this.benchSeed=31971;
  Math.random=()=>{benchSeed=(Math.imul(1664525,benchSeed)+1013904223)>>>0;return benchSeed/4294967296;};
  easy=true;reset();running=true;nextWave=enemySpawn=99999;guideProgress.enabled=false;
  cam={x:950,y:650,zoom:.7};
  for(let team=0;team<2;team++)for(let i=0;i<60;i++){
    const u=add(i%8===0?'walker':'trooper',team,650+team*540+(i%6)*22,400+Math.floor(i/6)*35);
    u.order={kind:'attack',x:team===0?1230:650,y:u.y};
  }
  this.bench={started:performance.now(),last:null,frameStart:0,frames:[],longFrames:[],cpu:{},calls:{},steps:0,done:false};
  this.benchOriginals={};
  // Coarse phase instrumentation; nested samples are inclusive, not additive.
  for(const name of ['draw','update','loop','updateTactics','updateAtomic','enemyThink','separate','route','updateUI','drawBattlefieldGround','drawUnit','nearest']){
    const original=eval(name);benchOriginals[name]=original;bench.cpu[name]=[];
    const wrapped=function(...args){
      bench.calls[name]=(bench.calls[name]||0)+1;
      const tick=Math.round(t/.05),measuring=tick>=100&&tick<500&&!bench.done,start=performance.now();
      const result=name==='draw'&&!${renderEnabled}?undefined:original(...args);
      if(measuring)bench.cpu[name].push(performance.now()-start);
      return result;
    };
    eval(name+'=wrapped');
  }
  this.benchDone=new Promise(resolve=>{
    const originalUpdate=update;
    update=function(dt){if(bench.done)return;originalUpdate(dt);if(t>5+1e-6)bench.steps++;if(t>=25-1e-6){bench.done=true;running=false;resolve();}};
    function sample(now){
      if(t>=5&&bench.last!==null){const gap=now-bench.last;bench.frames.push(gap);if(gap>33.4)bench.longFrames.push({at:+t.toFixed(2),gap:+gap.toFixed(2)});}
      bench.last=now;if(!bench.done)requestAnimationFrame(sample);
    }
    if(!${manual})requestAnimationFrame(sample);
  });
 `);
 out.textContent='Measuring seeded battle: 5–25 simulation seconds';
 const heartbeat=setInterval(()=>{out.textContent=g.eval('JSON.stringify({t,paused,running,visibility:document.visibilityState,calls:bench.calls})');},1000);
 if(manual){
  g.eval('loop=()=>{}');
  await new Promise(resolve=>{const driver=setInterval(()=>{const done=g.eval('if(!bench.done){update(.05);draw();}bench.done');if(done){clearInterval(driver);resolve();}},50);});
 }
 else await g.eval('benchDone');
 clearInterval(heartbeat);
 let pairedNearest;
 if(params.has('compare')){
  pairedNearest=g.eval(`(()=>{
   const samples={original:[],candidate:[]}, targets=units.filter(u=>u.hp>0&&defs[u.type].damage);
   const candidate=benchOriginals.nearest;
   const original=(u,list)=>list.reduce((best,a)=>(!best||dist(u,a)<dist(u,best)?a:best),null);
   const lists=targets.map(u=>alive(1-u.team).filter(a=>sees(u.team,a)));
   const equivalent=targets.every((u,i)=>candidate(u,lists[i])===original(u,lists[i]));
   for(let i=0;i<240;i++){
    for(const name of i%2?['candidate','original']:['original','candidate']){
     const fn=name==='candidate'?candidate:original,start=performance.now();
     for(let pass=0;pass<10;pass++)for(let j=0;j<targets.length;j++)fn(targets[j],lists[j]);
     const elapsed=performance.now()-start;
     if(i>=40)samples[name].push(elapsed/10);
    }
   }
   return {samples,equivalent,units:targets.length};
  })()`);
 }
 const stats=g.eval(`(()=>{
   const summary=a=>{const b=a.slice().sort((x,y)=>x-y);return {samples:b.length,total:+b.reduce((s,x)=>s+x,0).toFixed(2),median:+(b[Math.floor(b.length*.5)]||0).toFixed(2),p95:+(b[Math.floor(b.length*.95)]||0).toFixed(2),max:+(b.at(-1)||0).toFixed(2)}};
   const result={version:'fixed-interval-v3',nearestSource:benchOriginals.nearest.toString(),visibility:document.visibilityState,viewport:[canvas.clientWidth,canvas.clientHeight],artReady:[bookUnitSheet.naturalWidth,bookBuildingSheet.naturalWidth,bookCouncilSheet.naturalWidth],simulatedInterval:[5,25],simulationSteps:bench.steps,survivingUnits:units.filter(u=>u.hp>0).length,elapsedMs:Math.round(performance.now()-bench.started),frameMs:summary(bench.frames),phases:Object.fromEntries(Object.entries(bench.cpu).map(([k,v])=>[k,summary(v)])),longFrames:bench.longFrames.slice(0,60),stateFingerprint:JSON.stringify(units.map(u=>[u.id,u.type,u.team,+u.x.toFixed(4),+u.y.toFixed(4),+u.hp.toFixed(4)]))};
   Math.random=benchRandom;for(const [name,original] of Object.entries(benchOriginals))eval(name+'=original');
   return result;
 })()`);
 if(pairedNearest)stats.pairedNearest=pairedNearest;
 stats.renderEnabled=renderEnabled;stats.clock=manual?"timer-paced-cpu-only":"requestAnimationFrame";
 out.textContent=JSON.stringify(stats,null,2);
 }catch(error){out.textContent="FAIL "+error.stack;}
};
