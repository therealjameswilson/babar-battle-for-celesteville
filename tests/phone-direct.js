(async()=>{const lines=[];let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};
try{for(const [w,h] of [[320,568],[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?phone=463';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 g.eval("reset();running=true;paused=false;cam.x=320;cam.y=900;cam.zoom=1;this.hero=alive(0).find(u=>u.type==='hero');selected=[hero];updateUI(true)");
 g.dispatchEvent(new g.Event('blur'));check(g.eval('!paused'),'visible window blur must not pause');
 const canvas=d.querySelector('#game');const rect=canvas.getBoundingClientRect();let pid=10;
 const tap=p=>{const id=pid++;for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new g.PointerEvent(type,{pointerType:'touch',pointerId:id,button:0,bubbles:true,cancelable:true,clientX:rect.left+p.x,clientY:rect.top+p.y}));};
 tap({x:rect.width*.1,y:rect.height*.65});check(g.eval("hero.order?.kind==='move'"),'tap ground moves selected hero');check(g.eval('!paused&&selected.includes(hero)'),'touch preserves selection and play');
 g.eval("this.enemy=add('trooper',1,hero.x-65,hero.y,{hp:300});sightAt=-1;");tap(g.eval('screen(enemy)'));check(g.eval('hero.order?.target===enemy'),'tap enemy focuses fire');
 g.eval("this.school=alive(0).find(u=>u.type==='forge');rebuildSupply();ore=500;selected=[school];updateUI(true)");tap(g.eval('screen(school)'));check(d.querySelector('aside').dataset.panel==='actions','tap building opens production actions');d.querySelector('#phone-tabs [data-panel=orders]').click();tap({x:rect.width*.1,y:rect.height*.65});check(g.eval('!!school.rally'),'tap ground sets production rally');
 d.querySelector('#phone-production').click();check(!d.querySelector('#production-panel').hidden,'production opens without pausing');
 const site=[...d.querySelectorAll('#production-rows button')].find(b=>b.textContent.includes('Guard School'));site.click();check(d.querySelector('aside').dataset.panel==='actions','production opens recruit controls');
 const guard=[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent==='Elephant Guard');guard.click();check(g.eval("school.queue.includes('trooper')"),'recruit by tap');check(g.eval('!paused'),'production never pauses');
 d.querySelector('#phone-tabs [data-panel=orders]').click();check(d.documentElement.scrollWidth<=w,'no page overflow');
 if(w<581||h<=500){check(canvas.getBoundingClientRect().height>=h-170,'expanded battlefield height');check(d.querySelector('aside').getBoundingClientRect().height<=104,'compact dock');}
 Object.defineProperty(d,'hidden',{configurable:true,value:true});d.dispatchEvent(new g.Event('visibilitychange'));check(g.eval('paused'),'actual hidden page pauses');Object.defineProperty(d,'hidden',{configurable:true,value:false});d.dispatchEvent(new g.Event('visibilitychange'));check(g.eval('paused'),'return awaits deliberate resume');
 lines.push('PASS '+w+'×'+h);f.remove();
}document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';}catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}})();
