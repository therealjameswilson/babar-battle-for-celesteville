function motorbikeChecks(check){
 function fresh(){
  reset();running=true;paused=false;nextWave=enemySpawn=1e9;units=[];
  add('core',0,400,900);add('core',1,1500,300);
  const factory=add('factory',0,500,900);linked.add(factory.id);
  ore=3000;materials=1000;uranium=200;selected=[factory];return factory;
 }
 let f=fresh();train('bike');check(f.queue[0]==='bike'&&ore===2820&&materials===940,'motorbike paid recruitment');
 train('bike');check(f.queue.length===1,'one Arthur including queued recruitment');
 f.progress=20;update(.1);let bike=alive(0).find(u=>u.type==='bike');
 check(!!bike&&!unitUnlocked('bike'),'motorbike completes and unique cap persists');
 technologies.add('atomic');check(!neutronReady(bike),'research alone is not acquired weapon');
 f.queue=[];check(assembleAtomic(f),'assemble first nuclear weapon');updateAtomic(75);
 check(nuclearAcquired[0]&&neutronReady(bike),'completed payload unlocks neutron ability');
 const funds=[ore,materials,uranium];check(!launchNeutron(bike,{x:0,y:0})&&ore===funds[0],'invalid or out of range spends nothing');
 bike.x=600;bike.y=900;const victim=add('trooper',1,800,900,{hp:1000,max:1000}),building=add('forge',1,800,900,{hp:1000,max:1000}),ally=add('trooper',0,800,900,{hp:1000,max:1000});
 const shelter=add('shelter',0,800,950),worker=add('worker',0,800,900);
 check(aimNeutron(bike)&&mode==='neutron','ability enters targeting mode');
 check(launchNeutron(bike,{x:800,y:900}),'visible in-range launch');
 check(ore===funds[0]-400&&materials===funds[1]-120&&uranium===funds[2]-30,'launch cost once');
 check(!launchNeutron(bike,{x:800,y:900}),'active strike and cooldown reject repeats');
 check(!launchAtomic(f,{x:800,y:900})&&f.atomicReady,'normal payload cannot overlap neutron launch');
 updateAtomic(0);check(victim.hp===1000&&worker.civilDefense?.shelter===shelter,'warning delay and evacuation');
 t=12.2;updateAtomic(0);
 check(victim.hp===550&&building.hp===920&&ally.hp===550,'unit-focused damage and friendly fire');
 check(worker.hp>0,'Civil Defense protects worker');
 check(!atomicStrikes.length&&!neutronReady(bike),'impact cleanup and cooldown');
 t=121;check(neutronReady(bike),'cooldown expires');
 check(launchNeutron(bike,{x:800,y:900}),'second strike allowed after cooldown');bike.hp=0;updateAtomic(0);
 check(!atomicStrikes.length,'losing Arthur aborts strike');
 check(unitUnlocked('bike'),'Arthur can be recruited again after loss');
 fresh();check(!nuclearAcquired[0]&&!nuclearAcquired[1],'restart resets acquired status');
}
