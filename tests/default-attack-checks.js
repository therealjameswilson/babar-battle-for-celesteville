function defaultAttackChecks(check){
 reset();running=true;paused=false;nextWave=enemySpawn=9999;
 const guard=alive(0).find(u=>u.type==='trooper'),worker=alive(0).find(u=>u.type==='worker'),bike=add('bike',0,400,900);
 selected=[guard,worker,bike];mode=null;command({x:600,y:1000});
 check(guard.order.kind==='attack'&&worker.order.kind==='move'&&bike.order.kind==='move','default attack-move limited to armed troops');
 selected=[guard];mode='move';command({x:650,y:1000});check(guard.order.kind==='move','explicit Move remains passive');
 mode=null;command({x:600,y:1000},true);check(guard.orders[0].kind==='attack','queued default waypoint uses attack-move');
 const enemy=add('trooper',1,guard.x+60,guard.y);mode='move';command(enemy);
 check(guard.order.kind==='move'&&!guard.order.target,'explicit Move over enemy does not focus fire');
 mode=null;command(enemy);check(guard.order.kind==='attack'&&guard.order.target===enemy,'enemy tap retains focus fire');
 const school=alive(0).find(u=>u.type==='forge');selected=[school];mode=null;command({x:550,y:1000});ore=1000;const previous=new Set(units.map(u=>u.id));train('trooper');
 for(let i=0;i<800&&!alive(0).some(u=>u.type==='trooper'&&!previous.has(u.id));i++)update(.05);
 check(alive(0).some(u=>u.type==='trooper'&&!previous.has(u.id)&&u.order?.kind==='attack'),'new troops attack-move to default rally');
 reset();running=true;paused=false;nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');
 const attacker=add('trooper',0,400,1050),foe=add('trooper',1,470,1050);foe.order={kind:'hold'};
 selected=[attacker];command({x:650,y:1050});const hp=foe.hp;
 for(let i=0;i<60;i++)update(.05);
 check(foe.hp<hp,'default ground order actually engages encountered enemies');
 reset();
}
