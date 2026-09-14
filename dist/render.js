'use strict';
const spriteSheet=new Image(),buildingSheet=new Image();
spriteSheet.src='assets/characters.png';buildingSheet.src='assets/buildings.png';
const fog=document.createElement('canvas'),fc=fog.getContext('2d');
const terrain=[];let seed=13;
function seeded(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
for(let i=0;i<850;i++)terrain.push({x:seeded()*W,y:seeded()*H,r:seeded()*5+1,c:seeded()});
function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
function atlas(image,col,row,x,y,w,h,building=false){
  if(!image.complete||!image.naturalWidth)return false;
  const xs=building?[0,320,635,980,1254]:[0,335,635,935,1254];
  const ys=building?[0,610,1254]:[80,640,1200];
  const scale=image.naturalWidth/1254;
  ctx.drawImage(image,xs[col]*scale,ys[row]*scale,(xs[col+1]-xs[col])*scale,(ys[row+1]-ys[row])*scale,x,y,w,h);return true;
}
function drawUnit(u){
  const d=defs[u.type],color=u.team?RED:BLUE;
  ctx.save();ctx.translate(u.x,u.y);ctx.globalAlpha=u.construction?.65:1;
  ctx.fillStyle='#1e321e33';ctx.beginPath();ctx.ellipse(0,6,u.r*1.25,u.r*.65,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=selected.includes(u)?3:1.5;ctx.beginPath();ctx.ellipse(0,3,u.r+5,(u.r+5)*.6,0,0,Math.PI*2);ctx.stroke();
  if(selected.includes(u)){ctx.fillStyle='#d7edc827';ctx.fill();}
  if(d.speed){
    const height=u.type==='hero'?80:u.type==='walker'?73:59,width=height*.61;
    const bob=u.order?Math.sin(t*9+u.id)*2:Math.sin(t*2+u.id)*.4;
    ctx.save();if(Math.cos(u.angle)<0)ctx.scale(-1,1);
    const col={hero:0,worker:1,trooper:2,walker:3}[u.type];
    if(!atlas(spriteSheet,col,u.team,-width/2,-height+15+bob,width,height)){ctx.font='32px serif';ctx.textAlign='center';ctx.fillText(u.team?'🦏':'🐘',0,0);}
    ctx.restore();
    if(u.type==='worker'&&u.carrying){ctx.font='14px serif';ctx.fillText('🍎',13,-32);}
    if(u.type==='hero'){ctx.fillStyle='#fff6d6';ctx.strokeStyle='#20392b';ctx.lineWidth=3;ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.strokeText(u.name,0,-height-7);ctx.fillText(u.name,0,-height-7);ctx.textAlign='left';}
  }else{
    const col=u.type==='turret'?3:u.type==='core'?0:u.type==='forge'?1:u.type==='factory'?2:3;
    const row=u.type==='turret'?1:u.team;
    const height=u.type==='core'?150:u.type==='factory'?126:u.type==='forge'?113:94;
    if(!atlas(buildingSheet,col,row,-height*.49,-height+29,height*.98,height,true)){ctx.font='40px serif';ctx.textAlign='center';ctx.fillText(u.type==='core'?'🏰':'🏠',0,0);}
  }
  ctx.globalAlpha=1;
  if(u.hp<u.max||selected.includes(u)||u.construction){const y=d.speed?18:32;ctx.fillStyle='#293c2d';ctx.fillRect(-u.r,y,u.r*2,5);ctx.fillStyle=u.hp/u.max<.3?'#e78872':color;ctx.fillRect(-u.r,y,u.r*2*Math.max(0,u.hp/u.max),5);}
  if(u.queue.length||u.construction){ctx.fillStyle='#394331';ctx.fillRect(-u.r,41,u.r*2,4);ctx.fillStyle='#efca6c';ctx.fillRect(-u.r,41,u.r*2*(u.construction?1-u.construction/(u.buildDuration||d.build):u.progress/defs[u.queue[0]].time),4);}
  ctx.restore();
}
function draw(){
  const cw=canvas.clientWidth,ch=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(cw*dpr)||canvas.height!==Math.round(ch*dpr)){canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#263e30';ctx.fillRect(0,0,cw,ch);
  ctx.translate(cw/2,ch/2);ctx.scale(cam.zoom,cam.zoom);ctx.translate(-cam.x,-cam.y);
  ctx.fillStyle='#8eaf6b';ctx.fillRect(0,0,W,H);
  poly([[0,440],[360,420],[720,580],[1120,820],[1510,970],[1800,930],[1800,1060],[1510,1080],[1100,925],[665,690],[325,530],[0,570]],'#b4bd83');
  ctx.strokeStyle='#d1c499';ctx.lineWidth=52;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(320,900);ctx.bezierCurveTo(750,1020,900,300,1460,280);ctx.stroke();ctx.lineCap='butt';
  for(const p of terrain){ctx.fillStyle=p.c>.5?'#e3dbac25':'#416a4028';ctx.fillRect(p.x,p.y,p.r*2,p.r);}
  ctx.textAlign='center';ctx.font='italic 26px Georgia';ctx.fillStyle='#305b3f55';ctx.fillText('The Great Forest',825,675);ctx.font='bold 20px Georgia';ctx.fillStyle='#2b5a47';ctx.fillText('CELESTEVILLE',345,1160);ctx.fillStyle='#643d36';ctx.fillText('RHINOLAND',1440,70);ctx.textAlign='left';
  for(const n of nodes){if(n.amount<=0)continue;ctx.fillStyle='#47704433';ctx.beginPath();ctx.ellipse(n.x,n.y+12,26,15,0,0,Math.PI*2);ctx.fill();ctx.font='38px serif';ctx.textAlign='center';ctx.fillText('🌳',n.x,n.y+5);ctx.font='16px serif';ctx.fillText('🍎',n.x+13,n.y+15);ctx.textAlign='left';}
  if(fog.width!==cw||fog.height!==ch){fog.width=cw;fog.height=ch;}fc.clearRect(0,0,cw,ch);
  if(t>=revealUntil){fc.fillStyle='#183427bd';fc.fillRect(0,0,cw,ch);fc.globalCompositeOperation='destination-out';for(const u of alive(0)){const p=screen(u);fc.beginPath();fc.arc(p.x,p.y,vision(u)*cam.zoom,0,Math.PI*2);fc.fill();}fc.globalCompositeOperation='source-over';ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.drawImage(fog,0,0);ctx.restore();}
  for(const u of units.filter(u=>!defs[u.type].speed||visible(u)).sort((a,b)=>a.y-b.y)){ctx.save();if(u.team&&!visible(u))ctx.globalAlpha=.42;drawUnit(u);ctx.restore();}
  for(const u of selected){if(u.order&&defs[u.type].speed){const q=u.order.node||u.order.target||u.order;if(Number.isFinite(q.x)){ctx.strokeStyle='#f5ebc77a';ctx.lineWidth=1.5;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(u.x,u.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);}}}
  for(const f of fx){ctx.globalAlpha=f.life/f.max;if(f.burst){ctx.font=(f.r+22)+'px serif';ctx.fillText('✦',f.x-10,f.y);}
    else if(f.ring){ctx.strokeStyle='#fff1ae';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,(1-f.life/f.max)*40+5,0,Math.PI*2);ctx.stroke();}
    else{const p=1-f.life/f.max;ctx.fillStyle=f.team?'#d78768':'#f7e694';ctx.beginPath();ctx.arc(f.x+(f.tx-f.x)*p,f.y+(f.ty-f.y)*p-Math.sin(p*Math.PI)*14,4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
  if(placing){const p=world(pointer),r=defs[placing].r;ctx.strokeStyle=validBuild(p,placing)?'#edffd7':'#f16855';ctx.fillStyle=validBuild(p,placing)?'#edffd735':'#f1685535';ctx.fillRect(p.x-r,p.y-r,r*2,r*2);ctx.strokeRect(p.x-r,p.y-r,r*2,r*2);}
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(down&&!down.pan&&!mode&&!placing){ctx.strokeStyle='#ffe9a7';ctx.fillStyle='#ffe9a722';ctx.fillRect(down.x,down.y,pointer.x-down.x,pointer.y-down.y);ctx.strokeRect(down.x,down.y,pointer.x-down.x,pointer.y-down.y);}
  if(paused){ctx.fillStyle='#18332760';ctx.fillRect(0,0,cw,ch);ctx.fillStyle='#fff3d1';ctx.font='bold 28px Georgia';ctx.textAlign='center';ctx.fillText('Adventure paused',cw/2,ch/2);ctx.textAlign='left';}
  mc.fillStyle='#698657';mc.fillRect(0,0,300,210);mc.fillStyle='#c3bb8b';mc.beginPath();mc.moveTo(50,150);mc.lineTo(242,46);mc.lineTo(248,54);mc.lineTo(58,158);mc.fill();
  for(const n of nodes){if(n.amount<=0)continue;mc.fillStyle='#e8b058';mc.fillRect(n.x/W*300-2,n.y/H*210-2,4,4);}
  for(const u of units){if(u.team&&defs[u.type].speed&&!visible(u))continue;mc.fillStyle=u.team?'#c95850':'#e0f2b1';const s=u.type==='hero'?6:defs[u.type].speed?3:7;mc.fillRect(u.x/W*300-s/2,u.y/H*210-s/2,s,s);}
  mc.strokeStyle='#fff1bc';mc.lineWidth=1.5;mc.strokeRect((cam.x-cw/2/cam.zoom)/W*300,(cam.y-ch/2/cam.zoom)/H*210,cw/cam.zoom/W*300,ch/cam.zoom/H*210);
}
function loop(now){
  const dt=Math.min((now-last)/1000||0,.05);last=now;
  if(running&&!paused&&!ended){const pan=420*dt/cam.zoom;if(keys.ArrowLeft)cam.x-=pan;if(keys.ArrowRight)cam.x+=pan;if(keys.ArrowUp)cam.y-=pan;if(keys.ArrowDown)cam.y+=pan;cam.x=clamp(cam.x,0,W);cam.y=clamp(cam.y,0,H);update(dt);}
  draw();requestAnimationFrame(loop);
}
function positionMinimap(){const narrow=window.innerWidth<=580;const parent=narrow?document.querySelector('.field'):document.querySelector('aside');if(mini.parentElement!==parent){if(narrow)parent.appendChild(mini);else parent.insertBefore(mini,document.querySelector('.selection'));}}
window.addEventListener('resize',positionMinimap);positionMinimap();reset();requestAnimationFrame(loop);
