(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?resource=591';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 await g.eval('Promise.all(Object.values(resourceSprites).map(image=>image.decode()))');
 check(g.eval('Object.values(resourceSprites).every(image=>image.naturalWidth===192&&image.naturalHeight===144)'),'all resource sprites decode at expected dimensions');
 g.eval("reset();running=true;paused=false;cam={x:450,y:850,zoom:1};nodes=[{x:450,y:700,r:20,amount:1800},{x:450,y:850,r:26,amount:1600,kind:'materials'},{x:450,y:1000,r:24,amount:120,kind:'uranium'}];selected=[];revealUntil=9999;draw();running=false");
 for(const zoom of [.72,1,1.6]){g.eval('cam.zoom='+zoom+';draw()');check(d.querySelector('#game').width>0,'draw succeeds at zoom '+zoom);}
 check(g.eval("nodes.map(resourceLabel).join(',')==='1800,1600,120'"),'quantities remain correct');
 check(d.documentElement.scrollWidth<=w,'phone layout fits');g.eval('cam.zoom=1;draw()');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
