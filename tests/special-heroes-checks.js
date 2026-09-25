function specialHeroChecks(check){
 for(const type of ['madame','bike'])for(let dir=0;dir<4;dir++){
  const u=Object.freeze({type,angle:dir*Math.PI/2,movingUntil:11,walkDistance:14});
  check(bookSpecialHeroPose(u,10).direction===dir,type+' facing');
  check(bookSpecialHeroPose(u,10).row===(type==='madame'?2:1),type+' movement');
  check(bookSpecialHeroPose(u,10,true).row===0,type+' reduced motion');
  check(bookSpecialHeroPose({...u,movingUntil:9},10).row===0,type+' stopped');
 }
 for(let dir=0;dir<4;dir++){
  const u={type:'madame',angle:0,firedAngle:dir*Math.PI/2,firedAt:10,movingUntil:12,walkDistance:14};
  check(bookSpecialHeroPose(u,10.2).row===3,'firing stance');
  check(bookSpecialHeroPose(u,10.2,true).direction===dir,'shot bearing and reduced motion');
  check(bookSpecialHeroPose(u,10.5).row===2,'shot expiry');
  const m=bookLadyMuzzle(dir*Math.PI/2);check(Number.isFinite(m.x)&&Number.isFinite(m.y),'finite nozzle anchor');
 }
 check(bookSpecialHeroPose({type:'madame',angle:0,firedAt:12},10).row===0,'future shot rejected');
 check(bookSpecialHeroPose({type:'hero'},10)===null,'unrelated units rejected');
}
