(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('missile-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?missiles=56';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.missileChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;ore=3000;materials=1000;selected=[alive(0).find(u=>u.type==='worker')];cam.x=490;cam.y=1000;cam.zoom=1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(button('Ballistic Launcher').disabled&&button('Missile Defense Battery').disabled,'locked building buttons explain research');
 g.eval("technologies.add('ballistics');technologies.add('damageLimitation');updateUI(true)");
 button('Ballistic Launcher').click();d.querySelector('#phone-tabs [data-panel=orders]').click();
 const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect();
 function tap(p){for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));}
 tap(g.eval('screen({x:490,y:1080})'));check(g.eval("alive(0).some(u=>u.type==='silo'&&u.construction)&&ore===2720&&materials===880"),'touch constructs paid launcher');
 g.eval("this.silo=alive(0).find(u=>u.type==='silo');silo.construction=0;silo.hp=silo.max;rebuildSupply();selected=[silo];updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();button('Launch ballistic missile').click();d.querySelector('#phone-tabs [data-panel=orders]').click();
 tap(g.eval('screen({x:600,y:1000})'));check(g.eval("atomicStrikes[0]?.kind==='ballistic'&&!paused"),'touch launch without pausing');
 check(d.querySelector('#depot-status').textContent.includes('BALLISTIC'),'public missile warning');
 g.eval("this.battery=add('interceptor',1,660,1000);add('headquarters',1,760,1020);rebuildSupply();t+=3;draw();running=false");
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
