/* A cached ink-and-watercolor map; terrain geometry and collision stay unchanged. */
let battlefieldCache=null;
function drawBattlefieldGround(target){
 if(!battlefieldCache){
  battlefieldCache=document.createElement('canvas');battlefieldCache.width=W;battlefieldCache.height=H;
  const c=battlefieldCache.getContext('2d');c.fillStyle='#dde0b6';c.fillRect(0,0,W,H);
  // Loose translucent washes on warm paper, generated once without simulation RNG.
  for(const p of terrain){
   c.fillStyle=p.c>.5?'#7f9b620b':'#f5e7be12';c.beginPath();c.ellipse(p.x,p.y,p.r*15+20,p.r*8+8,p.c,0,Math.PI*2);c.fill();
  }
  const roads=[[[320,900],[640,880],[1080,870],[1460,280]],[[320,900],[610,450],[1010,420],[1460,280]]];
  c.lineJoin='round';c.lineCap='round';
  for(const road of roads)for(const [width,color] of [[66,'#8b8867'],[63,'#f1e4bf']]){
   c.beginPath();road.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=width;c.strokeStyle=color;c.stroke();
  }
  for(const p of terrain){
   c.strokeStyle=p.c>.5?'#809260':'#a6ac76';c.lineWidth=1;
   c.beginPath();c.moveTo(p.x-3,p.y);c.lineTo(p.x-5,p.y-5);c.moveTo(p.x,p.y);c.lineTo(p.x+1,p.y-7);c.moveTo(p.x+3,p.y);c.lineTo(p.x+5,p.y-4);c.stroke();
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
