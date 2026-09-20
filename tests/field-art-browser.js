(async()=>{
 const lines=[];let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try{for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;
 const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?art=41';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;
 await g.eval('earthTexture.decode()');check(g.eval('earthTexture.naturalWidth>0'),'texture decoded');
 d.getElementById('start').click();g.eval("paused=true;cam.x=620;cam.y=680;cam.zoom=.8;revealUntil=9999;this.artBuilding=alive(0).find(u=>u.type==='core');artBuilding.hp=artBuilding.max*.3;draw()");
 check(g.eval('battlefieldTextured'),'texture cached');
 check(g.eval('battlefieldCache.width===W && battlefieldCache.height===H'),'cache world size');
 g.eval('this.cacheBefore=battlefieldCache;draw()');check(g.eval('battlefieldCache===cacheBefore'),'cache reused');
 const timing=g.eval(`(()=>{const samples=[];for(let i=0;i<30;i++){const start=performance.now();drawBattlefieldGround(ctx);samples.push(performance.now()-start);}const rebuild=[];for(let i=0;i<8;i++){battlefieldCache=null;const start=performance.now();drawBattlefieldGround(ctx);rebuild.push(performance.now()-start);}draw();return {cached:samples.reduce((a,b)=>a+b)/samples.length,rebuild:rebuild.reduce((a,b)=>a+b)/rebuild.length};})()`);
 check(d.documentElement.scrollWidth<=w,'no layout overflow');
 g.eval('paused=false;reducedMotion=true;drawShellImpact(ctx,{x:100,y:100,r:20,life:.5,max:1},true);draw()');
 check(g.eval('battlefieldCache===null')===false,'reduced motion draw');
 const blob=await new Promise(r=>d.querySelector('#game').toBlob(r));
 if(location.port==='8002')await fetch('/review-'+w+'.png',{method:'POST',body:blob});
 lines.push('PASS '+w+'×'+h+' '+JSON.stringify(timing));g.eval('paused=true');f.remove();
 }document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
 }catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
