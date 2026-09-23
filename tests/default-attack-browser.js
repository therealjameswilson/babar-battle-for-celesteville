(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const rules=await fetch('default-attack-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?default=592';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(rules);g.defaultAttackChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;this.guard=alive(0).find(u=>u.type==='trooper');selected=[guard];cam={x:600,y:1000,zoom:1};updateUI(true)");
 const c=d.querySelector('#game'),r=c.getBoundingClientRect();
 function tap(point,button=0){for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:button?'mouse':'touch',button,clientX:r.left+point.x,clientY:r.top+point.y,bubbles:true,cancelable:true}));}
 const p=g.eval('screen({x:650,y:1040})');tap(p);
 check(g.eval("guard.order.kind==='attack'&&!paused"),'ordinary touch attack-moves without pausing');
 g.eval('mode=null');tap(p,2);check(g.eval("guard.order.kind==='attack'"),'desktop right-click attack-moves');
 d.querySelector('#phone-tabs [data-panel=status]').click();[...d.querySelectorAll('.orders button')].find(b=>b.textContent.startsWith('Move')).click();tap(p);
 check(g.eval("guard.order.kind==='move'"),'explicit Move button remains passive');
 check(d.querySelector('#phone-tabs').textContent.includes('Army / attack'),'phone default is labeled attack');
 check(d.documentElement.scrollWidth<=w,'phone layout fits');g.eval('running=false');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
