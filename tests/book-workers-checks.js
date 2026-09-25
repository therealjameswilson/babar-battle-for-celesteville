function bookWorkerChecks(check){
 for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++)for(const carrying of [0,10]){
  const u=Object.freeze({type:'worker',team,angle:dir*Math.PI/2,carrying,movingUntil:11,walkDistance:0});
  const row=carrying?2:0;
  check(bookWorkerPose(u,10).row===row&&bookWorkerPose(u,10).direction===dir,'cargo and facing');
  check(bookWorkerPose({...u,walkDistance:14},10).row===row+1,'opposite stride');
  check(bookWorkerPose({...u,walkDistance:28},10).row===row,'stride cycle');
  check(bookWorkerPose({...u,movingUntil:10,walkDistance:14},10).row===row,'idle stable');
  check(bookWorkerPose({...u,walkDistance:14},10,true).row===row,'reduced motion retains cargo');
 }
 check(bookWorkerPose({type:'hero'},10)===null,'hero excluded');
 check(bookWorkerPose({type:'worker',team:0,angle:0,carrying:0},10).loaded===false,'delivery removes crate');
 for(const kind of ['supplies','materials','uranium'])check(bookWorkerPose({type:'worker',team:0,angle:0,carrying:4,cargoKind:kind},10).loaded,'all physical cargo kinds');
}
