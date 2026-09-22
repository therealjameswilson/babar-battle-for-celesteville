'use strict';
function armorClass(u) { return u.type === 'walker' || !defs[u.type].speed ? 'armored' : 'light'; }
function counterBonus(attacker, target) { return attacker.type === 'sapper' && armorClass(target) === 'armored' ? 20 : 0; }
function unitUnlocked(type, team = 0) {
  if(type==='bike')return team===0&&!alive(team).some(u=>u.type==='bike'||u.queue.includes('bike'));
  return type !== 'sapper' || alive(team).some(b => b.type === 'factory' && !b.construction);
}
function combatRole(u) {
  if(u.type==='bike')return 'Arthur · fast courier motorbike · no standard weapon. Neutron strike unlocks after your first completed nuclear payload.';
  if (u.type === 'sapper') return 'Light · 10 +20 vs armored · 170m. Weak to guards.';
  if (u.type === 'walker') return 'Armored · siege/splash. Weak to sappers; screen with guards.';
  if (u.type === 'trooper') return 'Light · beats sappers, screens guns. Weak to siege splash.';
  if (u.type === 'scout') return 'Light · fast scouting and flanking. Avoid infantry fire.';
  return '';
}
function factionResearch(team) { return team ? enemyTechnologies : technologies; }
function researchRequirement(id,team) {
  const tech=researchDefs[id];
  if (!tech) return 'Unknown research.';
  if (tech.requires && !factionResearch(team).has(tech.requires)) return 'Requires ' + researchDefs[tech.requires].name + '.';
  if(tech.requiresAlso&&!factionResearch(team).has(tech.requiresAlso))return 'Requires '+researchDefs[tech.requiresAlso].name+'.';
  if (tech.requiresBuilding && !alive(team).some(b=>b.type===tech.requiresBuilding&&!b.construction)) return 'Requires completed ' + defs[tech.requiresBuilding].name + '.';
  return '';
}
function infantryArmor(u) {
  if (!['trooper','scout','sapper'].includes(u.type)) return 0;
  const upgrades=factionResearch(u.team);
  return upgrades.has('armor2') ? 4 : upgrades.has('armor') ? 2 : 0;
}
function purchaseResearch(b, id) {
  const tech=researchDefs[id];
  if (!tech || !b || researchRequirement(id,b.team) || b.hp<=0 || b.type!==tech.building || b.construction || b.research || b.atomicJob || b.queue.length ||
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
  const priorities=guns>=2?['shells','drill']:['drill'];
  if(t>=180)priorities.push('armor','armor2');
  if(t>=240)priorities.push('rapid');
  if(t>=360)priorities.unshift('damageLimitation');
  if(t>=480)priorities.push('shells','atomic');
  if(t>=780)priorities.push('hydrogen');
  for (const id of priorities) {
    const tech=researchDefs[id];
    if (researchRequirement(id,1)||enemyTechnologies.has(id)||buildings.some(b=>b.research?.id===id)) continue;
    const b=buildings.find(b=>b.type===tech.building&&!b.construction&&!b.research);
    if (!b) continue;
    if (enemyBudget<tech.cost+120 || enemyMaterials<(tech.materials||0)+25) {b.plannedResearch=null;continue;}
    // Stop appending recruits until the existing paid queue drains.
    b.plannedResearch=id;
    purchaseResearch(b,id);
    break;
  }
}

const RAPID_ADVANCE={health:20,duration:6,cooldown:24,speed:1.3,interval:.7};
function rapidInfantry(u){return ['trooper','scout','sapper'].includes(u.type);}
function rapidActive(u){return (u.rapidUntil||0)>t;}
function rapidReady(u){return rapidInfantry(u)&&u.hp>RAPID_ADVANCE.health&&u.morale>=35&&t>=(u.rapidReadyAt||0)&&factionResearch(u.team).has('rapid');}
function activateRapid(u){
 if(!running||paused||ended||!u||!rapidReady(u))return false;
 u.hp-=RAPID_ADVANCE.health;u.hitAt=t;
 u.rapidUntil=t+RAPID_ADVANCE.duration;u.rapidReadyAt=t+RAPID_ADVANCE.cooldown;
 return true;
}
function rapidAdvance(){
 if(!running||paused||ended)return;
 const activated=selected.filter(u=>u.team===0&&activateRapid(u)).length;
 say(activated?`Rapid advance: ${activated} troops. Six seconds of speed and rapid fire; 20 health spent each.`:'Rapid advance needs researched infantry, over 20 health, 35 morale and a ready cooldown.');
 updateUI(true);
}
function enemyRapidAdvance(){
 if(!enemyTechnologies.has('rapid'))return;
 const threats=alive(0).filter(u=>defs[u.type].damage&&sees(1,u));
 for(const u of alive(1))if(rapidReady(u)&&u.hp>u.max*.55&&u.morale>50&&u.order?.kind!=='retreat'&&threats.some(v=>dist(u,v)<weaponRange(u)+v.r+70))activateRapid(u);
}
