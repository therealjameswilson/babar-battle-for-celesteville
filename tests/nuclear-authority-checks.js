function nuclearAuthorityChecks(check){
 for(const team of [0,1]){
  reset();running=true;paused=false;units=[];nextWave=enemySpawn=1e9;
  const core=add('core',team,400,900),leader=add('hero',team,400,780),site=add('factory',team,550,1000);
  linked.add(site.id);site.atomicReady=true;site.atomicKind='atomic';
  check(nuclearAuthority(team).leader===leader&&nuclearAuthority(team).hq===core,'faction leader authorizes own headquarters');
  leader.x=100;check(!!nuclearAuthority(team).reason,'leader outside personal sight blocks launch');
  add('scout',team,400,850);revealUntil=9999;
  check(!launchAtomic(site,{x:600,y:1000})&&site.atomicReady,'scout and reveal cannot substitute for leader');
  leader.x=400;const blocker=add('relay',team,400,840);
  check(!!nuclearAuthority(team).reason,'intervening structure blocks sight');blocker.hp=0;
  check(!nuclearAuthority(team).reason,'clearing structure restores sight');
  core.x=940;core.y=600;leader.x=750;leader.y=600;
  check(!!nuclearAuthority(team).reason,'forest blocks personal sight');
  core.x=400;core.y=900;leader.x=400;leader.y=780;core.construction=5;
  check(!!nuclearAuthority(team).reason,'unfinished headquarters cannot authorize');core.construction=0;
  core.hp=0;add('core',1-team,400,900);
  check(!!nuclearAuthority(team).reason,'enemy headquarters never authorizes');
  const hq=add('headquarters',team,480,780);
  check(nuclearAuthority(team).hq===hq,'completed friendly field headquarters qualifies');
  leader.hp=0;check(!launchAtomic(site,{x:600,y:1000})&&site.atomicReady,'dead leader cannot spend ready payload');
  leader.hp=leader.max;
  check(launchAtomic(site,{x:600,y:1000}),'Babar and Rataxes may launch with valid authority');
 }
 reset();running=true;paused=false;ore=3000;materials=1000;uranium=100;nuclearAcquired[0]=true;
 const bike=add('bike',0,500,900),leader=alive(0).find(u=>u.type==='hero'),core=alive(0).find(u=>u.type==='core');
 leader.x=core.x;leader.y=core.y-100;
 selected=[bike];check(!aimNeutron(bike),'Arthur cannot press launch button himself');
 selected=[leader];check(aimNeutron(bike),'Babar can authorize Arthur payload');
 leader.x=1000;leader.y=1000;
 check(!launchNeutron(bike,{x:550,y:900})&&ore===3000&&uranium===100,'authorization rechecked at target click without spending');
 reset();
}
