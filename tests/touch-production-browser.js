(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?productiontouch=1';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;ore=3000;materials=500;this.school=alive(0).find(u=>u.type==='forge');this.army=alive(0).filter(u=>u.type==='trooper');cam={x:school.x,y:school.y,zoom:1};selected=army;updateUI(true)");
 const c=d.querySelector('#game');
 function tap(point){const r=c.getBoundingClientRect();for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+point.x,clientY:r.top+point.y,bubbles:true,cancelable:true}));}
 for(const mode of [null,'attack','move']){
  g.eval('selected=army;mode='+JSON.stringify(mode)+';updateUI(true)');
  tap(g.eval('screen({x:school.x,y:school.y-72})'));
  check(g.eval('selected.length===1&&selected[0]===school&&mode===null'),'roof tap selects producer with '+mode);
  check(d.querySelector('aside').dataset.panel==='actions','production controls open');
  const train=[...d.querySelectorAll('#actions button')].find(b=>b.textContent.startsWith('Elephant Guard'));
  check(train&&!train.disabled,'recruitment available');train.click();
  check(g.eval('school.queue.length')>0,'tap recruitment queues guard');
 }
 g.eval("selectArmy();setMode('attack');placing='relay'");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 check(g.eval('mode===null&&placing===null'),'Build/train cancels stale command and blueprint');
 g.eval("army[0].x=school.x;army[0].y=school.y-20;selected=army;updateUI(true)");
 tap(g.eval('screen({x:school.x,y:school.y-20})'));
 check(g.eval('selected.length===1&&selected[0]===school'),'nearby guard does not steal building tap');
 g.eval("selected=alive(0).filter(u=>u.type==='worker');school.hp-=100;setMode('repair')");
 tap(g.eval('screen(school)'));
 check(g.eval("selected.every(u=>u.type==='worker')&&selected.some(u=>u.order?.kind==='repair')"),'explicit repair still repairs');
 g.eval("mode='attack';placing='relay';selectArmy()");
 check(g.eval('mode===null&&placing===null'),'Army selection cancels stale targeting');
 check(!g.eval('paused'),'selection does not pause');
 check(d.documentElement.scrollWidth<=w,'layout fits');
 tap(g.eval('screen(school)'));g.eval('running=false;draw()');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' browser assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
