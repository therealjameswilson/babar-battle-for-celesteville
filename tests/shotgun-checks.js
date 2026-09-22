function shotgunChecks(check){
 reset();running=true;paused=false;easy=false;nextWave=enemySpawn=9999;
 units=[];
 const guard=add('trooper',0,700,900),primary=add('trooper',1,770,900);
 const side=add('trooper',1,775,910),behind=add('trooper',1,640,900),far=add('trooper',1,820,900),friend=add('trooper',0,760,905);
 check(!shotgunEquipped(guard),'shotgun locked before research');
 const school=add('forge',0,650,900);ore=160;materials=40;
 check(purchaseResearch(school,'shotguns')&&ore===0&&materials===0,'shotgun research paid');
 check(!shotgunEquipped(guard),'unfinished research does not equip guards');
 technologies.add('shotguns');
 const old=[primary,side,behind,far,friend].map(u=>u.hp);
 check(shoot(guard,primary),'shotgun fires');
 check(primary.hp===old[0]-24&&side.hp===old[1]-10,'primary and cone damage');
 check(behind.hp===old[2]&&far.hp===old[3]&&friend.hp===old[4],'no rear, distant or friendly hits');
 check(guard.cool===1.5,'shotgun reload');
 check(!shotgunEquipped(primary)&&!shotgunEquipped(add('worker',0,600,900)),'only elephant guards equipped');
 const before=far.hp;shoot(guard,far);check(far.hp===before-defs.trooper.damage,'rifle retained beyond shotgun range');
 reset();check(!technologies.has('shotguns'),'restart clears upgrade');
}
