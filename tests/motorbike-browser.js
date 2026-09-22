(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('motorbike-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?bike=53';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.motorbikeChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;this.fab=add('factory',0,450,1030);rebuildSupply();selected=[fab];ore=3000;materials=1000;uranium=200;cam.x=550;cam.y=950;cam.zoom=1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 button('Arthur’s Motorbike').click();check(g.eval("fab.queue[0]==='bike'"),'recruit button');
 g.eval("fab.progress=20;update(.1);this.bike=alive(0).find(u=>u.type==='bike');selected=[bike];updateUI(true)");
 check(button('Neutron payload').disabled,'strike locked before nuclear acquisition');
 g.eval("technologies.add('atomic');assembleAtomic(fab);updateAtomic(75);selected=[alive(0).find(u=>u.type==='hero')];cam.x=bike.x;cam.y=bike.y;updateUI(true)");
 check(!button('Authorize neutron strike').disabled,'completed payload enables button');
 button('Authorize neutron strike').click();d.querySelector('#phone-tabs [data-panel=orders]').click();
 const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect(),p=g.eval('screen({x:bike.x+80,y:bike.y})');
 for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval("atomicStrikes.some(s=>s.kind==='neutron')&&!paused"),'touch launch without pause');
 check(d.querySelector('#depot-status').textContent.includes('NEUTRON'),'neutron warning label');
 g.eval('draw();running=false');check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
