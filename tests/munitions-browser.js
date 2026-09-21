(async()=>{
 let count=0;const lines=[];const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try{const source=await fetch('munitions-checks.js').then(r=>r.text());
 for(const [w,h] of [[320,568],[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?munitions=44';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();g.eval(source);g.munitionsChecks(check);
 g.eval("reset();running=true;paused=false;selected=[alive(0).find(u=>u.type==='hero')];updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(d.querySelector('#munitions').textContent==='24/100','HUD reserve');button('Heavy rounds').click();check(g.eval('munitions===16'),'rounds button');check(button('Heavy rounds').disabled,'active rounds disabled');
 button('Smoke cover').click();check(g.eval('munitions===10'),'smoke button');check(d.querySelector('#tactical-status').textContent.includes('Protected'),'effect status');
 g.eval("ore=500;materials=100;selected=[add('forge',0,380,900)];rebuildSupply();updateUI(true)");button('Pack Munitions').click();check(g.eval('munitions===30'),'pack button');check(button('Pack Munitions').disabled,'pack cooldown');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');const rect=d.querySelector('#munitions-stock').getBoundingClientRect();check(rect.left>=0&&rect.right<=w,'resource fits');
 g.eval('paused=true;draw()');lines.push('PASS '+w+'×'+h);f.remove();
 }document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
 }catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
