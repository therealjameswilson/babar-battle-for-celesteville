const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
document.querySelector('iframe').onload=async()=>{
 const g=document.querySelector('iframe').contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('bookInfantrySheet.complete&&bookInfantrySheet.naturalWidth')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Infantry sheet did not load'));}
  },100);});
  g.eval(await(await fetch('book-motion-checks.js')).text());
  const result=g.eval(`(()=>{
   let count=0;bookMotionChecks((ok,label)=>{if(!ok)throw Error(label);count++});
   const board=document.createElement('canvas');board.width=1000;board.height=680;
   const c=board.getContext('2d');c.fillStyle='#f2e6c9';c.fillRect(0,0,1000,680);
   for(let team=0;team<2;team++)for(let phase=0;phase<2;phase++)for(let dir=0;dir<4;dir++){
    const x=120+dir*240,y=135+(team*2+phase)*155;
    c.fillStyle='#344b35';c.font='14px sans-serif';c.fillText((team?'Rhino':'Elephant')+' '+['East','South','West','North'][dir]+' / '+(phase+1),x-75,y-115);
    c.save();c.translate(x,y);c.scale(1.8,1.8);
    const u=Object.freeze({type:'trooper',team,angle:dir*Math.PI/2,movingUntil:11,walkDistance:phase*14});
    drawBookInfantry(c,u,10);c.restore();
    c.save();c.translate(x+65,y);drawBookInfantry(c,u,10);c.restore();
   }
   const oldDraw=drawBookInfantry;let calls=0;
   easy=true;reset();running=true;paused=true;revealUntil=9999;cam={x:640,y:800,zoom:.85};
   for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++)add('trooper',team,540+dir*60,740+team*85).angle=dir*Math.PI/2;
   const before=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp]));
   drawBookInfantry=(...args)=>{calls++;return oldDraw(...args)};
   try{draw();}finally{drawBookInfantry=oldDraw;}
   if(calls===0)throw Error('Main renderer did not use book infantry');count++;
   if(before!==JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp])))throw Error('Rendering mutated simulation');count++;
   return {count,image:board.toDataURL('image/png'),battlefield:canvas.toDataURL('image/png'),width:bookInfantrySheet.naturalWidth};
  })()`);
  document.querySelector('#poses').src=result.image;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' motion checks; actual Canvas rendering, sheet width '+result.width+'. Large and native game-scale poses below.';
 }catch(e){out.textContent='FAIL '+e.stack;}
};

frame.src="../dist/?motion=2";
