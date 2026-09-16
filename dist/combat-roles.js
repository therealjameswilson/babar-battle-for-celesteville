'use strict';
function armorClass(u) { return u.type === 'walker' || !defs[u.type].speed ? 'armored' : 'light'; }
function counterBonus(attacker, target) { return attacker.type === 'sapper' && armorClass(target) === 'armored' ? 20 : 0; }
function unitUnlocked(type, team = 0) {
  return type !== 'sapper' || alive(team).some(b => b.type === 'factory' && !b.construction);
}
function combatRole(u) {
  if (u.type === 'sapper') return 'Light · 10 +20 vs armored · 170m. Weak to guards.';
  if (u.type === 'walker') return 'Armored · siege/splash. Weak to sappers; screen with guards.';
  if (u.type === 'trooper') return 'Light · beats sappers, screens guns. Weak to siege splash.';
  if (u.type === 'scout') return 'Light · fast scouting and flanking. Avoid infantry fire.';
  return '';
}
function factionResearch(team) { return team ? enemyTechnologies : technologies; }
function purchaseResearch(b, id) {
  const tech=researchDefs[id];
  if (!tech || !b || b.hp<=0 || b.type!==tech.building || b.construction || b.research || b.queue.length ||
      factionResearch(b.team).has(id) || alive(b.team).some(a=>a.research?.id===id)) return false;
  if ((b.team?enemyBudget:ore)<tech.cost || (b.team?enemyMaterials:materials)<(tech.materials||0)) return false;
  if (b.team) {enemyBudget-=tech.cost;enemyMaterials-=tech.materials||0;enemySpent+=tech.cost;}
  else {ore-=tech.cost;materials-=tech.materials||0;}
  b.research={id,progress:0};b.plannedResearch=null;
  return true;
}
function enemyCounterChoice(troops, buildings) {
  // React to scouted types for at most 60s, never inspect hidden current positions.
  const seenArmor=intel[1].filter(k=>k.type==='walker' && t-k.seen<60).length;
  const sappers=alive(1).filter(u=>u.type==='sapper').length+buildings.reduce((n,b)=>n+b.queue.filter(q=>q==='sapper').length,0);
  if (seenArmor && sappers<Math.min(6,seenArmor*2) && unitUnlocked('sapper',1) && enemyMaterials>=20) return 'sapper';
  const guns=alive(1).filter(u=>u.type==='walker').length+buildings.reduce((n,b)=>n+b.queue.filter(q=>q==='walker').length,0);
  return t>65 && guns<Math.floor(troops/4) && enemyMaterials>=25 ? 'walker':'trooper';
}
function enemyResearchPlan(buildings) {
  for (const b of buildings) b.plannedResearch=null;
  if (t<100 || alive(1).filter(u=>defs[u.type].damage&&defs[u.type].speed).length<6) return;
  const guns=alive(1).filter(u=>u.type==='walker').length;
  for (const id of (guns>=2?['shells','drill']:['drill'])) {
    const tech=researchDefs[id];
    if (enemyTechnologies.has(id)||buildings.some(b=>b.research?.id===id)) continue;
    const b=buildings.find(b=>b.type===tech.building&&!b.construction&&!b.research);
    if (!b) continue;
    if (enemyBudget<tech.cost+120 || enemyMaterials<(tech.materials||0)+25) {b.plannedResearch=null;continue;}
    // Stop appending recruits until the existing paid queue drains.
    b.plannedResearch=id;
    purchaseResearch(b,id);
    break;
  }
}
