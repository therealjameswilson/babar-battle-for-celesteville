function oldLadyChecks(check){
 reset();running=true;paused=false;nextWave=enemySpawn=9999;
 const palace=alive(0).find(u=>u.type==='core');selected=[palace];ore=500;materials=100;
 train('madame');check(palace.queue.includes('madame')&&ore===300&&materials===40,'paid unique Old Lady recruitment');
 train('madame');check(palace.queue.length===1,'queued uniqueness');
 for(let i=0;i<550;i++)update(.05);
 const lady=alive(0).find(u=>u.type==='madame');check(!!lady&&!unitUnlocked('madame'),'Old Lady deploys and blocks duplicate recruitment');
 units=units.filter(u=>!defs[u.type].speed||u===lady);lady.x=700;lady.y=900;lady.holdFire=false;
 const target=add('trooper',1,770,900),side=add('trooper',1,775,915),rear=add('trooper',1,660,900),friend=add('trooper',0,770,905);
 const hp=[target,side,rear,friend].map(u=>u.hp);check(shoot(lady,target),'flamethrower fires');
 check(target.hp===hp[0]-26&&side.hp===hp[1]-14,'flame target and cone damage');
 check(rear.hp===hp[2]&&friend.hp===hp[3],'rear and friendly troops spared');
 lady.holdFire=true;check(!shoot(lady,target),'hold fire respected');
 lady.hp=0;check(unitUnlocked('madame'),'fallen Old Lady can be recruited again');
 reset();check(!alive(0).some(u=>u.type==='madame'),'restart clears deployed character');
}
