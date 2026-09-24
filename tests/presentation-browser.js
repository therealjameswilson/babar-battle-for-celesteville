(async()=>{
 const out=document.querySelector('#result');let count=0;
 const check=(v,s)=>{if(!v)throw Error(s);count++;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 try{for(const [w,h] of [[1280,800],[390,844],[844,390]]){
  const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/?presentation=1';document.querySelector('#games').append(f);await ready;
  let g=f.contentWindow,d=g.document;const run=s=>g.eval(s);
  d.querySelector('#opening-skip').click();
  check(d.querySelector('.brief-art img').complete&&d.querySelector('.brief-art img').naturalWidth>0,'hero art loaded');
  check(d.documentElement.scrollWidth<=w,'briefing fits viewport');
  d.querySelector('#opening-replay').focus();d.activeElement.dispatchEvent(new g.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));
  check(d.activeElement.id==='difficulty'||d.activeElement.tagName==='SUMMARY','briefing keyboard focus wraps');
  const motion=d.querySelector('#motion-preference');motion.value='reduced';motion.dispatchEvent(new g.Event('change'));
  check(g.getComputedStyle(d.querySelector('.briefing-screen')).animationName==='none','manual reduced motion disables transitions');
  motion.value='system';motion.dispatchEvent(new g.Event('change'));
  if(h<500){check(!d.querySelector('#brief-orders').open,'landscape details collapsed');check(d.querySelector('#start').getBoundingClientRect().bottom<=h,'landscape start visible');}
  d.querySelector('#difficulty').value='normal';d.querySelector('#difficulty').dispatchEvent(new g.Event('change'));
  check(d.querySelector('#difficulty-note').textContent.includes('Faster assaults'),'difficulty description');
  d.querySelector('#difficulty').value='easy';d.querySelector('#start').click();
  run('nextWave=enemySpawn=9999;ore=3000;materials=1000;selectProduction([alive(0).find(u=>u.type==="forge")])');
  function filter(category){d.querySelector('#action-filters [data-category="'+category+'"]').click();}
  filter('recruit');
  check([...d.querySelectorAll('#actions button')].filter(b=>!b.hidden).every(b=>b.dataset.category==='recruit'),'recruit filter only recruits');
  const guard=[...d.querySelectorAll('#actions button')].find(b=>b.textContent.startsWith('Elephant Guard'));
  const before=run('selected[0].queue.length');guard.click();check(run('selected[0].queue.length')===before+1,'filtered guard recruitment');
  check(run('actionCategory==="recruit"'),'filter survives queue update');
  filter('queue');check([...d.querySelectorAll('#actions button')].some(b=>!b.hidden&&b.textContent.startsWith('Cancel')),'queue filter');
  filter('research');check([...d.querySelectorAll('#actions button')].filter(b=>!b.hidden).every(b=>b.dataset.category==='research'),'research filter');
  run('selectProduction([alive(0).find(u=>u.type==="core")])');check(run('actionCategory==="all"'),'selection resets categories');
  filter('build');check([...d.querySelectorAll('#actions button')].some(b=>!b.hidden&&b.textContent.startsWith('Village Home')),'build category available');
  d.querySelector('#pause').click();check(run('paused')&&!d.querySelector('#pause-panel').hidden,'pause card shown');
  d.querySelector('#pause-council').focus();d.activeElement.dispatchEvent(new g.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));
  check(d.activeElement.id==='pause-resume','pause keyboard focus wraps');
  const rect=d.querySelector('#pause-panel').getBoundingClientRect();check(rect.top>=0&&rect.bottom<=h,'pause card fits viewport');
  d.querySelector('#pause-settings').click();await wait(30);check(d.querySelector('#help-dialog').open,'settings open');
  d.querySelector('#help-close').click();await wait(30);check(run('paused'),'settings preserve pause');
  d.querySelector('#pause-resume').click();check(!run('paused')&&d.querySelector('#pause-panel').hidden,'resume returns to battle');
  run('t=183;kills=12;wave=4;finish(true)');check(d.querySelector('.debrief.won')&&d.querySelector('#debrief-title').textContent==='Celesteville holds.','victory report');
  check(d.querySelector('.debrief-stats').textContent.includes('03:03'),'report mission time');
  const reloaded=new Promise(r=>f.onload=r);d.querySelector('#again').click();await reloaded;g=f.contentWindow;d=g.document;
  check(d.querySelector('#difficulty').value==='easy','retry preserves difficulty');
  check(!d.querySelector('#opening').open,'retry bypasses prologue');
  d.querySelector('#start').click();run('finish(false)');check(d.querySelector('.debrief.lost'),'loss report');
  check(d.documentElement.scrollWidth<=w,'report fits viewport');
  if(w!==390)f.remove();
 }
 out.textContent='PASS '+count+' presentation browser assertions across desktop and phone layouts.';
 }catch(e){out.textContent='FAIL '+e.stack;}
})();
