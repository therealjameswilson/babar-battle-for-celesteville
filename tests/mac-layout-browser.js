// Real-browser layout and input regression checks; no Canvas mock.
(async()=>{
 let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try {
  for(const [w,h] of [[652,678],[800,700],[950,700],[951,700],[1024,768],[1280,800],[390,844],[844,390]]) {
   const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';
   const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?mac=593';document.querySelector('#games').append(f);await ready;
   const g=f.contentWindow,d=f.contentDocument,q=s=>d.querySelector(s),rect=s=>q(s).getBoundingClientRect();
   q('#opening-skip').click();q('#start').click();g.eval('paused=true');
   check(d.documentElement.scrollWidth<=w,'no horizontal overflow '+w);
   const header=rect('header');
   for(const el of q('header').querySelectorAll('button,summary,.resources>span')) {
    const r=el.getBoundingClientRect();if(!r.width||!r.height||(el.tagName==='BUTTON'&&el.closest('details:not([open])')))continue;
    check(r.left>=0&&r.right<=w+1&&r.bottom<=header.bottom+1,'header control fits '+w+' '+el.textContent);
   }
   check(rect('.mission').height<=80,'compact mission report '+w);
   const map=rect('#minimap');check(map.left>=0&&map.right<=w&&map.top>=header.bottom&&map.bottom<=h,'minimap in view '+w);
   check(rect('#game').height>=h-160,'sufficient battlefield height '+w);
   if(w<=950||h<=500) {
    check(g.getComputedStyle(q('#phone-tabs')).display==='flex','compact tabs '+w);
    g.eval("cam={x:470,y:940,zoom:.72};selected=[];paused=false;updateUI(true)");
    const c=q('#game'),r=c.getBoundingClientRect(),point=g.eval("screen(alive(0).find(u=>u.type==='forge'))");
    for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'mouse',button:0,clientX:r.left+point.x,clientY:r.top+point.y,bubbles:true,cancelable:true}));
    check(q('aside').dataset.panel==='actions','mouse opens production '+w);
    check([...q('#actions').querySelectorAll('button')].some(b=>b.textContent.includes('Elephant Guard')),'recruitment exposed '+w);
    g.eval("this.testQuarry=add('quarry',0,275,650);selected=[];cam={x:275,y:650,zoom:.72};updateUI(true)");
    const p=g.eval('screen(testQuarry)');
    for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:2,pointerType:'mouse',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
    check(q('aside').dataset.panel==='status','quarry opens workforce status '+w);
    q('#phone-tabs [data-panel=orders]').click();check(rect('aside').height<=103,'command sheet closes '+w);
    g.eval("paused=false;ore=500;materials=50;selected=[alive(0).find(u=>u.type==='core')];updateUI(true)");
    q('#phone-tabs [data-panel=actions]').click();
    [...q('#actions').querySelectorAll('button')].find(b=>b.textContent.startsWith('Village Home')).click();
    check(q('aside').dataset.panel==='orders'&&f.contentWindow.eval("placing==='relay'"),'building placement exposes battlefield '+w);
    q('#phone-tabs [data-panel=status]').click();q('[data-mode=move]').click();
    check(q('aside').dataset.panel==='orders'&&f.contentWindow.eval("mode==='move'"),'targeted order exposes battlefield '+w);
   } else {
    q('#mission-toggle').click();check(q('#mission-toggle').getAttribute('aria-expanded')==='true'&&g.getComputedStyle(q('.mission strong')).display!=='none','mission expands '+w);
    q('#mission-toggle').click();check(g.getComputedStyle(q('.mission strong')).display==='none','mission collapses '+w);
    q('aside').scrollTop=q('aside').scrollHeight;
    await new Promise(r=>g.requestAnimationFrame(r));
    check(rect('#minimap').top>=rect('aside').top,'minimap stays visible after scrolling '+w);
   }
   g.eval('running=false');f.remove();
  }
  for(const difficulty of ['easy','normal']) {
   const f=document.createElement('iframe');f.width=652;f.height=678;
   let ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?retry=593';document.querySelector('#games').append(f);await ready;
   let d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#difficulty').value=difficulty;d.querySelector('#start').click();
   f.contentWindow.eval('finish(false)');ready=new Promise(r=>f.onload=r);d.querySelector('#again').click();await ready;d=f.contentDocument;
   check(!d.querySelector('#opening').open,'retry skips opening '+difficulty);
   check(d.querySelector('#difficulty').value===difficulty,'retry preserves difficulty '+difficulty);
   check(!f.contentWindow.eval('running'),'retry waits at briefing '+difficulty);
   d.querySelector('#opening-replay').click();check(d.querySelector('#opening').open,'opening remains replayable '+difficulty);f.remove();
  }
  qResult('PASS '+count+' assertions');
 }catch(e){qResult('FAIL '+e.stack);}
 function qResult(s){document.querySelector('#result').textContent=s;}
})();
