const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('bookSpecialistSheet.complete&&bookSpecialistSheet.naturalWidth&&bookInfantrySheet.complete&&bookInfantrySheet.naturalWidth')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Specialist sheet did not load'));}
  },100);});
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};
   easy=true;reset();running=true;paused=false;revealUntil=9999;nextWave=enemySpawn=99999;
   const oldWidth=canvas.width,oldHeight=canvas.height;canvas.width=1140;canvas.height=960;
   ctx.fillStyle='#efe4c7';ctx.fillRect(0,0,1140,960);
   const types=Object.keys(BOOK_SPECIALIST_FRAMES);
   for(let i=0;i<6;i++){
    const type=types[i],x=95+i*190;
    ctx.fillStyle='#263b2c';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(defs[type].name,x,22);
    for(let row=0;row<4;row++){
     const u=add(type,row===1?1:0,x,150+row*190);u.hp=u.max*(row===2?.25:1);
     if(row===3){u.construction=defs[type].build*.5;u.buildDuration=defs[type].build;}
     const before=JSON.stringify([u.x,u.y,u.hp,u.construction,u.queue]);
     let spriteCalls=0;const originalSprite=crispSprite;crispSprite=(c,image,...args)=>{if(image===bookSpecialistSheet)spriteCalls++;originalSprite(c,image,...args)};
     drawUnit(u);crispSprite=originalSprite;
     check(before===JSON.stringify([u.x,u.y,u.hp,u.construction,u.queue]),type+' rendering pure');
     check(spriteCalls===1,type+' actual renderer uses new atlas');
    }
    const k={type,x,y:875,seen:0};drawRememberedBuilding(k);
    check(k.seen===0&&k.type===type,'memory preserved');
   }
   const states=canvas.toDataURL('image/png');canvas.width=oldWidth;canvas.height=oldHeight;
   reset();running=true;paused=false;revealUntil=9999;cam={x:440,y:1000,zoom:.8};
   const trench=add('trench',0,460,970),crew=[];
   for(let i=0;i<6;i++)crew.push(add('trooper',0,430+i*8,950));
   selected=crew;check(occupyTrench(trench)===6,'six normal trench orders accepted');
   for(const u of crew){u.x=u.order.x;u.y=u.order.y;check(trenchCover(u),'assigned slot provides cover');}
   add('shelter',0,600,1000);add('headquarters',0,460,1120);add('quarry',0,300,1020);
   const before=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind]));draw();
   check(before===JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.order?.kind])),'battlefield drawing pure');
   check(bookSpecialistSheet.naturalWidth===1536,'native atlas');
   return {count,states,battlefield:canvas.toDataURL('image/png')};
  })()`);
  document.querySelector('#states').src=result.states;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' specialist checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?specialist-qa=2';
