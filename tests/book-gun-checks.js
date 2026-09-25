function bookGunChecks(check){
 for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++){
  const u={type:'walker',team,angle:dir*Math.PI/2,movingUntil:11,walkDistance:0};
  check(bookGunPose(u,10).direction===dir,'gun facing');
  check(bookGunPose(u,10).row===1,'travel stride A');
  check(bookGunPose({...u,walkDistance:14},10).row===2,'travel stride B');
  check(bookGunPose(u,10,true).row===0,'reduced movement');
  check(bookGunPose({...u,movingUntil:9},10).row===0,'stopped');
  check(bookGunPose({...u,deployed:true},10).row===3,'deployed beats movement');
  check(bookGunPose({...u,artilleryTransition:{deploy:true,until:12}},10).row===0,'deployment stays mobile until complete');
  check(bookGunPose({...u,deployed:true,artilleryTransition:{deploy:false,until:12}},10).row===3,'packing stays braced until complete');
  const shot={...u,angle:0,firedAngle:dir*Math.PI/2,firedAt:10};
  check(bookGunPose(shot,10.1).direction===dir&&bookGunPose(shot,10.1).row===0,'mobile shot bearing');
  check(bookGunPose({...shot,deployed:true},10.1,true).row===3,'deployed firing reduced motion');
  check(!bookGunPose(shot,10.36).firing,'shot expiry');
  check(!bookGunPose({...shot,firedAt:12},10).firing,'future shot rejected');
  for(const deployed of [false,true]){const p=bookGunMuzzle(team,u.angle,deployed);check(Number.isFinite(p.x)&&Number.isFinite(p.y),'finite barrel anchor');}
 }
 check(bookGunPose({type:'hero'},10)===null,'unrelated unit rejected');
}
