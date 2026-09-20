function fireDisciplineChecks(check) {
  function fresh() {
    easy=true;reset();running=true;paused=false;nextWave=enemySpawn=1e9;enemyBudget=0;
    units=units.filter(u=>u.type==='core');
    const scout=add('scout',0,500,1000),target=add('trooper',1,580,1000,{hp:10000,max:10000,holdFire:true});
    selected=[scout];sightAt=-1;return {scout,target};
  }
  const step=n=>{for(let i=0;i<n;i++)update(.05);};
  let {scout,target}=fresh();
  step(5);check(target.hp<10000,'Default weapons-free units acquire visible targets');
  ({scout,target}=fresh());toggleFireDiscipline();step(25);
  check(target.hp===10000&&!scout.firedAt,'Hold fire prevents automatic damage');
  check(scout.x===500&&scout.y===1000,'Hold fire prevents automatic pursuit');
  check(sees(1,scout),'Silent scout remains visible to enemies');
  check(!shoot(scout,target),'Direct shoot also enforces fire discipline');
  mode=null;command({x:target.x,y:target.y});step(1);
  check(target.hp<10000&&scout.order.forceFire,'Fresh focus order engages while holding fire');
  check(scout.holdFire,'Focus fire retains persistent stance');
  const next=add('trooper',1,570,1010,{hp:10000,max:10000,holdFire:true});target.hp=0;step(30);
  check(next.hp===10000,'Target defeat returns to silence instead of acquiring another');
  toggleFireDiscipline();step(30);check(next.hp<10000,'Weapons free releases the ambush');
  ({scout,target}=fresh());scout.holdFire=true;mode=null;command(target);target.x=2100;sightAt=-1;step(2);
  check(!scout.order?.target,'Losing vision removes focus permission');
  target.x=580;sightAt=-1;step(25);check(target.hp===10000,'Reappearing target is not silently reacquired');
  ({scout,target}=fresh());mode=null;command(target);toggleFireDiscipline();step(10);
  check(target.hp===10000&&!scout.order.forceFire,'Enabling hold fire suspends an earlier focus order');
  ({scout,target}=fresh());issueOrder(scout,{kind:'attack',x:650,y:1000});scout.orders=[{kind:'move',x:700,y:1000}];
  const route=JSON.stringify([scout.order,scout.orders]);toggleFireDiscipline();
  check(JSON.stringify([scout.order,scout.orders])===route,'Toggling preserves movement and waypoint orders');step(20);
  check(scout.x>500&&target.hp===10000,'Silent attack-move travels without engaging');
  issueOrder(scout,{kind:'patrol',x:700,y:1000,returnPoint:{x:500,y:1000}});step(5);
  check(target.hp===10000,'Patrol obeys fire discipline');
  ({scout,target}=fresh());const guard=add('trooper',0,480,1000),worker=add('worker',0,470,1000),dead=add('scout',0,460,1000,{hp:0});
  scout.holdFire=true;selected=[scout,guard,worker,target,dead];toggleFireDiscipline();
  check(scout.holdFire&&guard.holdFire&&!worker.holdFire&&!dead.holdFire,'Mixed group enables silence only for living friendly combat troops');
  toggleFireDiscipline();check(!scout.holdFire&&!guard.holdFire&&target.holdFire,'Second toggle releases friendlies but never changes enemies');
  selected=[scout];paused=true;check(!toggleFireDiscipline()&&!scout.holdFire,'Paused toggle is blocked');paused=false;
  $('help-dialog').showModal();check(!toggleFireDiscipline(),'Help modal blocks toggles');$('help-dialog').close();
  ended=true;check(!toggleFireDiscipline(),'Ended mission blocks toggles');ended=false;
  const gun=add('walker',0,500,1150,{deployed:true,holdFire:true});selected=[gun];
  check(fireDisciplineUnit(gun)&&!firePermission(gun,target),'Deployed guns can hold fire');
  gun.order={kind:'attack',target,forceFire:true};check(firePermission(gun,target),'Explicit artillery focus permits one target');
  check(!firePermission(gun,guard),'Focus exception cannot spill over to other targets');
  check(!shoot(target,scout),'Enemy units obey the same held-fire rule');
  reset();check(alive(0).filter(fireDisciplineUnit).every(u=>!u.holdFire),'Restart defaults to weapons free');
}
