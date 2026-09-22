'use strict';
// Abstract RTS balance rules, not real missile performance.
const BALLISTIC={cost:120,materials:40,range:900,warning:10,radius:60,damage:300,cooldown:35};
const MISSILE_DEFENSE={range:260,cost:20,materials:10,cooldown:12,window:4};
function ballisticReady(b){
  return b?.hp>0&&b.type==='silo'&&!b.construction&&supplied(b)&&factionResearch(b.team).has('ballistics')&&
    t>=(b.missileReadyAt||0)&&(b.team?enemyBudget:ore)>=BALLISTIC.cost&&(b.team?enemyMaterials:materials)>=BALLISTIC.materials&&
    atomicStrikes.filter(s=>s.team===b.team&&s.kind==='ballistic').length<3;
}
function aimBallistic(b){
  if(!running||paused||ended||b?.team!==0||!ballisticReady(b))return false;
  atomicTargetSite=b;mode='ballistic';placing=null;say('Ballistic strike: visible target within 900m. 10s warning; friendly fire.');return true;
}
function launchBallistic(b,p){
  if(!running||paused||ended||!ballisticReady(b)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.y<0||p.x>W||p.y>H||dist(b,p)>BALLISTIC.range||!observesPosition(b.team,p))return false;
  if(b.team){enemyBudget-=BALLISTIC.cost;enemyMaterials-=BALLISTIC.materials;enemySpent+=BALLISTIC.cost;}else{ore-=BALLISTIC.cost;materials-=BALLISTIC.materials;}
  b.missileReadyAt=t+BALLISTIC.cooldown;
  atomicStrikes.push({team:b.team,site:b,kind:'ballistic',x:p.x,y:p.y,at:t+BALLISTIC.warning});
  say((b.team?'RHINO':'ELEPHANT')+' BALLISTIC LAUNCH. Impact in 10 seconds.');battleSound('cannon');updateUI(true);return true;
}
function interceptMissile(s){
  if(s.kind==='neutron'||t<s.at-MISSILE_DEFENSE.window)return false;
  const team=1-s.team,needed=s.kind==='hydrogen'?2:1;
  for(const b of alive(team).filter(b=>b.type==='interceptor'&&!b.construction&&supplied(b)&&dist(b,s)<=MISSILE_DEFENSE.range).sort((a,b)=>a.id-b.id)){
    if(t<(b.interceptorReadyAt||0)||(team?enemyBudget:ore)<MISSILE_DEFENSE.cost||(team?enemyMaterials:materials)<MISSILE_DEFENSE.materials)continue;
    if(team){enemyBudget-=MISSILE_DEFENSE.cost;enemyMaterials-=MISSILE_DEFENSE.materials;enemySpent+=MISSILE_DEFENSE.cost;}else{ore-=MISSILE_DEFENSE.cost;materials-=MISSILE_DEFENSE.materials;}
    b.interceptorReadyAt=t+MISSILE_DEFENSE.cooldown;s.defenseHits=(s.defenseHits||0)+1;
    fx.push({x:b.x,y:b.y,tx:s.x,ty:s.y,life:.7,max:.7,team});
    battleSound('shot');
    if(s.defenseHits>=needed){
      fx.push({x:s.x,y:s.y,life:.8,max:.8,burst:true,r:28});
      say(payloadLabel(s.kind)+' intercepted. Warhead destroyed before impact.');updateUI(true);return true;
    }
    say('H-BOMB hit by one interceptor. A second battery must engage.');updateUI(true);
  }
  return false;
}
function enemyMissileOrders(){
  for(const b of alive(1).filter(b=>b.type==='silo'&&ballisticReady(b))){
    const targets=alive(0).filter(u=>sees(1,u)&&dist(b,u)<=BALLISTIC.range&&!alive(1).some(v=>dist(u,v)<BALLISTIC.radius+20));
    const target=targets.sort((a,c)=>(defs[a.type].speed?1:0)-(defs[c.type].speed?1:0)||dist(b,a)-dist(b,c))[0];
    if(target)launchBallistic(b,target);
  }
}
function missileActions(a,u){
  if(selected.length!==1||u?.team!==0||u.construction)return;
  if(u.type==='silo')a.push(['Launch ballistic missile',t<(u.missileReadyAt||0)?Math.ceil(u.missileReadyAt-t)+'s reload':'120 S · 40 M · 900m · 10s warning',()=>aimBallistic(u),!ballisticReady(u)]);
  if(u.type==='interceptor')a.push(['Automatic missile defense',!supplied(u)?'ISOLATED — reconnect supply':ore<MISSILE_DEFENSE.cost||materials<MISSILE_DEFENSE.materials?'NEEDS 20 Supplies / 10 Materials per interceptor':t<(u.interceptorReadyAt||0)?Math.ceil(u.interceptorReadyAt-t)+'s reload':'260m coverage · 20 S / 10 M per shot · H-bombs require two batteries',()=>{},true]);
}
function drawMissileBuilding(c,u){
  c.fillStyle='#46534b';c.fillRect(-32,-24,64,44);c.strokeStyle='#b2a37e';c.lineWidth=3;c.strokeRect(-32,-24,64,44);
  if(u.type==='silo'){
    c.fillStyle='#171f1b';c.beginPath();c.ellipse(0,-18,22,12,0,0,Math.PI*2);c.fill();
    c.fillStyle='#bbc1b3';c.fillRect(-7,-60,14,42);c.beginPath();c.moveTo(-7,-60);c.lineTo(0,-77);c.lineTo(7,-60);c.fill();
    c.fillStyle=u.team?RED:BLUE;c.fillRect(-7,-38,14,5);
  }else{
    c.strokeStyle='#a8b5a3';c.lineWidth=4;c.beginPath();c.moveTo(0,-20);c.lineTo(0,-58);c.moveTo(-22,-58);c.lineTo(22,-58);c.stroke();
    c.beginPath();c.ellipse(0,-58,24,9,-.3,0,Math.PI*2);c.stroke();
    c.fillStyle='#c3bc9b';c.fillRect(-24,-36,12,22);c.fillRect(12,-36,12,22);
  }
  c.fillStyle=u.team?RED:BLUE;c.fillRect(-28,12,56,4);
}
function drawMissileFlights(c){
  for(const b of selected.filter(b=>b.team===0&&b.type==='interceptor'&&!b.construction)){
    c.save();c.strokeStyle=supplied(b)?'#9acaab':'#b57464';c.setLineDash([5,6]);c.beginPath();c.arc(b.x,b.y,MISSILE_DEFENSE.range,0,Math.PI*2);c.stroke();c.restore();
  }
  if(mode==='ballistic'&&atomicTargetSite?.hp>0){c.save();c.strokeStyle='#c3b584';c.setLineDash([6,6]);c.beginPath();c.arc(atomicTargetSite.x,atomicTargetSite.y,BALLISTIC.range,0,Math.PI*2);c.stroke();c.restore();}
  for(const s of atomicStrikes.filter(s=>s.kind!=='neutron')){
    const progress=reducedMotion?.5:clamp(1-(s.at-t)/payloadSpec(s.kind).warning,0,1),start=s.site;
    const x=start.x+(s.x-start.x)*progress,y=start.y+(s.y-start.y)*progress-Math.sin(progress*Math.PI)*100;
    c.save();c.strokeStyle='#d7be8c';c.lineWidth=1.5;c.setLineDash([4,6]);c.beginPath();c.moveTo(start.x,start.y);c.quadraticCurveTo((start.x+s.x)/2,(start.y+s.y)/2-180,s.x,s.y);c.stroke();c.setLineDash([]);
    c.fillStyle='#ffe4a4';c.beginPath();c.moveTo(x,y-7);c.lineTo(x-4,y+5);c.lineTo(x+4,y+5);c.closePath();c.fill();c.restore();
  }
}
