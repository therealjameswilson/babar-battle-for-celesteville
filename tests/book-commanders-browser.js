const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('bookCommanderSheets.every(img=>img.complete&&img.naturalWidth)')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Commander sheets did not load'));}
  },100);});
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};
   const board=document.createElement('canvas');board.width=1120;board.height=1120;
   const c=board.getContext('2d');c.fillStyle='#f2e6c9';c.fillRect(0,0,1120,1120);
   for(let team=0;team<2;team++)for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++){
    const x=110+dir*280,y=110+(team*4+row)*140;
    const u=Object.freeze({type:'hero',team,angle:dir*Math.PI/2,movingUntil:row===1||row===2?11:0,walkDistance:row===2?16:0,firedAt:row===3?10:-10,firedAngle:dir*Math.PI/2});
    const pose=commanderPose(u,10);check(pose.row===row&&pose.direction===dir,'pose selection');
    c.fillStyle='#344b35';c.font='13px sans-serif';c.fillText((team?'Rataxes':'Babar')+' '+['E','S','W','N'][dir]+' / '+['idle','stride 1','stride 2','fire'][row],x-80,y-95);
    c.save();c.translate(x,y);check(drawBookUnit(c,u,10),'actual book route');c.restore();
    c.save();c.translate(x+75,y);c.scale(.6,.6);drawBookUnit(c,u,10,true);c.restore();
   }
   easy=true;reset();running=true;paused=true;revealUntil=9999;cam={x:640,y:800,zoom:.85};
   for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++){const u=add('hero',team,520+dir*80,740+team*110);u.name=team?'Lord Rataxes':'King Babar';u.angle=dir*Math.PI/2;u.firedAt=0;u.firedAngle=u.angle;}
   const before=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp]));draw();
   check(before===JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp])),'simulation unchanged');
   check(bookCommanderSheets.every(img=>img.naturalWidth===1254),'native sheets loaded');
   return {count,poses:board.toDataURL('image/png'),battlefield:canvas.toDataURL('image/png')};
  })()`);
  document.querySelector('#poses').src=result.poses;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' commander rendering checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?commander-motion=1';
