(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('nuclear-authority-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?authority=54';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.nuclearAuthorityChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;this.fab=add('factory',0,500,1000);rebuildSupply();fab.atomicReady=true;this.king=alive(0).find(u=>u.type==='hero');king.x=320;king.y=780;selected=[fab];cam.x=500;cam.y=950;cam.zoom=1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(!button('Launch atomic bomb'),'factory no longer has launch button');
 g.eval('selected=[king];king.x=1000;king.y=1000;updateUI(true)');
 check(button('Launch atomic bomb').disabled&&button('Launch atomic bomb').textContent.includes('line of sight'),'leader launch locked with explanation');
 g.eval('king.x=320;king.y=780;updateUI(true)');
 check(!button('Launch atomic bomb').disabled,'personal headquarters sight unlocks');
 button('Launch atomic bomb').click();d.querySelector('#phone-tabs [data-panel=orders]').click();
 const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect(),p=g.eval('screen({x:550,y:950})');
 for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval('atomicStrikes.length===1&&!paused'),'leader-authorized touch launch');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 g.eval('draw();running=false');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
