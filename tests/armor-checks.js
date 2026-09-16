/* Shared VM/browser progression, faction and battlefield outcome checks. */
function armorChecks(check) {
  function fresh(){easy=false;reset();running=true;nextWave=enemySpawn=9999;enemyScoutSent=true;ore=1000;materials=300;}
  fresh();
  const school=alive(0).find(b=>b.type==='forge');
  check(!purchaseResearch(school,'armor2')&&ore===1000&&materials===300,'Protection II cannot bypass tier I or spend resources while locked');
  check(purchaseResearch(school,'armor')&&ore===860&&materials===260,'Protection I spends 140 Supplies and 40 Materials');
  check(!purchaseResearch(school,'drill'),'Armor research occupies the same producer as weapons and recruitment');
  cancelResearch(school);
  check(ore===965&&materials===290&&!school.research,'Armor cancellation returns 75 percent of both resources');
  purchaseResearch(school,'armor');school.research.progress=29.99;update(.05);
  check(technologies.has('armor')&&!school.research,'Protection I completes through the production simulation');
  check(researchRequirement('armor2',0).includes('Artillery Works'),'Protection II still requires an Artillery Works');
  const works=add('factory',0,550,1080,{construction:1});
  check(!purchaseResearch(school,'armor2'),'Unfinished technology building does not unlock tier II');
  works.construction=0;
  check(purchaseResearch(school,'armor2'),'Completed Artillery Works unlocks paid tier II');
  school.research.progress=44.99;update(.05);
  check(technologies.has('armor2')&&infantryArmor({type:'trooper',team:0})===4,'Tier II replaces rather than stacks tier I protection');
  check(infantryArmor({type:'worker',team:0})===0&&infantryArmor({type:'hero',team:0})===0&&infantryArmor({type:'walker',team:0})===0,'Protection remains an infantry technology, not global invulnerability');
  const attacker=add('trooper',1,750,1050),target=add('trooper',0,820,1050),enemy=add('trooper',1,880,1050);
  damageUnit(attacker,target,18);damageUnit(target,enemy,18);
  check(target.hp===131&&enemy.hp===127,'Armor reduces incoming infantry hits only for the researched faction');
  target.hp=145;damageUnit(attacker,target,72);
  check(target.hp===77,'Heavy shell still deals 68 damage through tier II armor');
  target.hp=145;damageUnit(attacker,target,.5);
  check(target.hp===144.5,'Protection never increases a fractional hit while preserving nonzero damage');
  check(target.morale<100,'Protection does not cancel incoming suppression');
  // A repeated-fire outcome: tier II changes time-to-kill without changing attack rate.
  target.hp=145;target.morale=100;
  for(let i=0;i<9;i++)damageUnit(attacker,target,18);
  check(target.hp===19,'Researched infantry survives nine 18-damage volleys that kill unprotected infantry');
  check(infantryArmor(add('scout',0,550,1020))===4&&infantryArmor(add('sapper',0,590,1020))===4,'Future scouts and sappers receive completed protection');
  fresh();t=200;enemyBudget=1000;enemyMaterials=300;enemyTechnologies.add('drill');enemyTechnologies.add('shells');
  add('trooper',1,1400,380);
  const labs=alive(1).filter(b=>!defs[b.type].speed);enemyResearchPlan(labs);
  check(labs.some(b=>b.research?.id==='armor')&&enemyBudget===860&&enemyMaterials===260,'Basil buys the same protection after early weapon priorities using actual funds');
  reset();check(infantryArmor({type:'trooper',team:0})===0&&infantryArmor({type:'trooper',team:1})===0,'Restart clears both factions’ protection');
}
