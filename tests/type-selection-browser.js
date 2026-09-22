(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const rules=await fetch('type-selection-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?selection=571';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(rules);g.typeSelectionChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;units=[];cam={x:900,y:630,zoom:1};this.anchor=add('trooper',0,900,630);add('trooper',0,930,630);add('trooper',0,1900,1300);add('scout',0,870,650);add('trooper',1,920,650);selected=[anchor];updateUI(true);draw()");
 const c=d.querySelector('#game'),r=c.getBoundingClientRect(),p=g.eval('screen(anchor)');
 c.dispatchEvent(new g.MouseEvent('dblclick',{button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval("selected.length===3&&selected.every(u=>u.type==='trooper'&&u.team===0)"),'double-click includes offscreen matching troops');
 g.eval('selected=[anchor];updateUI(true)');d.querySelector('#phone-tabs [data-panel=actions]').click();
 [...d.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Same type')).click();
 check(g.eval('selected.length===3&&!paused'),'touch Same type selects across map without pause');

 d.querySelector('#phone-tabs [data-panel=orders]').click();
 function tap(point){for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+point.x,clientY:r.top+point.y,bubbles:true,cancelable:true}));}
 g.eval('selected=[];clearUnitTap()');tap(p);
 check(g.eval('selected.length===1&&selected[0]===anchor'),'first tap selects one');tap(p);
 check(g.eval('selected.length===3&&!paused'),'second touch tap selects all matching troops without dblclick');
 tap({x:p.x+90,y:p.y+90});
 check(g.eval("selected.length===3&&selected.every(u=>u.order?.kind==='move')"),'next touch move commands whole group');
 g.eval('clearUnitTap();selected=[]');tap(p);c.dispatchEvent(new g.PointerEvent('pointercancel',{pointerId:1,bubbles:true}));tap(p);
 check(g.eval('selected.length===1'),'cancelled gesture cannot trigger double selection');
 g.eval('clearUnitTap();touchUnitSelection(anchor,1000);touchUnitSelection(anchor,1500)');
 check(g.eval('selected.length===1'),'slow taps remain single selection');
 check(d.documentElement.scrollWidth<=w,'layout fits');g.eval('running=false');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
