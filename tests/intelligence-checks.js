/* Fog memory is evidence, never a live reference to a hidden enemy. */
function intelligenceChecks(check) {
 function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');rebuildNav();}
 function observe(){t+=1;sightAt=-1;refreshIntelligence(0);refreshIntelligence(1);}
 fresh();const scout=add('scout',0,900,650),site=add('forge',1,1000,650),raider=add('walker',1,1000,690);
 observe();check(intel[0].some(k=>k.id===site.id)&&intel[0].some(k=>k.id===raider.id),'Scouting records enemy structures and army types');
 check(!rememberedBuildings().length,'Currently visible structures are not duplicated as remembered ghosts');
 scout.x=300;scout.y=1050;observe();
 const snapshot=intel[0].find(k=>k.id===site.id),stamp=snapshot.seen;
 check(rememberedBuildings().some(k=>k.id===site.id),'Scouted structure remains marked after leaving vision');
 site.hp=1;site.queue=['trooper'];site.research={id:'armor',progress:20};observe();
 check(snapshot.seen===stamp&&!('hp'in snapshot)&&!('queue'in snapshot)&&!('research'in snapshot),'Hidden damage, recruitment and research do not refresh intelligence or leak into snapshots');
 site.hp=0;t+=100;observe();
 check(rememberedBuildings().some(k=>k.id===site.id),'Unseen destruction does not erase a remembered building');
 check(!intel[0].some(k=>k.id===raider.id),'Mobile-unit composition reports expire after sixty seconds');
 scout.x=900;scout.y=650;observe();
 check(!intel[0].some(k=>k.id===site.id),'Revisiting an empty site removes disproven building intelligence');
 const replacement=add('relay',1,1000,650);observe();
 check(intel[0].some(k=>k.id===replacement.id&&k.type==='relay')&&!intel[0].some(k=>k.id===site.id),'Rebuilt sites record the newly observed structure, not stale identity');
 // The same observation/invalidation rules apply to the rhino commander.
 const playerSite=add('forge',0,1100,400),rhino=add('scout',1,1200,400);observe();
 check(intel[1].some(k=>k.id===playerSite.id),'Rhino intelligence records a legitimately scouted player building');
 rhino.x=1600;rhino.y=150;replacement.hp=0;raider.hp=0;observe();playerSite.hp=0;observe();
 check(intel[1].some(k=>k.id===playerSite.id),'Rhinos do not learn about destruction outside their vision');
 rhino.x=1200;rhino.y=400;observe();
 check(!intel[1].some(k=>k.id===playerSite.id),'Rhinos clear the obsolete site only when they revisit it');
 reset();check(!intel[0].length&&!intel[1].length,'Restart clears both factions’ intelligence');
}
