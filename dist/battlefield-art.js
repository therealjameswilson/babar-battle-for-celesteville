/* A cached ink-and-watercolor map; terrain geometry and collision stay unchanged. */
let battlefieldCache=null;
function drawBattlefieldGround(target){
 if(!battlefieldCache){
  battlefieldCache=document.createElement('canvas');battlefieldCache.width=W;battlefieldCache.height=H;
  const c=battlefieldCache.getContext('2d');
  // Decorative randomness is local to the one-time cache paint, never the simulation RNG.
  let ink=0x34174f91;
  const rnd=()=>((ink=(Math.imul(1664525,ink)+1013904223)>>>0)/4294967296);
  c.fillStyle='#dce0b7';c.fillRect(0,0,W,H);
  for(const p of terrain){
   c.fillStyle=p.c>.5?'#7e99600a':'#f8e5ae0d';
   for(const scale of [1,.73,.44]){
    c.beginPath();
    c.ellipse(p.x+3*(1-scale),p.y-5*(1-scale),(p.r*17+26)*scale,(p.r*9+13)*scale,p.c,0,Math.PI*2);
    c.fill();
   }
  }
  const roads=[[[320,900],[640,880],[1080,870],[1460,280]],[[320,900],[610,450],[1010,420],[1460,280]]];
  const roadEdges=roads.map(road=>road.slice(1).map(([x,y],i)=>{
   const [ax,ay]=road[i],dx=x-ax,dy=y-ay,d2=dx*dx+dy*dy;
   return {ax,ay,dx,dy,d2,length:Math.sqrt(d2)};
  })).flat();
  const nearRoad=(x,y,buffer)=>{
   for(const e of roadEdges){
    const t=Math.max(0,Math.min(1,((x-e.ax)*e.dx+(y-e.ay)*e.dy)/e.d2));
    if((x-e.ax-t*e.dx)**2+(y-e.ay-t*e.dy)**2<buffer*buffer)return true;
   }
   return false;
  };
  const roadPath=()=>{c.beginPath();for(const road of roads)road.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));};
  c.lineJoin='round';c.lineCap='round';
  // Shared paths avoid dark overlap at junctions. Shoulder texture does not imply cover.
  for(const [width,color] of [[74,'#8e985b29'],[68,'#97956b'],[64,'#e7d6ae'],[55,'#eee0b9']]){
   roadPath();c.lineWidth=width;c.strokeStyle=color;c.stroke();
  }
  c.lineWidth=1;
  for(const e of roadEdges)for(let step=8;step<e.length-8;step+=5+rnd()*9){
   const t=step/e.length,signed=(rnd()<.5?-1:1)*(28+rnd()*9);
   const x=e.ax+e.dx*t-e.dy/e.length*signed,y=e.ay+e.dy*t+e.dx/e.length*signed;
   if(nearRoad(x,y,26))continue;
   c.strokeStyle=rnd()<.5?'#7c795838':'#fff0c870';
   c.beginPath();c.moveTo(x,y);c.lineTo(x+(rnd()-.35)*7,y+(rnd()-.5)*4);c.stroke();
  }
  // A restrained two-tone paper grain, visible under zoom but quieter than unit outlines.
  const grains=Math.min(15000,Math.round(W*H/146));
  for(const shade of ['#6c603414','#ffffdc53']){
   c.fillStyle=shade;
   for(let i=0;i<grains/2;i++){const x=rnd()*W,y=rnd()*H,s=.45+rnd()*1.35;c.fillRect(x,y,s*1.45,s);}
  }
  c.lineWidth=.85;
  for(const p of terrain){
   // Keep the road and obstacle outlines uncluttered.
   if(rnd()<.28||nearRoad(p.x,p.y,42)||obstacles.some(o=>p.x>o.x-15&&p.x<o.x+o.w+15&&p.y>o.y-15&&p.y<o.y+o.h+15))continue;
   const size=.66+rnd()*.6;
   c.save();c.translate(p.x,p.y);c.scale(size,size);
   c.strokeStyle=p.c>.5?'#74835180':'#89946275';
   c.beginPath();c.moveTo(-2,1);c.quadraticCurveTo(-3,-3,-6,-5);
   c.moveTo(0,1);c.quadraticCurveTo(0,-4,2,-8);c.moveTo(2,1);c.quadraticCurveTo(4,-2,7,-3);c.stroke();
   if(rnd()<.15){
    c.fillStyle='#b0985d9a';c.beginPath();c.arc(2,-8,1.05,0,Math.PI*2);c.fill();
   }
   c.restore();
  }
  for(const o of obstacles){
   c.fillStyle='#88a878';c.fillRect(o.x,o.y,o.w,o.h);
   for(let y=o.y+12;y<o.y+o.h;y+=36)for(let x=o.x+14;x<o.x+o.w;x+=35){
    const variation=Math.sin(x*13+y*7);c.fillStyle='#e0ca98';c.strokeStyle='#465a39';c.lineWidth=1.5;
    c.fillRect(x-3,y,6,24);c.strokeRect(x-3,y,6,24);
    c.beginPath();
    for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,r=20+Math.sin(i*2.1+variation)*4;
     const px=x+Math.cos(a)*r,py=y-8+Math.sin(a)*r*.9;i?c.lineTo(px,py):c.moveTo(px,py);}
    c.closePath();c.fillStyle=variation>0?'#79a477':'#9cba81';c.fill();c.stroke();
    c.beginPath();c.moveTo(x-7,y-10);c.quadraticCurveTo(x-11,y-18,x-3,y-18);c.moveTo(x+5,y);c.quadraticCurveTo(x+12,y-4,x+7,y-9);c.stroke();
   }
  }
 }
 target.drawImage(battlefieldCache,0,0);
}
function drawShellImpact(c,f,minimizeMotion) {
  const age=1-f.life/f.max, radius=f.r*(minimizeMotion?1:.4+age*.6);
  c.fillStyle='#211f1bbb';c.beginPath();c.ellipse(f.x,f.y,radius,radius*.55,0,0,Math.PI*2);c.fill();
  c.strokeStyle='#b6a17c99';c.lineWidth=2;c.stroke();
  if(!minimizeMotion){
    for(let i=0;i<7;i++){
      const angle=i*Math.PI*2/7, reach=radius*(.6+age);
      c.strokeStyle=i%2?'#81745d':'#e1b875';c.lineWidth=2;
      c.beginPath();c.moveTo(f.x+Math.cos(angle)*reach*.6,f.y+Math.sin(angle)*reach*.5);
      c.lineTo(f.x+Math.cos(angle)*reach,f.y+Math.sin(angle)*reach*.8);c.stroke();
    }
    if(age<.2){c.fillStyle='#ffe3a4';c.beginPath();c.arc(f.x,f.y,6,0,Math.PI*2);c.fill();}
  }
}
