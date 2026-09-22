(async()=>{let n=0;const check=(v,s)=>{if(!v)throw Error(s);n++;};try{
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?photo=561';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 check(d.querySelector('#nuclear-briefing').hidden,'hidden at start');
 g.eval("technologies.add('shells');technologies.add('armor2');this.photoFactory=add('factory',0,400,1100);selected=[photoFactory];updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const card=d.querySelector('#nuclear-briefing'),img=card.querySelector('img');await img.decode();
 check(!card.hidden&&img.naturalWidth>0,'photo visible for nuclear prerequisite');
 check(card.textContent.includes('Babar'),'Babar context');
 check(!g.eval('paused'),'does not pause');
 g.eval("reset();running=true;this.rhinoFactory=add('factory',1,1900,300);rhinoFactory.research={id:'atomic',progress:0};selected=[];updateUI(true)");
 check(card.hidden,'hidden enemy project stays hidden');
 g.eval("rhinoFactory.x=alive(0)[0].x;rhinoFactory.y=alive(0)[0].y;t+=.1;updateUI(true)");
 check(!card.hidden&&card.textContent.includes('Rataxes'),'observed Rataxes context');
 check(d.documentElement.scrollWidth<=w,'no horizontal overflow');
 g.eval('running=false;draw()');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+n+' browser assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
