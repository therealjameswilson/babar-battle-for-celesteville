function navigationCommandChecks(check){
 for(const team of [0,1]){
  reset();running=true;paused=false;units=[];t+=1;
  add('core',team,300,850);add('forge',team,440,875);
  const leader=add('hero',team,486,845);
  const destination={x:250,y:930};
  check(!solidAt(leader.x,leader.y,leader.r),'start beside school is traversable');
  for(let i=0;i<500;i++){t+=.05;move(leader,destination,.05);check(!solidAt(leader.x,leader.y,leader.r),'route never enters building');}
  check(dist(leader,destination)<8,'leader completes route around school without manual waypoint');
  leader.x=486;leader.y=845;t+=1;
  const p=headquartersPosition(leader);
  check(!!p,'reachable headquarters approach found for each faction');
  for(let i=0;i<500&&p;i++){t+=.05;move(leader,p,.05);}
  check(!nuclearAuthority(team).reason,'automatic position provides actual personal headquarters sight');
 }
 reset();running=true;paused=false;technologies.add('atomic');uranium=39;
 check(!nuclearReadiness()[1][0],'insufficient uranium reported');uranium=40;
 check(nuclearReadiness()[1][0],'uranium threshold reported');
 const leader=alive(0).find(u=>u.type==='hero');
 check(positionAtHeadquarters()&&selected[0]===leader&&leader.order.kind==='move','position button issues real move order');
 paused=true;const order=leader.order;
 check(!positionAtHeadquarters()&&leader.order===order,'paused positioning cannot issue orders');
 paused=false;alive(0).filter(u=>['core','headquarters'].includes(u.type)).forEach(u=>u.hp=0);
 check(!positionAtHeadquarters(),'no headquarters fails safely');
 reset();
}
