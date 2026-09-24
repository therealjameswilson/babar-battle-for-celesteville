'use strict';
// A player command reserve; the rhino economy gains Supplies from depot ownership.
const MUNITIONS = {cap:100,start:24,rate:.5,batch:20,supplies:60,materials:20,cooldown:30};
let munitions = MUNITIONS.start;
function munitionsIncome() {
  return depot.team===0 && !alive(1).some(u=>defs[u.type].damage && defs[u.type].speed && dist(u,depot)<90);
}
function updateMunitions(dt) {
  if(munitionsIncome())munitions=Math.min(MUNITIONS.cap,munitions+dt*MUNITIONS.rate);
}
function munitionsAllowed() {
  return running && !paused && !ended && !['court-dialog','groups-dialog','help-dialog','opening'].some(id=>$(id)?.open);
}
function packMunitions(b) {
  if(!munitionsAllowed() || !b || b.hp<=0 || b.team!==0 || !['forge','factory'].includes(b.type) || b.construction)return false;
  if(!supplied(b)){say('Workshop isolated. Restore its supply link to pack Munitions.');return false;}
  if(t<(b.munitionsReadyAt||0) || ore<MUNITIONS.supplies || materials<MUNITIONS.materials || munitions>MUNITIONS.cap-MUNITIONS.batch)return false;
  ore-=MUNITIONS.supplies;materials-=MUNITIONS.materials;munitions+=MUNITIONS.batch;
  b.munitionsReadyAt=t+MUNITIONS.cooldown;
  say('20 Munitions packed. Workshop reloads for 30 seconds.');updateUI(true);return true;
}
function munitionsTroops(kind) {
  const field=kind==='rounds'?'heavyRoundsUntil':'disciplineUntil';
  return selected.filter(u=>u.team===0 && u.hp>0 && defs[u.type].damage && defs[u.type].speed && t>=(u[field]||0));
}
function spendMunitions(kind) {
  if(!munitionsAllowed() || !['rounds','smoke'].includes(kind))return false;
  const troops=munitionsTroops(kind),cost=troops.length*(kind==='rounds'?8:6);
  if(!troops.length || munitions<cost){say('Not enough Munitions for this selection. Select fewer troops or replenish the reserve.');return false;}
  munitions-=cost;
  for(const u of troops){
    if(kind==='rounds')u.heavyRoundsUntil=t+15;
    else {u.disciplineUntil=Math.max(u.disciplineUntil||0,t+12);u.smokeUntil=t+12;}
    fx.push({x:u.x,y:u.y,life:.6,max:.6,ring:true});
  }
  say((kind==='rounds'?'Heavy rounds loaded: +50% attack damage for 15 seconds.':'Smoke cover: incoming damage reduced 25% for 12 seconds.')+' '+cost+' Munitions spent.');
  updateUI(true);return true;
}
function munitionsActions(actions,u) {
  for(const [kind,label,cost,hint] of [['rounds','Heavy rounds',8,'+50% damage · 15s'],['smoke','Smoke cover',6,'−25% incoming damage · 12s']]){
    const troops=munitionsTroops(kind);
    const affordable = Math.floor(munitions / cost);
    const guidance = !troops.length ? 'Already active on this selection' : troops.length > affordable
      ? (affordable ? `Select ${affordable} or fewer ready troops · ${Math.floor(munitions)}/${MUNITIONS.cap} MU stored` : `Need ${cost} MU per troop · replenish at a workshop or hold the depot`)
      : `${troops.length} ready`;
    if(selected.some(v=>v.team===0&&defs[v.type].damage&&defs[v.type].speed))
      actions.push([label,`${troops.length*cost} MU · ${guidance} · ${hint}`,()=>spendMunitions(kind),!troops.length||munitions<troops.length*cost]);
  }
  if(selected.length===1&&u?.team===0&&['forge','factory'].includes(u.type)&&!u.construction){
    const wait=Math.ceil(Math.max(0,(u.munitionsReadyAt||0)-t));
    actions.push(['Pack Munitions',wait?`${wait}s cooldown`:'60 S · 20 M → 20 MU · 30s cooldown',()=>packMunitions(u),wait>0||ore<60||materials<20||munitions>80||!supplied(u)]);
  }
}
