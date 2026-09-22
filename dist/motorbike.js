'use strict';
// Fictional game values; not a model of real neutron weapons.
const NEUTRON={cost:400,materials:120,uranium:30,cooldown:120,range:360,warning:12,radius:110,damage:450,buildingDamage:80};
let nuclearAcquired=[false,false];
function strikeCommandActive(s){return s.site.hp>0&&(s.kind==='neutron'||supplied(s.site));}
function neutronReady(u){
  return u?.hp>0&&u.type==='bike'&&u.team===0&&nuclearAcquired[0]&&!nuclearAuthority(u.team).reason&&
    t>=(u.neutronReadyAt||0)&&!atomicStrikes.some(s=>s.team===0&&s.kind!=='ballistic')&&
    ore>=NEUTRON.cost&&materials>=NEUTRON.materials&&uranium>=NEUTRON.uranium;
}
function aimNeutron(u){
  if(!running||paused||ended||!neutronReady(u)||selected.length!==1||selected[0]!==nuclearAuthority(u.team).leader)return false;
  atomicTargetSite=u;mode='neutron';placing=null;
  say('Arthur: select a visible target within 360m. 12s warning; friendly fire. Workers should reach Civil Defense.');return true;
}
function launchNeutron(u,p){
  if(!running||paused||ended||!neutronReady(u)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.y<0||p.x>W||p.y>H||dist(u,p)>NEUTRON.range||!observesPosition(0,p))return false;
  ore-=NEUTRON.cost;materials-=NEUTRON.materials;uranium-=NEUTRON.uranium;
  u.neutronReadyAt=t+NEUTRON.cooldown;
  atomicStrikes.push({team:0,site:u,kind:'neutron',x:p.x,y:p.y,at:t+NEUTRON.warning});
  say('BABAR AUTHORIZES ARTHUR: NEUTRON LAUNCH. Evacuate the marked area. Destroying the motorbike aborts the strike.');
  battleSound('cannon');updateUI(true);return true;
}
function motorbikeActions(a,u){
  if(selected.length!==1||u?.type!=='bike'||u.team!==0)return;
  const status=!nuclearAcquired[0]?'Complete your first atomic or H-bomb to unlock':
    t<(u.neutronReadyAt||0)?Math.ceil(u.neutronReadyAt-t)+'s cooldown':
    '400 S · 120 M · 30 U · 360m range · 12s warning · friendly fire';
  a.push(['Neutron payload',status+' · Select Babar to authorize launch.',()=>{},true]);
}
const arthurBikePortrait=new Image();
arthurBikePortrait.src='assets/roster/leaders.png';
function drawArthurMotorbike(c,u){
  c.save();if(Math.cos(u.angle)<0)c.scale(-1,1);
  c.strokeStyle='#131b18';c.lineWidth=5;
  for(const x of [-20,20]){c.fillStyle='#202824';c.beginPath();c.arc(x,4,12,0,Math.PI*2);c.fill();c.strokeStyle='#a3a898';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(x-7,4);c.lineTo(x+7,4);c.stroke();}
  c.strokeStyle='#728876';c.lineWidth=5;c.beginPath();c.moveTo(-20,4);c.lineTo(-8,-16);c.lineTo(8,-14);c.lineTo(20,4);c.lineTo(-20,4);c.stroke();
  c.fillStyle='#374a3c';c.fillRect(-12,-22,27,12);
  c.strokeStyle='#c0b48b';c.lineWidth=3;c.beginPath();c.moveTo(19,3);c.lineTo(14,-29);c.lineTo(7,-31);c.stroke();
  c.fillStyle='#dad0a2';c.fillRect(16,-22,7,7);
  c.fillStyle='#826747';c.fillRect(-29,-21,13,16);
  const art=typeof CHARACTER_ART!=='undefined'?CHARACTER_ART.arthur:null;
  if(art&&arthurBikePortrait.complete&&arthurBikePortrait.naturalWidth){
    c.drawImage(arthurBikePortrait,...art.portrait,-18,-59,34,36);
  }else{c.fillStyle='#9ba29a';c.beginPath();c.ellipse(-3,-38,12,16,0,0,Math.PI*2);c.fill();}
  c.restore();c.fillStyle='#eee0be';c.font='bold 10px monospace';c.textAlign='center';c.fillText('ARTHUR',0,-65);c.textAlign='left';
}
