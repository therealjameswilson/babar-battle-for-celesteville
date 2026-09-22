function civilDefenseChecks(check){
 for(const team of [0,1]){
  reset();running=true;paused=false;units=[];nextWave=enemySpawn=1e9;
  const home=add('core',team,400,900),b=add('shelter',team,600,900),launcher=add('factory',1-team,1100,900);linked.add(launcher.id);
  const n={x:700,y:1000,amount:100},order={kind:'gather',node:n};
  const w=add('worker',team,740,1000,{order,carrying:4,cargoKind:'uranium',orders:[{kind:'move',x:700,y:800}]});
  atomicStrikes=[{site:launcher,team:1-team,kind:'hydrogen',x:600,y:900,at:28}];updateCivilDefense();
  check(w.civilDefense?.shelter===b,'both factions automatically evacuate');
  for(let i=0;i<150;i++)civilianEvacuation(w,.1);
  check(civilDefenseProtected(w),'worker reaches protective perimeter');
  check(w.order===order&&w.carrying===4&&w.orders.length===1,'work queue and cargo retained');
  const exposed=add('worker',team,600,900),outside=add('worker',team,790,900);t=28;atomicAIAt=9999;updateAtomic(0);
  check(outside.hp<=0,'workers outside protection remain vulnerable');
  check(w.hp>0&&w.hp<85,'sheltered worker survives H-bomb with damage');
  check(exposed.hp>0,'new workers also evacuate on detected warning when already at shelter');
  t=32;updateCivilDefense();check(!w.civilDefense&&w.order===order,'returns to work after all-clear');
  atomicStrikes=[{site:launcher,team:1-team,kind:'atomic',x:600,y:900,at:50}];
  b.hp=0;updateCivilDefense();check(!w.civilDefense,'destroyed shelter not used');
  b.hp=100;b.construction=10;updateCivilDefense();check(!w.civilDefense,'unfinished shelter not used');
  b.construction=0;updateCivilDefense();launcher.hp=0;t=40;updateCivilDefense();check(!w.civilDefense,'aborted strike releases workers');
 }
 reset();running=true;paused=false;ore=1000;materials=200;selected=[alive(0).find(u=>u.type==='worker')];
 build('shelter');command({x:490,y:1080});
 check(alive(0).some(b=>b.type==='shelter'&&b.construction)&&ore===820&&materials===120,'shelter construction costs');
 reset();check(!units.some(w=>w.civilDefense),'reset clears evacuation');
}
