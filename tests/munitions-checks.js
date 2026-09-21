function munitionsChecks(check){
  function fresh(){reset();running=true;paused=false;units=units.filter(u=>u.type==='core');ore=500;materials=100;return add('trooper',0,500,1000);}
  let soldier=fresh();check(munitions===24,'starting reserve');depot.team=0;updateMunitions(10);check(munitions===29,'depot production');
  const raider=add('trooper',1,depot.x,depot.y);updateMunitions(10);check(munitions===29,'raider interrupts production');raider.hp=0;updateMunitions(1000);check(munitions===100,'reserve cap');
  depot.team=1;munitions=0;updateMunitions(10);check(munitions===0,'rhino depot denies reserve');
  soldier=fresh();const school=add('forge',0,380,900);rebuildSupply();check(packMunitions(school)&&munitions===44&&ore===440&&materials===80,'workshop conversion');check(!packMunitions(school),'workshop cooldown');t=31;linked.delete(school.id);check(!packMunitions(school),'isolated workshop');rebuildSupply();munitions=90;check(!packMunitions(school)&&ore===440,'no overflow waste');
  soldier=fresh();selected=[soldier];const enemy=add('trooper',1,550,1000,{hp:300,max:300});check(spendMunitions('rounds')&&munitions===16,'rounds cost');damageUnit(soldier,enemy,20);check(enemy.hp===270,'rounds damage boost');check(!spendMunitions('rounds')&&munitions===16,'no stacking or refresh');t=16;damageUnit(soldier,enemy,20);check(enemy.hp===250,'rounds expire');
  check(spendMunitions('smoke')&&munitions===10,'smoke cost');easy=false;damageUnit(enemy,soldier,20);check(soldier.hp===soldier.max-15,'smoke damage reduction');
  const hero=add('hero',0,soldier.x+10,soldier.y);const until=soldier.disciplineUntil;commanderAbility(hero);check(soldier.disciplineUntil===until,'commander does not shorten smoke');
  soldier=fresh();selected=[soldier,add('scout',0,520,1000)];munitions=7;check(!spendMunitions('rounds')&&munitions===7&&!soldier.heavyRoundsUntil,'atomic mixed selection cost');munitions=24;paused=true;check(!spendMunitions('smoke'),'pause guard');paused=false;ended=true;check(!spendMunitions('rounds'),'end guard');
  fresh();check(munitions===24,'restart restores reserve');
}
