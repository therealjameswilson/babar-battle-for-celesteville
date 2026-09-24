'use strict';
document.querySelector('iframe').onload=async()=>{
 const g=document.querySelector('iframe').contentWindow,d=g.document,out=document.querySelector('#result');
 d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 g.eval(`
  nextWave=enemySpawn=99999;revealUntil=99999;cam={x:950,y:650,zoom:.7};
  for(let team=0;team<2;team++)for(let i=0;i<60;i++){
    const u=add(i%8===0?'walker':'trooper',team,650+team*540+(i%6)*22,400+Math.floor(i/6)*35);
    u.order={kind:'attack',x:team===0?1230:650,y:u.y};
  }
  this.bench={draw:[],update:[],loop:[],frames:[],started:performance.now(),last:null,count:0};
  const originalDraw=draw,originalUpdate=update,originalLoop=loop;
  loop=function(now){const start=performance.now();originalLoop(now);if(bench.count>30)bench.loop.push(performance.now()-start);};
  draw=function(){const start=performance.now();originalDraw();if(bench.count>30)bench.draw.push(performance.now()-start);};
  update=function(dt){const start=performance.now();originalUpdate(dt);if(bench.count>30)bench.update.push(performance.now()-start);};
  this.benchDone=new Promise(resolve=>{
    function sample(now){
      if(bench.count>30&&bench.last!==null)bench.frames.push(now-bench.last);
      bench.last=now;bench.count++;
      if(bench.count<211)requestAnimationFrame(sample);
      else {paused=true;updatePresentation();draw=originalDraw;update=originalUpdate;loop=originalLoop;resolve();}
    }
    requestAnimationFrame(sample);
  });
 `);
 await g.eval('benchDone');
 const stats=g.eval(`(()=>{
   const summary=a=>{const b=a.slice().sort((x,y)=>x-y);return {samples:b.length,median:+b[Math.floor(b.length*.5)].toFixed(2),p95:+b[Math.floor(b.length*.95)].toFixed(2),max:+b.at(-1).toFixed(2)}};
   return {visibility:document.visibilityState,viewport:[canvas.clientWidth,canvas.clientHeight],survivingUnits:units.filter(u=>u.hp>0).length,elapsedMs:Math.round(performance.now()-bench.started),frameMs:summary(bench.frames),loopMs:summary(bench.loop),drawMs:summary(bench.draw),simulationMs:summary(bench.update)};
 })()`);
 out.textContent=JSON.stringify(stats,null,2)+'\nSynthetic 120-unit battle, real browser rendering. No physical iPhone measurement.';
};
