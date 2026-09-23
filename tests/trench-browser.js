(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const rules=await fetch('trench-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?trench=580';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(rules);g.trenchChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;ore=500;materials=100;selected=[alive(0).find(u=>u.type==='worker')];cam={x:570,y:1070,zoom:1};updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();[...d.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Field Trench')).click();
 const c=d.querySelector('#game'),r=c.getBoundingClientRect();
 function tap(point){for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+point.x,clientY:r.top+point.y,bubbles:true,cancelable:true}));}
 tap(g.eval('screen({x:570,y:1070})'));
 check(g.eval("alive(0).some(u=>u.type==='trench'&&u.construction)"),'touch builds trench');
 g.eval("this.trench=alive(0).find(u=>u.type==='trench');for(let i=0;i<900;i++)update(.05);this.guard=alive(0).find(u=>u.type==='trooper');selected=[guard];updateUI(true)");
 check(g.eval('!trench.construction'),'worker completes trench');
 d.querySelector('#phone-tabs [data-panel=orders]').click();tap(g.eval('screen(trench)'));
 check(g.eval("selected[0]===guard&&guard.order?.kind==='move'&&!paused"),'touch orders guard into trench');
 g.eval('for(let i=0;i<900;i++)update(.05)');
 check(g.eval('trenchCover(guard)'),'guard reaches traversable trench and gains cover');
 check(d.documentElement.scrollWidth<=w,'mobile bounds');g.eval('draw();running=false');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
