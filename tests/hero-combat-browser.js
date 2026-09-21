(async()=>{
 let count=0;const lines=[];const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try{const source=await fetch('hero-combat-checks.js').then(r=>r.text());
 for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?heroes=43';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();g.eval(source);g.heroCombatChecks(check);
 g.eval("reset();running=true;paused=false;this.fighter=alive(0).find(u=>u.type==='hero');selected=[fighter];this.foe=add('trooper',1,fighter.x+50,fighter.y,{hp:300,max:300});sightAt=-1;updateUI(true)");
 d.querySelector('#phone-tabs [data-panel=actions]').click();
 const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span').textContent===name);
 check(!!button('Fight')&&!!button('Royal strike'),'touch fight controls');
 button('Fight').click();check(g.eval("mode==='attack'"),'Fight prepares attack');button('Royal strike').click();
 check(g.eval('foe.hp===240'),'touch strike damage');check(button('Royal strike').disabled,'cooldown button disabled');
 g.eval('fighter.strikeReadyAt=0;fighter.commandEnergy=60;updateUI(true)');g.dispatchEvent(new g.KeyboardEvent('keydown',{key:'f',bubbles:true}));check(g.eval('foe.hp===180'),'F strike');
 g.eval('ore=500;usedPowers["madame-attack"]=-1000;openCourt()');
 const attack=[...d.querySelectorAll('#court-roster button')].find(b=>b.textContent==='Iron Parasol · 90 supplies');
 check(!!attack&&!attack.disabled,'Madame council attack available');attack.click();check(g.eval('foe.hp===20'),'council attack hits while council paused');
 check([...d.querySelectorAll('#court-roster button')].some(b=>b.disabled&&b.textContent==='Iron Parasol · 45s'),'council cooldown visible');
 d.querySelector('#court-close').click();
 check(d.documentElement.scrollWidth<=w,'no overflow');
 for(const name of ['Fight','Royal strike']){const r=button(name).getBoundingClientRect();check(r.width>0&&r.left>=0&&r.right<=w+1,'action fits');}
 g.eval('paused=true;draw()');lines.push('PASS '+w+'×'+h);f.remove();
 }document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
 }catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
