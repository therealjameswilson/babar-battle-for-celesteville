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
