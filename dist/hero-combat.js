'use strict';
const ROYAL_STRIKE = {energy:35,cooldown:12,damage:60};
function heroCombatAllowed(u) {
  return running && !paused && !ended && u?.type==='hero' && u.team===0 && u.hp>0 &&
    !$('court-dialog').open && !$('groups-dialog').open && !$('help-dialog').open && !$('opening')?.open;
}
function heroFight(u) {
  if(!heroCombatAllowed(u))return false;
  u.holdFire=false;
  setMode('attack');
  say('Babar ready to fight. Tap an enemy to focus fire, or ground to advance and engage.');
  updateUI(true);return true;
}
function royalStrike(u) {
  if(!heroCombatAllowed(u))return false;
  if(u.commandEnergy<ROYAL_STRIKE.energy || t<(u.strikeReadyAt||0)) {
    say('Royal strike needs 35 energy and a ready 12-second cooldown.');return false;
  }
  if(u.order?.kind==='retreat') {say('Babar is withdrawing. Issue a new order or Hold before using Royal strike.');return false;}
  const eligible=v=>v && v.hp>0 && v.team!==u.team && sees(u.team,v) && dist(u,v)<=weaponRange(u)+v.r;
  const target=eligible(u.order?.target)?u.order.target:nearest(u,alive(1).filter(eligible));
  if(!target){say('No visible enemy in Babar’s 100m attack range. Use Fight to close the distance.');return false;}
  u.commandEnergy-=ROYAL_STRIKE.energy;u.strikeReadyAt=t+ROYAL_STRIKE.cooldown;
  u.angle=Math.atan2(target.y-u.y,target.x-u.x);u.firedAngle=u.angle;u.firedAt=t;
  u.cool=Math.max(u.cool,defs.hero.rate);
  // Explicit activation permits this single strike, preserving the Hold fire stance.
  damageUnit(u,target,ROYAL_STRIKE.damage);
  fx.push({x:u.x,y:u.y,tx:target.x,ty:target.y,life:.3,max:.3,team:u.team});
  battleSound('cannon');
  say('Babar strikes '+(target.name||defs[target.type].name)+'. 35 energy spent.');
  updateUI(true);return true;
}

const IRON_PARASOL = {cost:90,cooldown:45,range:220,radius:90,damage:160,splash:70};
function madameAttack() {
  // Council powers may execute while their own dialog has paused the battle.
  if(!running || ended || (paused && !$('court-dialog').open))return false;
  const ready=Math.max(0,(usedPowers['madame-attack']??-1000)+IRON_PARASOL.cooldown-t);
  if(ready>0 || ore<IRON_PARASOL.cost)return false;
  const officer=alive(0).find(u=>u.type==='hero');
  const eligible=v=>v && v.hp>0 && v.team===1 && defs[v.type].speed && sees(0,v) && officer && dist(officer,v)<=IRON_PARASOL.range;
  const target=eligible(officer?.order?.target)?officer.order.target:officer && nearest(officer,alive(1).filter(eligible));
  if(!target){say('Madame needs a visible enemy unit within 220m of Babar. No supplies spent.');return false;}
  ore-=IRON_PARASOL.cost;usedPowers['madame-attack']=t;
  const victims=alive(1).filter(v=>defs[v.type].speed && sees(0,v) && dist(target,v)<=IRON_PARASOL.radius);
  for(const v of victims){
    damageUnit(officer,v,v===target?IRON_PARASOL.damage:IRON_PARASOL.splash);
    v.morale=Math.max(0,v.morale-30);
    fx.push({x:target.x-18,y:target.y-18,tx:v.x,ty:v.y,life:.4,max:.4,team:0});
  }
  fx.push({x:target.x,y:target.y,life:.7,max:.7,burst:true,r:IRON_PARASOL.radius});
  battleSound('cannon');
  say('Madame’s Iron Parasol breaks the line. '+victims.length+' enemy units struck.');
  updateUI(true);renderCourt();return true;
}
