function rapidChecks(check){
 function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;}
 fresh();const school=alive(0).find(u=>u.type==='forge');ore=1000;materials=300;
 check(!purchaseResearch(school,'rapid')&&ore===1000,'Rapid doctrine requires coordinated volleys and cannot spend while locked');
 technologies.add('drill');check(purchaseResearch(school,'rapid')&&ore===820&&materials===240,'Rapid doctrine pays 180 Supplies and 60 Materials');
 school.research.progress=34.99;update(.05);check(technologies.has('rapid'),'Doctrine unlocks through normal research completion');
 const guard=add('trooper',0,800,1050),enemy=add('walker',1,910,1050);sightAt=-1;
 const before=guard.hp;issueOrder(guard,{kind:'hold'});const order=guard.order;
 check(activateRapid(guard)&&guard.hp===before-20&&guard.order===order,'Burst spends health without replacing tactical orders');
 check(!activateRapid(guard)&&guard.hp===before-20,'Repeated activation cannot stack or spend twice during cooldown');
 shoot(guard,enemy);check(Math.abs(guard.cool-defs.trooper.rate*.7)<.001,'Burst shortens infantry firing interval by thirty percent');
 const fast=add('trooper',0,600,1050),normal=add('trooper',0,600,1100);
 activateRapid(fast);fast.advanceUntil=t+10;move(fast,{x:750,y:1050},.5);move(normal,{x:750,y:1100},.5);
 check(Math.abs((fast.x-600)/(normal.x-600)-1.3)<.001,'Movement gains thirty percent without multiplying commander speed bonuses');
 const exhausted=add('scout',0,650,1100,{hp:20}),shaken=add('sapper',0,690,1100,{morale:34});
 check(!activateRapid(exhausted)&&!activateRapid(shaken),'Critically wounded and suppressed infantry cannot activate');
 check(!activateRapid(alive(0).find(u=>u.type==='hero'))&&!activateRapid(enemy),'Commanders and artillery do not inherit infantry burst');
 t+=6;check(!rapidActive(guard)&&!rapidReady(guard),'Six-second burst expires while twenty-four-second cooldown remains');
 t+=18;check(rapidReady(guard),'Cooldown eventually permits another deliberate activation');
 paused=true;check(!activateRapid(guard),'Pause blocks burst activation');paused=false;
 fresh();const rhino=add('trooper',1,800,1050),hidden=add('trooper',0,400,1050);enemyTechnologies.add('rapid');
 enemyRapidAdvance();check(!rapidActive(rhino),'Enemy cannot trigger burst from an unseen player unit');
 hidden.x=900;sightAt=-1;t+=1;enemyRapidAdvance();
 check(rapidActive(rhino)&&rhino.hp===rhino.max-20,'Enemy activates against a visible close threat and pays the same health cost');
 check(!rapidActive(hidden),'Enemy research never grants the player ability');
 const injured=add('trooper',1,820,1050,{hp:60});enemyRapidAdvance();
 check(!rapidActive(injured),'Enemy preserves badly wounded infantry rather than spending their health');
 fresh();const left=add('trooper',0,600,1050),right=add('trooper',0,640,1050);technologies.add('rapid');selected=[left];rapidAdvance();
 check(rapidActive(left)&&!rapidActive(right),'Player burst affects only the selected eligible infantry');
 reset();check(!technologies.has('rapid')&&!enemyTechnologies.has('rapid'),'Restart clears doctrine for both armies');
}
