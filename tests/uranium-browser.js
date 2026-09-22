(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('uranium-checks.js').then(r=>r.text());
for(const [w,h] of [[320,568],[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?uranium=50';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.uraniumChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;this.fab=add('factory',0,380,900);rebuildSupply();selected=[fab];ore=3000;materials=1500;uranium=39;technologies.add('atomic');technologies.add('hydrogen');cam.x=440;cam.y=1040;cam.zoom=1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(button('Assemble atomic bomb').disabled,'short Uranium disables assembly');
 g.eval('uranium=40;updateUI(true)');check(!button('Assemble atomic bomb').disabled,'affordable assembly enables');
 button('Assemble atomic bomb').click();check(g.eval('uranium===0&&!!fab.atomicJob'),'button spends Uranium');
 g.eval("selected=alive(0).filter(u=>u.type==='worker').slice(0,1);updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=orders]').click();
 const canvas=d.querySelector('#game'),r=canvas.getBoundingClientRect(),p=g.eval('screen(nodes.find(n=>n.kind==="uranium"))');
 for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval('selected[0].order?.node?.kind==="uranium"&&!paused'),'touch gather without pause');
 g.eval('draw();updateUI(true)');check(d.querySelector('#uranium').textContent==='0','HUD updates');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 const counters=[...d.querySelectorAll('.resources>span')].map(e=>e.getBoundingClientRect());
 check(counters.every((r,i)=>r.left>=0&&r.right<=w&&(!i||r.left>=counters[i-1].right)),'resource counters fit');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
