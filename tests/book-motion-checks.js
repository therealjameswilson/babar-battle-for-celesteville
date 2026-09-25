function bookMotionChecks(check) {
 for(let team=0;team<2;team++)for(let direction=0;direction<4;direction++){
  const u=Object.freeze({type:'trooper',team,angle:direction*Math.PI/2,movingUntil:11,walkDistance:0});
  let p=bookInfantryPose(u,10);check(p.direction===direction&&p.row===team*2,'direction and first stride');
  check(bookInfantryPose({...u,walkDistance:14},10).row===team*2+1,'opposite stride');
  check(bookInfantryPose({...u,walkDistance:28},10).phase===0,'distance cycle');
  check(bookInfantryPose({...u,movingUntil:10,walkDistance:14},10).phase===0,'standing stops animation');
  check(bookInfantryPose({...u,walkDistance:14},10,true).phase===0,'reduced motion stable');
  const firing={...u,firedAt:10,firedAngle:-Math.PI/2,walkDistance:14};
  check(bookInfantryPose(firing,10).direction===3&&bookInfantryPose(firing,10).phase===0,'firing faces actual shot');
  check(bookInfantryPose(firing,10.25).direction===direction,'shot direction expires');
 }
 check(bookInfantryPose({type:'hero'},10)===null,'commander retains own artwork');
 check(bookInfantryPose({type:'worker'},10)===null,'worker retains own artwork');
 check(bookInfantryPose({type:'scout',team:0,angle:0},10)!==null,'scout infantry supported');
 check(bookInfantryPose({type:'sapper',team:1,angle:0},10)!==null,'sapper infantry supported');
}
