(async()=>{let count=0;const lines=[];const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
 const source=await fetch('atomic-checks.js').then(r=>r.text());
 for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?atomic=47';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.atomicChecks(check);
 g.eval("reset();running=true;paused=false;ore=3000;materials=1500;technologies.add('atomic');this.fab=add('factory',0,380,900);rebuildSupply();selected=[fab];cam.x=380;cam.y=900;cam.zoom=1;updateUI(true)");d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 button('Assemble atomic bomb').click();check(g.eval('!!fab.atomicJob'),'assembly button');g.eval('updateAtomic(75)');check(!!button('Launch atomic bomb'),'launch button');button('Launch atomic bomb').click();check(g.eval("mode==='atomic'"),'aim mode');
 d.querySelector('#phone-tabs [data-panel=orders]').click();const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect(),p=g.eval('screen({x:460,y:900})');
 for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval('atomicStrikes.length===1'),'touch launch');check(d.querySelector('#depot-status').textContent.includes('ATOMIC 18s'),'warning HUD');g.eval('draw()');
 check(d.documentElement.scrollWidth<=w,'no overflow');lines.push('PASS '+w+'×'+h);f.remove();
 }document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
