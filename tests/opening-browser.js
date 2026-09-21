(async()=>{
 let count=0;const lines=[];const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try{for(const [w,h] of [[320,568],[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?opening=42';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument,q=s=>d.querySelector(s);
 check(q('#opening').open,'initial modal');check(g.eval('!running'),'battle not running');check(g.eval('audioContext===null'),'no unsolicited audio');
 check(q('#opening').scrollWidth<=w,'no horizontal overflow');
 q('#opening-play').click();check(q('#opening-title').textContent==='Rataxes marches.','ultimatum');
 check(g.eval('!running && t===0'),'simulation frozen');
 q('#opening-play').click();check(q('#opening-play').textContent==='Resume opening','pause');
 q('#opening-next').click();check(q('#opening-title').textContent==='Babar stands.','answer');
 check(q('#opening-reply').textContent.includes('families to safety'),'civilian stakes');
 q('#opening-next').click();check(q('#opening-title').textContent.includes('Two kings'),'rivalry');
 for(const b of d.querySelectorAll('.opening-controls button')){const r=b.getBoundingClientRect();check(r.height>=44,'touch size');check(r.left>=0&&r.right<=w+1,'button horizontal bounds');check(r.bottom<=h+1,'button vertical bounds '+w+' '+r.bottom);}
 q('#opening-next').click();check(!q('#opening').open,'ends at briefing');check(g.eval('!running'),'does not launch automatically');
 q('#opening-replay').click();check(q('#opening').open,'replay');
 g.eval("motionPreference='reduced';applyMotionPreference()");q('#opening-play').click();check(q('#opening').dataset.motion==='reduced','reduced motion');check(q('#opening-hint').textContent.includes('Choose Next'),'manual advance');
 const before=g.eval('muted');q('#opening-mute').click();check(g.eval('muted')!==before,'mute');q('#opening-mute').click();check(g.eval('muted')===before,'mute restored');
 q('#opening-skip').click();check(!q('#opening').open,'skip');
 q('#opening-replay').click();q('#opening').dispatchEvent(new g.Event('cancel',{cancelable:true}));check(!q('#opening').open,'escape');
 q('#start').click();check(g.eval('running'),'launch');check(!q('#opening').open,'cinematic absent during play');g.eval('paused=true');
 lines.push('PASS '+w+'×'+h);f.remove();
 }
 const timed=document.createElement('iframe');timed.width=390;timed.height=844;const loaded=new Promise(r=>timed.onload=r);timed.src='../dist/index.html?timed=42';document.querySelector('#games').append(timed);await loaded;
 timed.contentWindow.eval("motionPreference='full';applyMotionPreference();muted=true");timed.contentDocument.querySelector('#opening-play').click();
 document.querySelector('#result').textContent=lines.join('\n')+'\nChecking 24-second playback…';
 await new Promise(r=>setTimeout(r,24500));
 check(!timed.contentDocument.querySelector('#opening').open,'timed ending');check(timed.contentWindow.eval('!running'),'timed ending waits for player');timed.remove();
 document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
 }catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
