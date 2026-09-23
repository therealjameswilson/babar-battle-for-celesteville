(async()=>{let n=0;const check=(v,s)=>{if(!v)throw Error(s);n++;};try{
for(const [w,h] of [[1280,800],[844,390],[390,844]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?commandqa=1';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 g.eval("reset();running=true;paused=false;units=[];nextWave=enemySpawn=1e9;t+=1;add('core',0,300,850);add('forge',0,440,875);this.testLeader=add('hero',0,486,845,{name:'King Babar'});this.testFactory=add('factory',0,520,1050);technologies.add('atomic');testFactory.atomicReady=true;testFactory.atomicKind='atomic';rebuildSupply();selected=[testLeader];cam.x=400;cam.y=900;updateUI(true);draw()");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 check(!d.querySelector('#nuclear-briefing').hidden,'readiness shown');
 check(d.querySelector('#nuclear-readiness').textContent.includes('atomic bomb ready'),'payload status');
 check(d.querySelector('#nuclear-readiness').textContent.includes('needs clear headquarters sight'),'blocked sight explained');
 d.querySelector('#nuclear-position').click();
 check(g.eval("testLeader.order.kind==='move'"),'button issues movement');
 g.eval("for(let i=0;i<400;i++){t+=.05;move(testLeader,testLeader.order,.05)};updateUI(true);draw()");
 check(d.querySelector('#nuclear-readiness').textContent.includes('headquarters in sight'),'arrival updates authorization');
 check([...d.querySelectorAll('#actions button')].some(b=>b.textContent.includes('Launch atomic bomb')&&!b.disabled),'launch enabled');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 const card=d.querySelector('#nuclear-briefing');card.scrollTop=card.scrollHeight;
 const button=d.querySelector('#nuclear-position').getBoundingClientRect(),rect=card.getBoundingClientRect();
 check(button.width>=44&&button.height>=44,'touch target size');
 check(button.top>=rect.top&&button.bottom<=rect.bottom,'position button reachable by scrolling');
 g.eval('paused=true;updateUI(true)');check(d.querySelector('#nuclear-position').disabled,'pause guard visible');
 g.eval('paused=false;running=false;updateUI(true);draw()');
 if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+n+' browser assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
