(async()=>{let count=0;const lines=[],check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const source=await fetch('damage-limitation-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?doctrine=52';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(source);g.damageLimitationChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=1e9;ore=1000;materials=200;selected=[alive(0).find(u=>u.type==='worker')];updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(button('Civil Defense').disabled&&button('Civil Defense').textContent.includes('Damage Limitation'),'locked shelter explains skill');
 g.eval("selected=[alive(0).find(u=>u.type==='forge')];updateUI(true)");
 button('Austin Long: Damage Limitation').click();check(g.eval("selected[0].research?.id==='damageLimitation'&&ore===850&&materials===150"),'skill button starts paid research');
 g.eval("selected[0].research.progress=40;update(.1);selected=[alive(0).find(u=>u.type==='worker')];updateUI(true)");
 check(!button('Civil Defense').disabled,'completed skill unlocks build button');
 button('Civil Defense').click();check(g.eval("placing==='shelter'&&!paused"),'unlocked build enters placement');
 check(d.documentElement.scrollWidth<=w,'layout does not overflow');
 lines.push('PASS '+w+'×'+h);if(w!==390)f.remove();
}
document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
