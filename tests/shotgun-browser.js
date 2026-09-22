(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
const rules=await fetch('shotgun-checks.js').then(r=>r.text());
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?shotgun=570';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();g.eval(rules);g.shotgunChecks(check);
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;this.school=alive(0).find(u=>u.type==='forge');school.queue=[];selected=[school];ore=500;materials=100;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 [...d.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Elephant shotgun kit')).click();
 check(g.eval("school.research?.id==='shotguns'&&ore===340&&materials===60"),'research button charges correct costs');
 g.eval("for(let i=0;i<650;i++)update(.05);this.guard=alive(0).find(u=>u.type==='trooper');selected=[guard];updateUI(true);cam={x:guard.x,y:guard.y,zoom:1.4};this.target=add('trooper',1,guard.x+65,guard.y);shoot(guard,target);draw();running=false");
 check(g.eval('shotgunEquipped(guard)'),'timed research equips existing guards');
 check(d.querySelector('#selected-info').textContent.includes('Shotgun guard'),'unit description shows weapon');
 check(d.documentElement.scrollWidth<=w,'mobile bounds');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
