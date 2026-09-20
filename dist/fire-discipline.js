'use strict';
function fireDisciplineUnit(u) {
  return u && u.hp > 0 && defs[u.type].speed > 0 && defs[u.type].damage > 0 && u.type !== 'worker';
}
function firePermission(u, target = u.order?.target) {
  return !u.holdFire || !!(target && u.order?.kind === 'attack' && u.order.forceFire && u.order.target === target);
}
function toggleFireDiscipline() {
  if (!running || paused || ended || ['help-dialog','court-dialog','groups-dialog'].some(id => $(id).open)) return false;
  const troops = selected.filter(u => u.team === 0 && fireDisciplineUnit(u));
  if (!troops.length) return false;
  const hold = troops.some(u => !u.holdFire);
  for (const u of troops) {
    u.holdFire = hold;
    // A fresh focus-fire command is explicit consent to break silence for that target.
    if (hold) for (const order of [u.order, ...(u.orders || [])]) if (order?.kind === 'attack' && order.target) order.forceFire = false;
  }
  say(hold ? 'Hold fire. Keep scouting; enemies can still see you. A new focus-fire order engages only its target.' : 'Weapons free. Engage visible enemies according to your current orders.');
  updateUI(true);
  return true;
}
function fireDisciplineSummary() {
  const troops = selected.filter(u => u.team === 0 && fireDisciplineUnit(u));
  if (!troops.length) return '';
  const held = troops.filter(u => u.holdFire);
  const silent = held.length, focused = held.filter(u => firePermission(u)).length;
  return silent ? `HOLD FIRE ${silent}/${troops.length}${focused ? " · " + focused + " focused" : ""} · New focus-fire orders override for one target` : 'WEAPONS FREE · C to hold fire';
}
