const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('[bookLadySheet,bookBikeSheet].every(i=>i.complete&&i.naturalWidth)')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Hero sheets did not load'));}
  },100);});
  g.eval(await(await fetch('special-heroes-checks.js')).text());
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};specialHeroChecks(check);
   const board=document.createElement('canvas');board.width=1000;board.height=960;const c=board.getContext('2d');
   c.fillStyle='#efe4c7';c.fillRect(0,0,1000,960);
   for(let row=0;row<6;row++)for(let dir=0;dir<4;dir++){
    const u={type:row<4?'madame':'bike',angle:dir*Math.PI/2,movingUntil:[1,2,5].includes(row)?11:0,walkDistance:row===2?14:0,firedAt:row===3?10:-10,firedAngle:dir*Math.PI/2};
    c.save();c.translate(110+dir*250,120+row*155);c.scale(1.3,1.3);
    check(drawBookSpecialHero(c,Object.freeze(u),10),'pose asset route');c.restore();
    c.font='12px sans-serif';c.fillStyle='#263d2c';c.fillText(['Idle','Stride A','Stride B','Firing','Arthur parked','Arthur riding'][row]+' · '+['E','S','W','N'][dir],45+dir*250,25+row*155);
   }
   reset();easy=true;running=true;paused=false;revealUntil=9999;t=10;cam={x:660,y:1060,zoom:.85};
   for(let dir=0;dir<4;dir++){
    const x=570+(dir%2)*170,y=970+Math.floor(dir/2)*140,angle=dir*Math.PI/2;
    const u=add('madame',0,x,y),target=add('trooper',1,x+70*Math.cos(angle),y+70*Math.sin(angle));
    const hp=target.hp;check(shoot(u,target),'real directional flame shot');check(target.hp<hp,'actual damage');
    check(fx.at(-1).tx===target.x&&fx.at(-1).ty===target.y,'flame destination matches struck target');
    check(bookSpecialHeroPose(u,t).direction===dir,'actual shot facing');
   }
   const bike=add('bike',0,650,1040);bike.angle=Math.PI;bike.movingUntil=11;
   const before=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind]));
   let calls=0;const original=crispSprite;crispSprite=(c,image,...args)=>{if(image===bookLadySheet||image===bookBikeSheet)calls++;original(c,image,...args)};
   draw();crispSprite=original;check(calls>=5,'actual battlefield uses both hero assets');
   check(before===JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind])),'drawing pure');
   return {count,poses:board.toDataURL('image/png'),battlefield:canvas.toDataURL('image/png')};
  })()`);
  document.querySelector('#poses').src=result.poses;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' hero checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?special-hero-qa=4';
