'use strict';
// Cache the expensive atlas downsample at the current physical display scale.
// Bound retained RGBA surfaces to ~12 MiB and preserve every inspected crop.
const spriteRasterCache=new Map();
let spriteRasterPixels=0;
function crispSprite(context,image,sx,sy,sw,sh,dx,dy,dw,dh){
  const transform=context.getTransform?.();
  if(!transform){context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);return;}
  const scale=Math.min(4,Math.max(.5,Math.ceil(Math.hypot(transform.a,transform.b)*4)/4));
  const width=Math.max(1,Math.ceil(Math.abs(dw)*scale)),height=Math.max(1,Math.ceil(Math.abs(dh)*scale));
  const key=[image.src,sx,sy,sw,sh,width,height].join(':');
  let raster=spriteRasterCache.get(key);
  if(!raster){
    raster=document.createElement('canvas');raster.width=width;raster.height=height;
    const c=raster.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.filter='contrast(1.06)';c.drawImage(image,sx,sy,sw,sh,0,0,width,height);
    spriteRasterCache.set(key,raster);spriteRasterPixels+=width*height;
    while(spriteRasterPixels>3000000 && spriteRasterCache.size>1){
      const oldest=spriteRasterCache.keys().next().value,old=spriteRasterCache.get(oldest);
      spriteRasterPixels-=old.width*old.height;spriteRasterCache.delete(oldest);
    }
  }else{spriteRasterCache.delete(key);spriteRasterCache.set(key,raster);}
  context.drawImage(raster,dx,dy,dw,dh);
}
function battlefieldPixelRatio(width,height,ratio=devicePixelRatio||1){
  return Math.max(1,Math.min(ratio,3,Math.sqrt(3000000/Math.max(1,width*height))));
}
function unitInViewport(u,width=canvas.clientWidth,height=canvas.clientHeight){
  if(u.hp<=0)return false;
  if(selected.includes(u))return true; // Preserve selected artillery range indicators.
  const p=renderedPosition(u),margin=180;
  return Math.abs(p.x-cam.x)<=width/(2*cam.zoom)+margin && Math.abs(p.y-cam.y)<=height/(2*cam.zoom)+margin;
}

const spriteSheet = new Image(),
  buildingSheet = new Image(), infantrySheet = new Image(), infantryWalkSheet = new Image();
