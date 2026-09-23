(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const rules=await fetch('old-lady-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?lady=590';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(rules);g.oldLadyChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;ore=500;materials=100;selected=[alive(0).find(u=>u.type==='core')];updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const recruit=[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent==='The Old Lady');check(!!recruit&&!recruit.disabled,'recruit button available');recruit.click();
 check(g.eval("alive(0).some(u=>u.queue.includes('madame'))"),'button queues Old Lady');
 g.eval("for(let i=0;i<550;i++)update(.05);this.lady=alive(0).find(u=>u.type==='madame');selected=[lady];updateUI(true);lady.x=500;lady.y=1000;cam={x:530,y:1000,zoom:1.2};this.foe=add('trooper',1,570,1000);shoot(lady,foe);draw();running=false");
 check(d.querySelector('#selected-info').textContent.includes('flamethrower'),'unit weapon description');
 check(g.eval("fx.some(f=>f.flame)&&oldLadySheet.complete&&oldLadySheet.naturalWidth>0"),'sprite loaded and flame rendered');
 check(d.documentElement.scrollWidth<=w,'phone layout fits');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
