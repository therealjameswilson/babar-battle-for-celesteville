const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('bookWorkerSheets.every(img=>img.complete&&img.naturalWidth)')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Provisioner sheets did not load'));}
  },100);});
  g.eval(await(await fetch('book-workers-checks.js')).text());
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};bookWorkerChecks(check);
   easy=true;reset();running=true;nextWave=enemySpawn=99999;
   const courier=alive(0).find(u=>u.type==='worker');
   check(!bookWorkerPose(courier,t).loaded,'starts empty');
   for(let i=0;i<1000&&!courier.carrying;i++)update(.05);
   check(courier.carrying>0&&bookWorkerPose(courier,t).loaded,'physical gathering loads art');
   for(let i=0;i<1000&&courier.carrying;i++)update(.05);
   check(courier.carrying===0&&!bookWorkerPose(courier,t).loaded,'physical delivery clears art');
   const board=document.createElement('canvas');board.width=1040;board.height=1040;
   const c=board.getContext('2d');c.fillStyle='#f2e6c9';c.fillRect(0,0,1040,1040);
   for(let team=0;team<2;team++)for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++){
    const x=100+dir*260,y=100+(team*4+row)*130;
    const u=Object.freeze({type:'worker',team,angle:dir*Math.PI/2,movingUntil:11,walkDistance:row%2*14,carrying:row>=2?10:0,cargoKind:['supplies','materials','uranium','supplies'][dir]});
    c.fillStyle='#344b35';c.font='13px sans-serif';c.fillText((team?'Rhino':'Elephant')+' '+['E','S','W','N'][dir]+' / '+(u.carrying?'loaded':'empty'),x-75,y-85);
    c.save();c.translate(x,y);c.scale(1.25,1.25);check(drawBookUnit(c,u,10),'worker route');drawWorkerCargo(c,u);c.restore();
    c.save();c.translate(x+65,y);drawBookUnit(c,u,10,true);drawWorkerCargo(c,u);c.restore();
   }
   reset();running=true;paused=true;revealUntil=9999;cam={x:640,y:800,zoom:.85};
   for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++){const u=add('worker',team,530+dir*65,740+team*95);u.angle=dir*Math.PI/2;u.carrying=dir?10:0;u.cargoKind=['supplies','supplies','materials','uranium'][dir];}
   const before=JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.carrying]));draw();
   check(before===JSON.stringify(units.map(u=>[u.id,u.x,u.y,u.hp,u.carrying])),'simulation unchanged');
   check(bookWorkerSheets.every(img=>img.naturalWidth===1254),'native sheets loaded');
   return {count,poses:board.toDataURL('image/png'),battlefield:canvas.toDataURL('image/png')};
  })()`);
  document.querySelector('#poses').src=result.poses;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' provisioner checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?worker-motion=1';
