(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('civil-defense-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?civil=51';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.civilDefenseChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;selected=[alive(0).find(u=>u.type==='worker')];ore=1000;materials=200;cam.x=490;cam.y=1010;cam.zoom=1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent==='Civil Defense');
 check(!!button,'build button available');button.click();d.querySelector('#phone-tabs [data-panel=orders]').click();
 const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect(),p=g.eval('screen({x:490,y:1080})');
 for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval("alive(0).some(b=>b.type==='shelter'&&b.construction)&&!paused"),'touch places paid foundation without pausing');
 g.eval("this.bunker=alive(0).find(b=>b.type==='shelter');bunker.construction=0;bunker.hp=bunker.max;this.launcher=add('factory',1,1200,900);linked.add(launcher.id);atomicStrikes=[{site:launcher,team:1,kind:'atomic',x:490,y:1080,at:t+18}];updateCivilDefense();selected=[bunker];draw();updateUI(true)");
 check(g.eval("alive(0).filter(u=>u.type==='worker').every(w=>w.civilDefense?.shelter===bunker)"),'all workers receive shelter destination');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
