'use strict';
(async()=>{
  const result=document.querySelector('#result'),keys=['babar-checkpoint-v1','babar-checkpoint-backup-v1'];
  const previous=keys.map(key=>localStorage.getItem(key));
  const frame=document.createElement('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
  [frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
  document.body.append(frame);let count=0,errors=[];
  const assert=(value,label)=>{if(!value)throw Error(label);count++;};
  const load=()=>new Promise(resolve=>{frame.onload=()=>{frame.contentWindow.addEventListener('error',e=>errors.push(e.message));resolve(frame.contentWindow);};frame.src='../dist/?checkpoint-qa='+Date.now();});
  try{
    keys.forEach(key=>localStorage.removeItem(key));
    let g=await load(),d=g.document;
    d.querySelector('#opening-skip').click();d.querySelector('#start').click();
    g.eval(`paused=true;t=42;const w=alive(0).find(u=>u.type==='worker');w.order={kind:'gather',node:nodes[0]};selected=[w];const b=alive(0).find(u=>u.type==='core');b.queue=['worker'];b.progress=2;updatePresentation();`);
    d.querySelector('#pause-save').click();
    assert(d.querySelector('#checkpoint-status').textContent.includes('Saved at'),'manual save');
    const saved=localStorage.getItem(keys[0]);assert(!!saved,'real localStorage written');
    g=await load();d=g.document;
    assert(!d.querySelector('#continue-battle').hidden,'Continue visible after reload');
    assert(!d.querySelector('#opening').open,'opening skipped with checkpoint');
    g.eval('controller.focus=null;controllerFocus()');
    assert(g.eval('controller.focus.id==="continue-battle"'),'controller prioritizes Continue');
    g.eval('controllerConfirm()');
    assert(g.eval('running&&paused&&!ended&&t===42'),'reload resumes exact clock paused');
    assert(g.eval('selected[0].order.node===nodes[0]'),'resource identity survives reload');
    assert(g.eval("alive(0).find(u=>u.type==='core').progress===2"),'production progress restored');
    assert(!d.querySelector('#pause-panel').hidden,'pause card shown');
    const panel=d.querySelector('#pause-panel').getBoundingClientRect();
    assert(panel.width<=Number(frame.width)&&panel.height<=Number(frame.height),'pause fits viewport');
    d.querySelector('#pause-resume').click();assert(g.eval('!paused'),'resume works');
    g.eval('paused=true;t=44;updatePresentation()');d.querySelector('#pause-save').click();
    assert(!!localStorage.getItem(keys[1]),'backup saved');
    // Avoid lifecycle overwriting our corruption fixture when the iframe navigates.
    g.eval('running=false');localStorage.setItem(keys[0],'{broken');
    g=await load();d=g.document;
    assert(d.querySelector('#checkpoint-brief').textContent.includes('Backup'),'backup identified');
    d.querySelector('#continue-battle').click();assert(g.eval('t===42&&paused'),'backup restored');
    const oldWrite=g.Storage.prototype.setItem;g.Storage.prototype.setItem=function(){throw Error('quota')};
    assert(g.eval('saveBattle()')===false,'storage failure reported');
    assert(d.querySelector('#checkpoint-status').textContent.includes('Save failed'),'storage error visible');
    g.Storage.prototype.setItem=oldWrite;
    g.eval('paused=false;t=75;checkpointFailed=false');
    await new Promise(resolve=>setTimeout(resolve,2200));
    assert(g.eval('readCheckpoint(localStorage.getItem(CHECKPOINT_KEY)).state.t>=75'),'periodic autosave');
    g.eval('paused=true;t=81');g.dispatchEvent(new g.Event('pagehide'));
    assert(g.eval('readCheckpoint(localStorage.getItem(CHECKPOINT_KEY)).state.t===81'),'pagehide saves');
    g.eval('ended=true;t=99');assert(g.eval('saveBattle(true)')===false,'finished battle preserves checkpoint');
    assert(g.eval('readCheckpoint(localStorage.getItem(CHECKPOINT_KEY)).state.t===81'),'result cannot replace checkpoint');
    g.eval('renderDebrief(false)');assert(!!d.querySelector('#checkpoint-retry'),'result offers checkpoint retry');
    d.querySelector('#checkpoint-retry').click();assert(g.eval('running&&paused&&!ended&&t===81'),'result retry restores battle');
    assert(errors.length===0,'no game errors: '+errors.join(';'));
    result.textContent=`PASS ${count} real-browser checkpoint checks (${size}). Reload, identity, progress, pause, backup and quota failure.`;
  }catch(error){result.textContent='FAIL '+error.stack;}
  finally{
    // Stop lifecycle writes before restoring the local test origin's prior saves.
    try{frame.contentWindow.eval('running=false')}catch{}
    keys.forEach((key,i)=>previous[i]===null?localStorage.removeItem(key):localStorage.setItem(key,previous[i]));
  }
})();
