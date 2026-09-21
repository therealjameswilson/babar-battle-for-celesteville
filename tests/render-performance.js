(async()=>{
 const f=document.querySelector('iframe');await new Promise(r=>f.onload=r);const g=f.contentWindow;
 f.contentDocument.querySelector('#opening-skip').click();f.contentDocument.querySelector('#start').click();
 await Promise.all([...f.contentDocument.images].map(i=>i.decode().catch(()=>{})));
 g.eval("reset();running=true;paused=true;cam.x=320;cam.y=900;cam.zoom=1.2;for(let i=0;i<100;i++)add('trooper',0,100+(i%10)*155,150+Math.floor(i/10)*100);this.drawCalls=0;this.originalDrawUnit=drawUnit;drawUnit=function(u){drawCalls++;return originalDrawUnit(u)}");
 await new Promise(r=>setTimeout(r,500));
 const result=g.eval(`(()=>{
   const measure=()=>{const samples=[];let drawn=0;for(let i=0;i<100;i++){drawCalls=0;const start=performance.now();draw();samples.push(performance.now()-start);drawn+=drawCalls;}samples.sort((a,b)=>a-b);return {drawnPerFrame:drawn/100,medianMs:samples[50],p95Ms:samples[95]};};
   const cull=unitInViewport;unitInViewport=()=>true;const uncull=measure();unitInViewport=cull;const optimized=measure();
   const check=(v,s)=>{if(!v)throw Error(s)};
   check(battlefieldPixelRatio(390,500,3)===3,'Retina resolution');
   check(battlefieldPixelRatio(2560,1440,3)===1,'large-display pixel bound');
   check(spriteRasterPixels<=3000000,'sprite memory bound');
   const probe={id:-1,hp:100,x:cam.x,y:cam.y};check(unitInViewport(probe),'visible unit');probe.x=10000;check(!unitInViewport(probe),'offscreen culling');selected=[probe];check(unitInViewport(probe),'selected range retained');probe.hp=0;check(!unitInViewport(probe),'dead unit excluded');selected=[];
   check(optimized.drawnPerFrame<uncull.drawnPerFrame/2,'draw workload reduced');
   return {units:units.length,unculled:uncull,optimized,cachePixels:spriteRasterPixels,checks:8,canvas:[canvas.width,canvas.height],dpr:devicePixelRatio};})()`);
 document.querySelector('#result').textContent=JSON.stringify(result,null,2);
})();
