'use strict';
// Field guns trade movement and close defense for a long-range, spotted barrage.
const SIEGE = { range: 390, minimum: 90, damage: 72, rate: 3.6, radius: 65, deploy: 3, pack: 2 };
function artilleryLocked(u) {
  return u.type === 'walker' && (!!u.deployed || !!u.artilleryTransition);
}
function weaponRange(u) { return u.deployed ? SIEGE.range : defs[u.type].range; }
function inWeaponArc(u, target) {
  const distance = dist(u, target);
  return distance <= weaponRange(u) + target.r && (!u.deployed || distance >= SIEGE.minimum);
}
function setArtilleryMode(u, deploy) {
  if (!u || u.hp <= 0 || u.type !== 'walker' || u.artilleryTransition || !!u.deployed === deploy) return false;
  u.artilleryTransition = { deploy, until: t + (deploy ? SIEGE.deploy : SIEGE.pack) };
  u.path = null;
  u.movingUntil = 0;
  if (deploy) { u.order = { kind: 'hold' }; u.orders = []; u.followup = null; }
  return true;
}
function toggleArtillery() {
  if (!running || paused || ended) return;
  const guns = selected.filter(u => u.team === 0 && u.type === 'walker' && u.hp > 0);
  const deploy = guns.some(u => !u.deployed && !u.artilleryTransition);
  let changed = false;
  for (const u of guns) changed = setArtilleryMode(u, deploy) || changed;
  if (changed) say(deploy
    ? 'Deploying guns: 3 seconds. Scout ahead; keep allies clear of shell impacts.'
    : 'Packing guns: 2 seconds before movement.');
  updateUI(true);
}
function updateArtillery(u) {
  if (u.type !== 'walker') return false;
  if (u.artilleryTransition && t >= u.artilleryTransition.until) {
    u.deployed = u.artilleryTransition.deploy;
    u.artilleryTransition = null;
    if (selected.includes(u)) updateUI(true);
  }
  // Movement and retreat orders pack automatically, paying the full transition time.
  const relocating = u.order && (['move', 'retreat'].includes(u.order.kind) || (u.order.kind === 'attack' && Number.isFinite(u.order.x)));
  if (relocating && u.deployed && !u.artilleryTransition) setArtilleryMode(u, false);
  return !!u.artilleryTransition;
}
function enemyArtillery() {
  for (const u of alive(1).filter(u => u.type === 'walker')) {
    if (u.artilleryTransition) continue;
    const seen = alive(0).filter(v => sees(1, v));
    const closeThreat = seen.some(v => defs[v.type].damage && dist(u, v) < 140);
    const targets = seen.filter(v => dist(u, v) >= 170 && dist(u, v) <= SIEGE.range + v.r);
    if (targets.length) u.lastSiegeTarget = t;
    if (u.deployed) {
      u.lastSiegeTarget ??= t;
      if (closeThreat || u.order?.kind === 'retreat' || t - (u.lastSiegeTarget ?? t) > 4) {
        setArtilleryMode(u, false);
        if (u.order?.kind !== 'retreat') u.order = u.siegeAdvance || { kind: 'hold' };
      }
    } else if (!closeThreat && targets.length && u.morale >= 45 && u.order?.kind !== 'retreat') {
      u.siegeAdvance = u.order;
      setArtilleryMode(u, true);
    }
  }
}

// Read-only battery feedback uses current faction sight, never hidden targets.
function batteryReport(guns){
  const report={mobile:0,deployed:0,transitioning:0,ready:0,reloading:0,unspotted:0,close:0,splash:0};
  for(const gun of guns.filter(u=>u.type==='walker'&&u.hp>0)){
    if(gun.artilleryTransition){report.transitioning++;continue;}
    if(!gun.deployed){report.mobile++;continue;}
    report.deployed++;
    const seen=alive(1-gun.team).filter(e=>sees(gun.team,e));
    if(seen.some(e=>defs[e.type].damage&&dist(gun,e)<SIEGE.minimum))report.close++;
    const targets=seen.filter(e=>inWeaponArc(gun,e));
    const target=targets.includes(gun.order?.target)?gun.order.target:nearest(gun,targets);
    if(!target){report.unspotted++;continue;}
    if(gun.cool>0)report.reloading++;else report.ready++;
    if(alive(gun.team).some(a=>a!==gun&&dist(a,target)<=SIEGE.radius))report.splash++;
  }
  return report;
}
function batterySummary(guns){
  const r=batteryReport(guns);
  const parts=[`${r.deployed} deployed`,`${r.mobile} mobile`];
  if(r.transitioning)parts.push(`${r.transitioning} changing mode`);
  if(r.ready)parts.push(`${r.ready} ready to fire`);
  if(r.reloading)parts.push(`${r.reloading} reloading`);
  if(r.unspotted)parts.push(`${r.unspotted} with no visible target in range — scout or reposition`);
  if(r.close)parts.push(`CLOSE THREAT at ${r.close} gun${r.close===1?'':'s'} — screen or pack`);
  if(r.splash)parts.push(`FRIENDLY FIRE RISK at ${r.splash} gun${r.splash===1?'':'s'} — allies near likely impacts`);
  return parts.join(' · ');
}
