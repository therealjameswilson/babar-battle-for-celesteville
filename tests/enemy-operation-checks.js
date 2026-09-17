function enemyOperationChecks(check){
 function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;intel[1]=[];units=units.filter(u=>u.type==='core');rebuildNav();}
 function report(type,id,x=600,y=1000,seen=t){return {type,id,x,y,seen};}
 function army(){return ['hero','walker','scout','sapper','trooper','trooper','trooper','trooper','trooper','trooper'].map((type,i)=>add(type,1,1100+i*28,700));}
 fresh();const hidden=add('quarry',0,600,1000);check(enemyRaidTarget()===null,'Unscouted economic structures cannot attract raids');
 intel[1]=[report('quarry',hidden.id)];const original=JSON.stringify(enemyRaidTarget());
 hidden.hp=0;hidden.x=180;hidden.y=200;
 check(JSON.stringify(enemyRaidTarget())===original,'Hidden death and movement do not alter remembered raid coordinates');
 intel[1].push(report('turret',900));check(enemyRaidTarget()===null,'A remembered tower deters an unsupported raid');
 t+=90;check(enemyRaidTarget()===null,'Static defense memory remains dangerous beyond the mobile report timeout');
 intel[1]=[report('worker',800,600,1000,t-31)];check(enemyRaidTarget()===null,'Raids reject worker positions older than thirty seconds');
 intel[1]=[report('relay',800),report('quarry',801,650,500)];check(enemyRaidTarget().id===801,'Exposed Materials infrastructure takes priority over a home');
 intel[1].push(report('trooper',900,650,500),report('trooper',901,650,500));check(enemyRaidTarget().id===800,'Observed defenses redirect the raid to the less defended economy');
 intel[1]=[report('quarry',801),report('trooper',900,600,1000,t-61)];check(enemyRaidTarget().id===801,'Expired mobile threats do not permanently blacklist an economic site');
 fresh();let troops=army();intel[1]=[report('quarry',801)];let plan=dispatchEnemyAssault(3);
 check(plan.raiders.length===4&&plan.main.length===6,'Commander detaches four raiders and retains the main force');
 check(plan.raiders[0].type==='scout'&&plan.raiders[1].type==='sapper','Fast scouts and anti-structure sappers lead the raid');
 check(plan.main.some(u=>u.type==='hero')&&plan.main.some(u=>u.type==='walker'),'Commander and artillery stay with the main column');
 check(plan.raiders.every(u=>u.order.y===1050&&u.orders[0].x===600&&u.orders[0].y===1000&&!u.orders[0].target),'Southern approach uses a queued snapshot attack location, never a hidden target reference');
 check(plan.main.every(u=>u.order.x===320&&u.order.y===900),'The main column retains its separate palace approach');
 intel[1]=[report('quarry',801,650,500)];plan=dispatchEnemyAssault(6);
 check(plan.raiders.every(u=>u.order.y===430&&u.orders.length===1&&u.orders[0].y===500),'Northern site changes approach and replaces obsolete queues');
 easy=true;plan=dispatchEnemyAssault(6);check(plan.raiders.length===3,'Story limits the detached force to three');
 plan=dispatchEnemyAssault(4);check(!plan.raiders.length&&plan.main.length===10,'Ordinary assaults concentrate the army instead of always raiding');
 const retreating=troops[2];orderRetreat(retreating);const withdrawal=retreating.order;
 troops[3].hp=troops[3].max*.3;const woundedOrder=troops[3].order;
 plan=dispatchEnemyAssault(6);check(retreating.order===withdrawal&&troops[3].order===woundedOrder&&!plan.main.includes(retreating)&&!plan.raiders.includes(troops[3]),'New assaults preserve retreating and badly wounded troops');
 fresh();troops=army().slice(0,5);units=units.filter(u=>u.type==='core'||troops.includes(u));intel[1]=[report('quarry',801)];plan=dispatchEnemyAssault(3);
 check(!plan.raiders.length&&plan.main.length===5,'A small army does not split into an unsupported raid');
 fresh();troops=army();intel[1]=[report('quarry',801),report('turret',900)];plan=dispatchEnemyAssault(3);
 check(!plan.raiders.length&&plan.main.length===10,'No vulnerable scouted site means a concentrated assault');
}
