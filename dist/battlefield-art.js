/* Static battlefield illustration is rasterized once, below fog and all units. */
const earthTexture = new Image();
earthTexture.src = 'assets/battlefield-earth.png';
let battlefieldCache = null, battlefieldTextured = false;
function drawBattlefieldGround(target) {
  const ready = earthTexture.complete && earthTexture.naturalWidth > 0;
  if (!battlefieldCache || ready !== battlefieldTextured) {
    battlefieldTextured = ready;
    battlefieldCache = document.createElement('canvas');
    battlefieldCache.width = W; battlefieldCache.height = H;
    const c = battlefieldCache.getContext('2d');
    c.fillStyle = '#42493c'; c.fillRect(0,0,W,H);
    if (ready) {
      c.globalAlpha = .48;
      for (let y=0;y<H;y+=420) for(let x=0;x<W;x+=420) c.drawImage(earthTexture,x,y,420,420);
      c.globalAlpha = 1;
    }
    const roads = [[[320,900],[640,880],[1080,870],[1460,280]],[[320,900],[610,450],[1010,420],[1460,280]]];
    for (const road of roads) {
      for (const [width,color] of [[76,'#24282088'],[62,'#746b51'],[48,'#655d49']]) {
        c.beginPath(); road.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
        c.lineJoin='round';c.lineWidth=width;c.strokeStyle=color;c.stroke();
      }
      for(let j=1;j<road.length;j++) {
        const [ax,ay]=road[j-1],[bx,by]=road[j],length=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/length,ny=(bx-ax)/length;
        for(const offset of [-16,16]) {
          c.beginPath();c.moveTo(ax+nx*offset,ay+ny*offset);c.lineTo(bx+nx*offset,by+ny*offset);
          c.strokeStyle='#302e2580';c.lineWidth=4;c.stroke();
        }
        for(let k=12;k<length;k+=13){const offset=Math.sin(k*4)*23,x=ax+(bx-ax)*k/length+nx*offset,y=ay+(by-ay)*k/length+ny*offset;
          c.fillStyle=k%3?'#24282035':'#b7a57925';c.beginPath();c.ellipse(x,y,3+k%5,1.5,Math.atan2(by-ay,bx-ax),0,Math.PI*2);c.fill();}
      }
    }
    for (const p of terrain) {
      c.fillStyle=p.c>.5?'#c4b08a35':'#171e1a55';c.fillRect(p.x,p.y,p.r*2,p.r*.6);
      // Sparse, static shell scars: decoration only, never tactical obstacles.
      if(p.c>.965){c.fillStyle='#272b24';c.beginPath();c.ellipse(p.x,p.y,11+p.r,6+p.r/2,.3,0,Math.PI*2);c.fill();
        c.strokeStyle='#9a8c6666';c.lineWidth=2;c.stroke();}
    }
    for(const o of obstacles){
      c.fillStyle='#17251e';c.fillRect(o.x,o.y,o.w,o.h);
      for(let y=o.y+10;y<o.y+o.h;y+=32)for(let x=o.x+10;x<o.x+o.w;x+=29){
        const v=((x*13+y*7)%19)/19;
        c.save();c.translate(Math.sin(x+y)*7,Math.cos(x-y)*6);
        c.fillStyle='#151d18aa';c.beginPath();c.ellipse(x+8,y+12,20,10,0,0,Math.PI*2);c.fill();
        c.fillStyle='#635b43';c.fillRect(x-2,y-2,4,22);
        for(let k=0;k<3;k++){
          const top=y-30-v*12+k*10,half=9+k*4+v*4;
          c.beginPath();c.moveTo(x,top);c.lineTo(x+half*.4,top+9);c.lineTo(x+half*.25,top+10);c.lineTo(x+half,top+22);c.lineTo(x+half*.3,top+19);c.lineTo(x,top+23);c.lineTo(x-half,top+22);c.lineTo(x-half*.45,top+13);c.lineTo(x-half*.6,top+12);c.closePath();
          c.fillStyle=v>.5?'#334332':'#2b392c';c.fill();
          c.strokeStyle='#78806855';c.lineWidth=1;c.beginPath();c.moveTo(x-half,top+22);c.lineTo(x,top);c.stroke();
        }
        c.restore();
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