spriteSheet.src = 'assets/characters-siege.png';
buildingSheet.src = 'assets/buildings-siege.png';
infantrySheet.src = 'assets/infantry-directions.png';
infantryWalkSheet.src = 'assets/infantry-walk.png';
// Hand-inspected alpha bounds plus transparent margins: generated columns are irregular.
const infantryFrames = [
  [[38,142,290,501],[339,142,302,498],[643,142,280,500],[935,138,293,503]],
  [[23,702,309,461],[336,701,298,461],[636,705,291,457],[938,701,299,461]]
];
// Two inspected poses per direction: stride and passing, not a full eight-frame gait.
const infantryWalkFrames = [
 [ [[108,89,170,246],[409,89,173,245],[687,89,167,247],[981,90,170,245]],
   [[114,389,173,251],[404,386,180,254],[677,390,172,250],[975,388,176,253]] ],
 [ [[101,693,180,228],[402,692,186,230],[682,693,180,228],[975,692,187,231]],
   [[108,962,179,232],[407,962,182,230],[680,962,179,232],[975,962,187,235]] ]
];
function infantryWalkPhase(u, minimizeMotion = reducedMotion) {
  return minimizeMotion || !(u.movingUntil>t) ? null : Math.floor((u.walkDistance||0)/14)%2;
}
function infantryDirection(angle) {return ((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;}
function drawDirectionalInfantry(u,bob) {
  if(!['trooper','scout','sapper'].includes(u.type)||!infantrySheet.complete||!infantrySheet.naturalWidth)return false;
  const phase=infantryWalkPhase(u),walking=phase!==null&&infantryWalkSheet.complete&&infantryWalkSheet.naturalWidth;
  const [x,y,w,h]=walking?infantryWalkFrames[u.team][phase][infantryDirection(u.angle)]:infantryFrames[u.team][infantryDirection(u.angle)];
  const height=52,width=height*w/h;
  crispSprite(ctx,walking?infantryWalkSheet:infantrySheet,x,y,w,h,-width/2,15-height+(walking?0:bob),width,height);
  return true;
}
const fog = document.createElement('canvas'),
  fc = fog.getContext('2d');
const terrain = [];
let seed = 13;
function seeded() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
for (let i = 0; i < 850; i++)
  terrain.push({ x: seeded() * W, y: seeded() * H, r: seeded() * 5 + 1, c: seeded() });
function poly(points, fill, stroke) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
function atlas(image, col, row, x, y, w, h, building = false) {
  if (!image.complete || !image.naturalWidth) return false;
  const xs = building ? [0, 326, 632, 982, 1254] : [0, 335, 635, 935, 1254];
  const ys = building ? [0, 610, 1254] : [70, 642, 1210];
  const scale = image.naturalWidth / 1254;
  crispSprite(ctx,
    image,
    xs[col] * scale,
    ys[row] * scale,
    (xs[col + 1] - xs[col]) * scale,
    (ys[row + 1] - ys[row]) * scale,
    x,
    y,
    w,
    h
  );
  return true;
}
// Original Canvas field camp: canvas roof, timber office and faction command flag.
const oldLadySheet=new Image();oldLadySheet.src='assets/roster/allies.png';
function drawOldLady(u){
  ctx.save();if(Math.cos(u.angle)<0)ctx.scale(-1,1);
  ctx.fillStyle='#505c42';ctx.fillRect(-23,-43,13,30);
  if(oldLadySheet.complete&&oldLadySheet.naturalWidth)crispSprite(ctx,oldLadySheet,1115,576,264,443,-22,-66,43,72);
  ctx.strokeStyle='#191f1b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,-23);ctx.quadraticCurveTo(-5,8,10,-21);ctx.stroke();
  ctx.fillStyle='#383e35';ctx.fillRect(6,-27,26,6);ctx.fillStyle='#bfa165';ctx.fillRect(28,-28,7,8);
  ctx.restore();
  ctx.fillStyle='#f2e2b9';ctx.font='bold 11px Georgia';ctx.textAlign='center';ctx.fillText('The Old Lady',0,-73);ctx.textAlign='left';
}
function drawFlame(f){
  ctx.save();ctx.translate(f.x,f.y-24);ctx.rotate(f.angle);
  for(let i=0;i<7;i++){
    const x=20+i*12,w=6+i*1.8;
    ctx.fillStyle=i%2?'#ffb741':'#e66d24';ctx.beginPath();ctx.ellipse(x,0,w,w*.75,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffe7a0';ctx.beginPath();ctx.ellipse(x,-1,w*.6,w*.35,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
// Local vector resource sprites stay sharp at device resolution and every zoom level.
const resourceSprites=Object.fromEntries(['supplies','materials','uranium'].map(kind=>{
  const image=new Image();image.src='assets/resources/'+kind+'.svg';return [kind,image];
}));
function drawResourceSprite(n,showWork){
  const kind=n.kind||'supplies',image=resourceSprites[kind];
  if(image?.complete&&image.naturalWidth)ctx.drawImage(image,n.x-36,n.y-35,72,54);
  else {ctx.fillStyle=kind==='materials'?'#91aeb8':kind==='uranium'?'#b9ab62':'#c3a069';ctx.fillRect(n.x-20,n.y-18,40,30);}
  const label=resourceName(n).toUpperCase()+' '+resourceLabel(n);
  ctx.save();ctx.font='bold 11px monospace';ctx.textAlign='center';
  const width=ctx.measureText(label).width+10;
  ctx.fillStyle='#101b18e8';ctx.fillRect(n.x-width/2,n.y+22,width,17);
  ctx.strokeStyle=kind==='materials'?'#8baab5':kind==='uranium'?'#c3af58':'#b99a65';ctx.lineWidth=1;
  ctx.strokeRect(n.x-width/2,n.y+22,width,17);
  ctx.fillStyle='#f1e8d0';ctx.fillText(label,n.x,n.y+34);ctx.restore();
  if(showWork&&resourceObserved(n))drawResourceWork(n,n.y+51);
}
function drawTrench(team){
  // Dug earth, traverses, duckboards and sandbag parapet; original local Canvas art.
  ctx.fillStyle='#594b37';ctx.beginPath();ctx.moveTo(-68,-29);ctx.lineTo(-49,-40);ctx.lineTo(-16,-34);ctx.lineTo(20,-41);ctx.lineTo(65,-31);ctx.lineTo(69,25);ctx.lineTo(38,40);ctx.lineTo(1,34);ctx.lineTo(-35,40);ctx.lineTo(-68,28);ctx.closePath();ctx.fill();
  ctx.fillStyle='#1c211b';ctx.fillRect(-57,-27,114,54);
  ctx.strokeStyle='#92764e';ctx.lineWidth=4;ctx.strokeRect(-57,-27,114,54);
  ctx.strokeStyle='#65543d';ctx.lineWidth=3;
  for(let x=-51;x<54;x+=10){ctx.beginPath();ctx.moveTo(x,-9);ctx.lineTo(x,9);ctx.stroke();}
  ctx.fillStyle='#81724f';
  for(let x=-60;x<60;x+=18){for(const y of [-32,32]){ctx.beginPath();ctx.ellipse(x+7,y,8,4,.1,0,Math.PI*2);ctx.fill();}}
  ctx.fillStyle='#4b4230';ctx.fillRect(-21,-27,12,21);ctx.fillRect(20,6,12,21);
  ctx.fillStyle=team?'#a66565':'#85a485';ctx.fillRect(-64,-5,6,10);
}
function drawHeadquarters(team) {
  ctx.fillStyle='#34392e';ctx.fillRect(-38,-4,76,30);
  ctx.fillStyle='#8b8464';ctx.beginPath();ctx.moveTo(-46,-4);ctx.lineTo(0,-72);ctx.lineTo(46,-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#c4b789';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#282d26';ctx.fillRect(-10,-4,20,30);
  ctx.fillStyle='#b6a57b';ctx.fillRect(-33,4,15,9);ctx.fillRect(18,4,15,9);
  ctx.strokeStyle='#b6a57b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(32,15);ctx.lineTo(32,-79);ctx.stroke();
  ctx.fillStyle=team?'#863f48':'#395c41';ctx.fillRect(32,-79,28,19);
  ctx.fillStyle='#eee0b1';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('HQ',46,-66);ctx.textAlign='left';
}
function drawRememberedBuilding(k) {
  const col=k.type==='core'?0:k.type==='forge'?1:k.type==='factory'?2:3;
  const h=k.type==='core'?150:k.type==='factory'?126:k.type==='forge'?113:94;
  ctx.save();ctx.translate(k.x,k.y);ctx.globalAlpha=.38;
  if(k.type==='trench')drawTrench(1);
  else if(k.type==='headquarters')drawHeadquarters(1);
  else if(k.type!=='quarry')atlas(buildingSheet,col,1,-h*.49,-h+29,h*.98,h,true);
  ctx.globalAlpha=.7;ctx.strokeStyle='#b9a2a0';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);
  const r=defs[k.type].r;ctx.strokeRect(-r,-r,r*2,r*2);ctx.setLineDash([]);
  ctx.fillStyle='#e0ccbb';ctx.font='10px monospace';ctx.textAlign='center';
  ctx.fillText('LAST SEEN '+time(t-k.seen)+' AGO',0,46);ctx.restore();
}
function drawUnit(u) {
  if((u.smokeUntil||0)>t){
    ctx.save();ctx.fillStyle='#afb6aa';ctx.globalAlpha=.18;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(u.x+(i-1)*14,u.y+6,u.r+8,u.r*.8,0,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  if((u.heavyRoundsUntil||0)>t){
    ctx.fillStyle='#f0b85a';for(let i=0;i<3;i++)ctx.fillRect(u.x-7+i*5,u.y-u.r-14,3,7);
  }
  if (u.type === 'walker' && selected.includes(u)) {
    ctx.save(); ctx.setLineDash([7, 7]); ctx.lineWidth = 1;
    ctx.strokeStyle = '#d5c48c80'; ctx.beginPath();
    ctx.arc(u.x, u.y, weaponRange(u), 0, Math.PI * 2); ctx.stroke();
    if (u.deployed) { ctx.strokeStyle = '#d8796980'; ctx.beginPath(); ctx.arc(u.x, u.y, SIEGE.minimum, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  if ((u.disciplineUntil || 0) > t || (u.advanceUntil || 0) > t) {
    ctx.strokeStyle = (u.disciplineUntil || 0) > t ? '#dbc889' : '#d67d73';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(u.x, u.y + 4, u.r + 9, (u.r + 9) * .5, 0, 0, Math.PI * 2); ctx.stroke();
  }
  if(rapidActive(u)){
    ctx.strokeStyle='#e6c06a';ctx.lineWidth=2;ctx.beginPath();
    ctx.ellipse(u.x,u.y+5,u.r+8,(u.r+8)*.6,0,0,Math.PI*2);ctx.stroke();
  }
  if(u.type==='shelter'&&!u.construction&&(selected.includes(u)||atomicStrikes.length)){
    ctx.strokeStyle=u.team?RED:BLUE;ctx.lineWidth=1;ctx.setLineDash([5,5]);
    ctx.beginPath();ctx.arc(u.x,u.y,110,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  }
  const d = defs[u.type],
    color = u.team ? RED : BLUE;
  ctx.save();
  const rendered=renderedPosition(u);
  ctx.translate(rendered.x, rendered.y);
  ctx.globalAlpha = u.construction ? 0.65 : 1;
  ctx.fillStyle = '#10181288';
  ctx.beginPath();
  ctx.ellipse(0, 6, u.r * 1.25, u.r * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = selected.includes(u) ? 3 : 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 3, u.r + 5, (u.r + 5) * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (selected.includes(u)) {
    ctx.fillStyle = '#d7edc827';
    ctx.fill();
  }
  if(u.type==='madame')drawOldLady(u);
  else if(u.type==='bike')drawArthurMotorbike(ctx,u);
  else if (d.speed) {
    const height = u.type === 'hero' ? 80 : u.type === 'walker' ? 73 : 59,
      width = height * 0.61;
    const bob = !reducedMotion && u.movingUntil > t ? Math.sin(t * 9 + u.id) * 1.1 : 0;
    ctx.save();
    const directional=drawCommanderSprite(ctx,u,t,reducedMotion) || drawDirectionalInfantry(u,bob);
    if (!directional) {
      if (Math.cos(u.angle) < 0) ctx.scale(-1, 1);
      const col = { hero: 0, worker: 1, trooper: 2, walker: 3, scout: 2, sapper: 2 }[u.type];
      if (!atlas(spriteSheet, col, u.team, -width / 2, -height + 15 + bob, width, height)) {
        ctx.fillStyle = color;
        ctx.fillRect(-10, -30,20,32);
      }
    }
    if (u.type === 'sapper') {
      // Reuse the faction infantry atlas, adding a distinct brass demolition pack.
      ctx.fillStyle='#333a36';ctx.fillRect(-17,-23,12,16);
      ctx.strokeStyle='#ddbc71';ctx.lineWidth=2;ctx.strokeRect(-17,-23,12,16);
      ctx.beginPath();ctx.moveTo(-15,-20);ctx.lineTo(-7,-10);ctx.moveTo(-7,-20);ctx.lineTo(-15,-10);ctx.stroke();
    }
    ctx.restore();
    // Direction indicator and physical field gun rotate with the firing bearing.
    ctx.save();
    ctx.rotate(u.angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(u.r + 3, 0);
    ctx.lineTo(u.r + 10, 0);
    ctx.stroke();
    if (u.type === 'walker') {
      if (artilleryLocked(u)) {
        ctx.strokeStyle = '#b7a783'; ctx.lineWidth = 5;
        for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-6, sign * 7); ctx.lineTo(-25, sign * 26); ctx.stroke(); }
        ctx.fillStyle = '#494638'; ctx.fillRect(-30, -30, 12, 8); ctx.fillRect(-30, 22, 12, 8);
      }
      ctx.fillStyle = '#252c29';
      ctx.fillRect(-8, -9, 30, 18);
      ctx.fillStyle = '#736c51';
      ctx.fillRect(0, -4, 38, 8);
      ctx.fillStyle = '#171c19';
      ctx.fillRect(-6, -14, 13, 5);
      ctx.fillRect(-6, 9, 13, 5);
    }
    if(shotgunEquipped(u)){
      ctx.fillStyle='#78543b';ctx.fillRect(5,-3,13,6);
      ctx.fillStyle='#b3b8af';ctx.fillRect(16,-4,17,3);ctx.fillRect(16,1,17,3);
      ctx.fillStyle='#151b18';ctx.fillRect(31,-4,3,8);
    }
    if (u.type !== 'hero' && t - (u.firedAt ?? -10) < 0.12) {
      ctx.fillStyle = '#e4c47e';
      ctx.beginPath();
      ctx.arc(u.type === 'walker' ? 40 : 24, 0, u.type === 'walker' ? 7 : 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (u.movingUntil > t && !reducedMotion) {
      ctx.fillStyle = '#b29c6925';
      ctx.beginPath();
      ctx.ellipse(-Math.cos(u.angle) * 18, 8, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (u.type === 'walker' && artilleryLocked(u)) {
      ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#eee3bd'; ctx.strokeStyle = '#202b25'; ctx.lineWidth = 3;
      const label = u.artilleryTransition ? (u.artilleryTransition.deploy ? 'DEPLOY ' : 'PACK ') + Math.ceil(u.artilleryTransition.until - t) + 's' : 'SIEGE';
      ctx.strokeText(label, 0, -72); ctx.fillText(label, 0, -72); ctx.textAlign = 'left';
    }
    if (u.type === 'scout') {
      ctx.strokeStyle = '#dfd6ad';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -55);
      ctx.lineTo(5, -55);
      ctx.stroke();
    }
    if (u.type === 'worker' && u.carrying) {
      ctx.fillStyle = u.cargoKind === 'uranium' ? '#b7ad62' : u.cargoKind === 'materials' ? '#97b4bb' : '#ac9062';
      ctx.fillRect(12, -27, 10, 8);
      ctx.strokeStyle = '#332f25';
      ctx.strokeRect(12, -27, 10, 8);
    }
    if (u.type === 'hero') {
      ctx.fillStyle = '#fff6d6';
      ctx.strokeStyle = '#20392b';
      ctx.lineWidth = 3;
      ctx.font = 'bold 12px Georgia';
      ctx.textAlign = 'center';
      ctx.strokeText(u.name, 0, -height - 7);
      ctx.fillText(u.name, 0, -height - 7);
      ctx.textAlign = 'left';
    }
  } else {
    const col =
      u.type === 'turret'
        ? 3
        : u.type === 'core'
          ? 0
          : u.type === 'forge'
            ? 1
            : u.type === 'factory'
              ? 2
              : 3;
    const row = u.type === 'turret' ? 1 : u.team;
    const height =
      u.type === 'core' ? 150 : u.type === 'factory' ? 126 : u.type === 'forge' ? 113 : 94;
    if(u.type==='trench')drawTrench(u.team);
    else if(['silo','interceptor'].includes(u.type))drawMissileBuilding(ctx,u);
    else if(u.type==='shelter'){
      // Concrete bunker, reinforced entrance and civil-defense triangle.
      ctx.fillStyle='#444c46';ctx.fillRect(-37,-29,74,49);
      ctx.fillStyle='#899083';ctx.beginPath();ctx.moveTo(-42,-29);ctx.lineTo(-28,-49);ctx.lineTo(27,-49);ctx.lineTo(42,-29);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#bdbaa0';ctx.lineWidth=3;ctx.strokeRect(-37,-29,74,49);
      ctx.fillStyle='#151d1a';ctx.fillRect(-12,-14,24,34);
      ctx.fillStyle='#d9ab62';ctx.beginPath();ctx.moveTo(0,-42);ctx.lineTo(-9,-27);ctx.lineTo(9,-27);ctx.closePath();ctx.fill();
      ctx.fillStyle=color;ctx.fillRect(-34,15,18,5);ctx.fillRect(16,15,18,5);
      ctx.fillStyle='#eee0be';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('CIVIL DEFENSE',0,34);ctx.textAlign='left';
    }
    else if(u.type==='headquarters')drawHeadquarters(u.team);
    else if (u.type === 'quarry') {
      // Local procedural extraction machinery, distinct from supply homes.
      ctx.fillStyle = '#697b7d'; ctx.fillRect(-29, -9, 58, 25);
      ctx.strokeStyle = '#c3b795'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-21, 8); ctx.lineTo(-5, -67); ctx.lineTo(21, 8); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5,-67); ctx.lineTo(26,-52); ctx.lineTo(26,-18); ctx.stroke();
      ctx.fillStyle = '#9caeb2'; ctx.fillRect(17,-18,18,15);
      ctx.fillStyle = color; ctx.fillRect(-24, 11, 48, 4);
    } else if (
      !atlas(buildingSheet, col, row, -height * 0.49, -height + 29, height * 0.98, height, true)
    ) {
      ctx.fillStyle = color;
      ctx.fillRect(-u.r, -u.r, u.r * 2, u.r * 2);
    }
  }
  ctx.globalAlpha = 1;
  if (!d.speed && u.hp / u.max < 0.7) {
    ctx.strokeStyle = '#26251f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-u.r * 0.7, -23);
    ctx.lineTo(-5, -10);
    ctx.lineTo(-12, 0);
    ctx.lineTo(8, 17);
    ctx.stroke();
    if (u.hp / u.max < 0.35) {
      ctx.fillStyle = '#22251f';
      poly([[-u.r*.45,20],[-u.r*.4,-3],[-8,-8],[-2,0],[5,-5],[u.r*.25,9],[u.r*.3,24]],'#1e211d','#76664a');
      for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#80765e':'#464638';ctx.fillRect(-u.r*.5+i*7,20+(i%3)*3,5,4);}
    }
    for (let i = 0; i < 4; i++) {
      const phase = reducedMotion ? 0.4 : (t * 0.23 + i * 0.25) % 1;
      ctx.fillStyle = '#20272270';
      ctx.beginPath();
      ctx.arc(10 + Math.sin(i * 4) * 8, -40 - phase * 55, 6 + phase * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (d.speed && (u.morale < 80 || selected.includes(u))) {
    ctx.fillStyle = '#30392e';
    ctx.fillRect(-u.r, 25, u.r * 2, 3);
    ctx.fillStyle = u.morale < 45 ? '#c78660' : '#c4ae74';
    ctx.fillRect(-u.r, 25, (u.r * 2 * u.morale) / 100, 3);
  }
  if (!d.speed && !supplied(u) && !u.construction) {
    ctx.fillStyle = '#d39b6b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ISOLATED', 0, 55);
  }
  ctx.globalAlpha = 1;
  if (u.hp < u.max || selected.includes(u) || u.construction) {
    const y = d.speed ? 18 : 32;
    ctx.fillStyle = '#293c2d';
    ctx.fillRect(-u.r, y, u.r * 2, 5);
    ctx.fillStyle = u.hp / u.max < 0.3 ? '#e78872' : color;
    ctx.fillRect(-u.r, y, u.r * 2 * Math.max(0, u.hp / u.max), 5);
  }
  if (u.queue.length || u.construction || u.research) {
    ctx.fillStyle = '#394331';
    ctx.fillRect(-u.r, 41, u.r * 2, 4);
    ctx.fillStyle = '#efca6c';
    ctx.fillRect(
      -u.r,
      41,
      u.r *
        2 *
        (u.construction
          ? 1 - u.construction / (u.buildDuration || d.build)
          : u.research ? u.research.progress / researchDefs[u.research.id].time : u.progress / defs[u.queue[0]].time),
      4
    );
  }
  if (u.research) {ctx.fillStyle='#e4cf91';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('RESEARCH',0,57);}
  ctx.restore();
}
function draw() {
  const cw = canvas.clientWidth,
    ch = canvas.clientHeight,
    dpr = battlefieldPixelRatio(cw,ch);
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#263e30';
  ctx.fillRect(0, 0, cw, ch);
  ctx.translate(cw / 2, ch / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);
  drawBattlefieldGround(ctx);
  for (const c of covers) {
    ctx.strokeStyle = '#b1a17a60';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 7; i++) {
      ctx.save();
      ctx.translate(c.x - 45 + i * 15, c.y - 20);
      ctx.rotate(-0.1);
      ctx.fillStyle = '#a39a74';
      ctx.fillRect(-7, -5, 14, 10);
      ctx.strokeStyle = '#595d42';
      ctx.strokeRect(-7, -5, 14, 10);
      ctx.restore();
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ddd1b0';
    ctx.fillText('COVER −35% DAMAGE', c.x - 60, c.y + 20);
  }
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px Georgia';
  ctx.fillStyle = '#d5c7a2';
  ctx.fillText('CELESTEVILLE', 345, 1160);
  ctx.fillStyle = '#cd9c88';
  ctx.fillText('RHINOLAND', 1440, 70);
  ctx.fillStyle = '#c7c5a177';
  ctx.font = 'italic 21px Georgia';
  ctx.fillText('Northern approach', 600, 365);
  ctx.fillText('Southern road', 610, 1150);
  ctx.textAlign = 'left';
  const showWork=selected.some(u=>u.type==='worker'||u.type==='quarry');
  for (const n of nodes) {
    if (knownResourceAmount(n,0) === 0) continue;
    drawResourceSprite(n,showWork);
  }
  ctx.fillStyle = '#373e30';
  ctx.fillRect(depot.x - 43, depot.y - 32, 86, 64);
  ctx.strokeStyle = depot.team === 0 ? BLUE : depot.team === 1 ? RED : '#c9b780';
  ctx.lineWidth = 3;
  ctx.strokeRect(depot.x - 43, depot.y - 32, 86, 64);
  ctx.fillStyle = '#9a8961';
  ctx.fillRect(depot.x - 26, depot.y - 14, 24, 28);
  ctx.fillRect(depot.x + 5, depot.y - 14, 24, 28);
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#efe0bb';
  ctx.textAlign = 'center';
  ctx.fillText('CENTRAL DEPOT', depot.x, depot.y - 43);
  ctx.fillText(
    depot.team === 0 ? (munitionsIncome()?'SECURED +2 S / +0.5 MU':'MUNITIONS INTERRUPTED') : depot.team === 1 ? 'RHINO SHIPMENTS' : 'HOLD 8s TO CAPTURE',
    depot.x,
    depot.y + 50
  );
  ctx.textAlign = 'left';
  if (depot.progress) {
    ctx.fillStyle = '#c6a665';
    ctx.fillRect(depot.x - 40, depot.y + 36, (80 * Math.abs(depot.progress)) / 8, 4);
  }
  if (placing || selected.some((u) => !defs[u.type].speed)) {
    const sites = alive(0).filter((u) => !defs[u.type].speed && !u.construction);
    for (let i = 0; i < sites.length; i++)
      for (let j = i + 1; j < sites.length; j++) {
        const a = sites[i],
          b = sites[j];
        if (dist(a, b) > 360) continue;
        const cut = alive(1).some(
          (e) =>
            defs[e.type].speed && defs[e.type].damage && sees(0, e) && segmentDistance(e, a, b) < 85
        );
        ctx.strokeStyle = cut ? '#c88760' : '#b1c29465';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 8]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
  }
  if (fog.width !== cw || fog.height !== ch) {
    fog.width = cw;
    fog.height = ch;
  }
  fc.clearRect(0, 0, cw, ch);
  if (t >= revealUntil) {
    fc.fillStyle = '#141c1fbd';
    fc.fillRect(0, 0, cw, ch);
    fc.globalCompositeOperation = 'destination-out';
    for (const u of alive(0)) {
      const p = screen(u);
      fc.beginPath();
      fc.arc(p.x, p.y, vision(u) * cam.zoom, 0, Math.PI * 2);
      fc.fill();
    }
    fc.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(fog, 0, 0);
    ctx.restore();
  }
  drawAtomicWarnings();
  for (const k of rememberedBuildings()) drawRememberedBuilding(k);
  for (const u of units.filter((u) => unitInViewport(u,cw,ch) && visible(u)).sort((a, b) => (a.type==='trench'?-1:0)-(b.type==='trench'?-1:0)||a.y-b.y)) {
    ctx.save();
    if (u.team && !visible(u)) ctx.globalAlpha = 0.42;
    drawUnit(u);
    ctx.restore();
  }
  for (const u of selected) {
    if (u.orders?.length) {
      const route = [u.order, ...u.orders].map(o => o?.node || o?.target || o).filter(q => Number.isFinite(q?.x));
      ctx.strokeStyle = '#d7ba7999'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(u.x, u.y);
      for (const q of route) ctx.lineTo(q.x, q.y);
      ctx.stroke(); ctx.setLineDash([]);
      for (const q of route) { ctx.beginPath(); ctx.arc(q.x, q.y, 5, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (u.order?.kind==='patrol' && u.order.returnPoint) {
      const a=u.order,b=u.order.returnPoint;
      ctx.strokeStyle='#9cc6aeaa';ctx.lineWidth=1.5;ctx.setLineDash([8,5]);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
      for(const p of [a,b]){ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.stroke();}
    }
    if (u.rally) {
      ctx.strokeStyle = '#d7ba79';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(u.rally.x, u.rally.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(u.rally.x, u.rally.y + 10); ctx.lineTo(u.rally.x, u.rally.y - 20);
      ctx.lineTo(u.rally.x + 16, u.rally.y - 14); ctx.lineTo(u.rally.x, u.rally.y - 8); ctx.stroke();
    }
    if (u.order && defs[u.type].speed) {
      const q = u.order.node || u.order.target || u.order;
      if (Number.isFinite(q.x)) {
        ctx.strokeStyle = '#f5ebc77a';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }
  for (const f of fx) {
    ctx.globalAlpha = f.life / f.max;
    if(f.flame){drawFlame(f);}
    else if (f.nuclearCloud) {
      drawMushroomCloud(ctx,f,reducedMotion);
    } else if (f.shellImpact) {
      drawShellImpact(ctx,f,reducedMotion);
    } else if (f.burst) {
      ctx.fillStyle = '#252a24';
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.r * (1.1 - (f.life / f.max) * 0.2), f.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      if (!reducedMotion) {
        ctx.fillStyle = '#a5a18b55';
        ctx.beginPath();
        ctx.arc(f.x, f.y - (1 - f.life / f.max) * 22, f.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (f.ring) {
      ctx.strokeStyle = '#fff1ae';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, (1 - f.life / f.max) * 40 + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const p = 1 - f.life / f.max;
      ctx.fillStyle = f.team ? '#d78768' : '#f7e694';
      ctx.beginPath();
      ctx.arc(
        f.x + (f.tx - f.x) * p,
        f.y + (f.ty - f.y) * p - Math.sin(p * Math.PI) * 14,
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (placing) {
    const p = world(pointer),
      r = defs[placing].r;
    ctx.strokeStyle = validBuild(p, placing) ? '#edffd7' : '#f16855';
    ctx.fillStyle = validBuild(p, placing) ? '#edffd735' : '#f1685535';
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (down && !down.pan && !mode && !placing) {
    ctx.strokeStyle = '#ffe9a7';
    ctx.fillStyle = '#ffe9a722';
    ctx.fillRect(down.x, down.y, pointer.x - down.x, pointer.y - down.y);
    ctx.strokeRect(down.x, down.y, pointer.x - down.x, pointer.y - down.y);
  }
  if (paused) {
    ctx.fillStyle = '#18332760';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff3d1';
    ctx.font = 'bold 28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('COMMAND PAUSED', cw / 2, ch / 2);
    ctx.textAlign = 'left';
  }
  mc.fillStyle = '#435340';
  mc.fillRect(0, 0, 300, 210);
  mc.fillStyle = '#c3bb8b';
  mc.beginPath();
  mc.moveTo(50, 150);
  mc.lineTo(242, 46);
  mc.lineTo(248, 54);
  mc.lineTo(58, 158);
  mc.fill();
  for (const o of obstacles) {
    mc.fillStyle = '#233d2c';
    mc.fillRect((o.x / W) * 300, (o.y / H) * 210, (o.w / W) * 300, (o.h / H) * 210);
  }
  mc.fillStyle = depot.team === 0 ? BLUE : depot.team === 1 ? RED : '#c9b780';
  mc.fillRect((depot.x / W) * 300 - 4, (depot.y / H) * 210 - 4, 8, 8);
  for (const n of nodes) {
    if (knownResourceAmount(n,0) === 0) continue;
    mc.fillStyle = n.kind==='uranium'?'#ded39a':n.kind==='materials'?'#97b4bb':'#e8b058';
    mc.fillRect((n.x / W) * 300 - 2, (n.y / H) * 210 - 2, 4, 4);
  }
  for (const k of rememberedBuildings()) {mc.strokeStyle='#b9a2a0';mc.lineWidth=1;mc.strokeRect(k.x/W*300-3,k.y/H*210-3,6,6);}
  for (const u of units) {
    if (u.team && !visible(u)) continue;
    mc.fillStyle = u.team ? '#c95850' : '#e0f2b1';
    const s = u.type === 'hero' ? 6 : defs[u.type].speed ? 3 : 7;
    mc.fillRect((u.x / W) * 300 - s / 2, (u.y / H) * 210 - s / 2, s, s);
  }
  for(const a of activeAttacks()){mc.strokeStyle='#ffb58c';mc.lineWidth=2;mc.beginPath();mc.arc(a.x/W*300,a.y/H*210,7,0,Math.PI*2);mc.stroke();}
  for(const s of atomicStrikes){mc.strokeStyle='#ffba77';mc.lineWidth=2;mc.beginPath();mc.arc(s.x/W*300,s.y/H*210,payloadSpec(s.kind).radius/W*300,0,Math.PI*2);mc.stroke();}
  mc.strokeStyle = '#fff1bc';
  mc.lineWidth = 1.5;
  mc.strokeRect(
    ((cam.x - cw / 2 / cam.zoom) / W) * 300,
    ((cam.y - ch / 2 / cam.zoom) / H) * 210,
    (cw / cam.zoom / W) * 300,
    (ch / cam.zoom / H) * 210
  );
}
function loop(now) {
  updateAudioMix();
  const elapsed=last===null?0:Math.max(0,(now-last)/1000||0);
  const dt=Math.min(elapsed,.05);
  last = now;
  if (running && !paused && !ended) {
    const pan = (420 * dt) / cam.zoom;
    if (keys.ArrowLeft) cam.x -= pan;
    if (keys.ArrowRight) cam.x += pan;
    if (keys.ArrowUp) cam.y -= pan;
    if (keys.ArrowDown) cam.y += pan;
    cam.x = clamp(cam.x, 0, W);
    cam.y = clamp(cam.y, 0, H);
    soundscape();
  }
  advanceSimulation(elapsed);
  draw();
  requestAnimationFrame(loop);
}
function positionMinimap() {
  const narrow =
    (document.body?.clientWidth || window.innerWidth) <= 950 ||
    (document.body?.clientHeight || window.innerHeight) <= 500;
  const parent = narrow ? document.querySelector('.field') : document.querySelector('aside');
  if (mini.parentElement !== parent) {
    if (narrow) parent.appendChild(mini);
    else parent.insertBefore(mini, document.querySelector('.selection'));
  }
}
window.addEventListener('resize', positionMinimap);
positionMinimap();
reset();
requestAnimationFrame(loop);

function drawResourceWork(n,y){
 const r=resourceWorkReport(n);
 ctx.font='9px monospace';ctx.fillStyle=r.state==='working'?'#e1ca82':'#e4b3a0';
 ctx.fillText(`${r.extracting}/${r.slots} extracting · ${r.assigned} assigned`,n.x-58,y);
 if(r.state!=='working')ctx.fillText(r.state==='isolated'?'SUPPLY CUT':r.state==='construction'?'BUILDING':r.state==='missing'?'QUARRY NEEDED':r.state.toUpperCase(),n.x-40,y+12);
}

function drawAtomicWarnings(){
  drawMissileFlights(ctx);
  if(mode==='neutron'&&atomicTargetSite?.hp>0){
    ctx.save();ctx.strokeStyle='#c6d298';ctx.lineWidth=2;ctx.setLineDash([6,6]);
    ctx.beginPath();ctx.arc(atomicTargetSite.x,atomicTargetSite.y,NEUTRON.range,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  for(const s of atomicStrikes){
    ctx.save();ctx.strokeStyle='#ffba77';ctx.lineWidth=3;ctx.setLineDash([9,6]);
    ctx.beginPath();ctx.arc(s.x,s.y,payloadSpec(s.kind).radius,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='#fff0cf';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText(payloadLabel(s.kind)+' IMPACT · '+Math.ceil(Math.max(0,s.at-t))+'s',s.x,s.y-payloadSpec(s.kind).radius-12);ctx.restore();
  }
}
