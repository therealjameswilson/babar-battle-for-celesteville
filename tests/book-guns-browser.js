const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('bookGunSheets.every(i=>i.complete&&i.naturalWidth)')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Gun sheets did not load'));}
  },100);});
  g.eval(await(await fetch('book-gun-checks.js')).text());
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};bookGunChecks(check);
   const board=document.createElement('canvas');board.width=1000;board.height=1120;const c=board.getContext('2d');
   c.fillStyle='#f3e8cd';c.fillRect(0,0,1000,1120);
   for(let team=0;team<2;team++)for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++){
    const u=Object.freeze({type:'walker',team,angle:dir*Math.PI/2,movingUntil:[1,2].includes(row)?11:0,walkDistance:row===2?14:0,deployed:row===3});
    c.save();c.translate(135+dir*250,105+(team*4+row)*140);c.scale(1.35,1.35);
    check(drawBookUnit(c,u,10),'pose route');c.restore();
    c.fillStyle='#293629';c.font='12px Georgia';c.fillText((team?'Rhino':'Elephant')+' '+['Mobile','Stride A','Stride B','Deployed'][row]+' '+['E','S','W','N'][dir],25+dir*250,24+(team*4+row)*140);
   }
   reset();easy=true;running=true;paused=false;revealUntil=0;t=10;
   const shotboard=document.createElement('canvas');shotboard.width=1000;shotboard.height=720;const sc=shotboard.getContext('2d');sc.fillStyle='#f3e8cd';sc.fillRect(0,0,1000,720);
   for(let team=0;team<2;team++)for(const deployed of [false,true])for(let dir=0;dir<4;dir++){
    const angle=dir*Math.PI/2,x=500,y=500;
    const u=add('walker',team,x,y),target=add('trooper',1-team,x+120*Math.cos(angle),y+120*Math.sin(angle));u.deployed=deployed;
    // Target is inside the gun crew's real sight radius.
    check(sees(team,target),'target in actual faction sight');const hp=target.hp;
    check(shoot(u,target),'real gun shot');check(target.hp<hp,'real shot damage');
    const f=fx.at(-1);check(f.heavy&&f.gun.deployed===deployed&&f.gun.angle===u.firedAngle&&Math.abs(Math.sin(f.gun.angle)-Math.sin(angle))<1e-9&&Math.abs(Math.cos(f.gun.angle)-Math.cos(angle))<1e-9,'actual effect metadata');
    check(bookGunPose(u,t).direction===dir,'actual firing bearing');
    const ox=120+dir*250,oy=95+(team*2+Number(deployed))*180;
    sc.save();sc.translate(ox,oy);drawBookGun(sc,u,t);sc.restore();
    const effect={...f,x:ox,y:oy,tx:ox+(f.tx-x)*.6,ty:oy+(f.ty-y)*.6,life:.27};
    check(drawBookGunShot(sc,effect),'anchored shell');
    sc.font='12px Georgia';sc.fillStyle='#293629';sc.fillText((team?'Rhino ':'Elephant ')+(deployed?'deployed':'mobile')+' '+['E','S','W','N'][dir],20+dir*250,24+(team*2+Number(deployed))*180);
    u.hp=0;target.hp=0;
   }
   reset();easy=true;running=true;paused=false;revealUntil=9999;t=10;cam={x:660,y:970,zoom:.95};
   const guns=[];
   for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++){
    const u=add('walker',team,480+dir*120,920+team*140);u.angle=dir*Math.PI/2;u.deployed=dir>=2;guns.push(u);
   }
   const test=guns[0];check(setArtilleryMode(test,true),'deploy begins');check(bookGunPose(test,t).row===0,'deployment not premature');
   t+=SIEGE.deploy-.01;updateArtillery(test);check(!test.deployed,'full deployment delay');t+=.01;updateArtillery(test);check(test.deployed&&bookGunPose(test,t).row===3,'deployed art after real transition');
   check(setArtilleryMode(test,false),'pack begins');t+=SIEGE.pack;updateArtillery(test);check(!test.deployed&&bookGunPose(test,t).row===0,'packing completes');
   const before=JSON.stringify(units);let calls=0;const original=crispSprite;
   crispSprite=(c,image,...args)=>{if(bookGunSheets.includes(image))calls++;original(c,image,...args)};draw();crispSprite=original;
   check(calls>=8,'actual battle draws both factions');check(before===JSON.stringify(units),'drawing preserves simulation');
   return {count,poses:board.toDataURL('image/png'),shots:shotboard.toDataURL('image/png'),battlefield:canvas.toDataURL('image/png')};
  })()`);
  for(const id of ['poses','shots','battlefield'])document.getElementById(id).src=result[id];
  out.textContent='PASS '+result.count+' field-gun checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?gun-qa=4';
