const frame=document.querySelector('iframe'),size=new URLSearchParams(location.search).get('size')||'desktop';
[frame.width,frame.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
frame.onload=async()=>{
 const g=frame.contentWindow,out=document.querySelector('#result');
 try{
  await new Promise((resolve,reject)=>{let attempts=0;const poll=setInterval(()=>{
   if(g.eval('depotSheet.complete&&depotSheet.naturalWidth&&bookWorkerSheets.every(i=>i.complete&&i.naturalWidth)')){clearInterval(poll);resolve();}
   else if(++attempts>150){clearInterval(poll);reject(Error('Depot image did not load'));}
  },100);});
  g.eval(await(await fetch('depot-checks.js')).text());
  const result=g.eval(`(()=>{
   let count=0;const check=(ok,label)=>{if(!ok)throw Error(label);count++};depotChecks(check);
   const oldWidth=canvas.width,oldHeight=canvas.height;canvas.width=1000;canvas.height=840;
   const c=ctx;c.fillStyle='#efe4c7';c.fillRect(0,0,1000,840);
   for(let state=0;state<4;state++){
    reset();running=true;paused=false;revealUntil=9999;
    depot.team=[-1,0,0,1][state];depot.progress=state===0?4:0;
    if(state===2)add('trooper',1,960,840);
    c.save();c.translate(330+(state%2)*500-950,200+Math.floor(state/2)*420-830);
    drawDepotYard(c);for(const n of nodes.filter(n=>dist(n,depot)<200))drawResourceSprite(n,true,isDepotStock(n));drawDepotStatus(c);c.restore();
    c.fillStyle='#263b2c';c.font='bold 16px sans-serif';c.fillText(['Neutral: half captured','Elephant income','Enemy interrupts munitions','Rhino supply income'][state],20+(state%2)*500,25+Math.floor(state/2)*420);
    c.font='11px sans-serif';const card=depotCard(depot,munitionsIncome());
    check(c.measureText(card.benefit).width<=card.width-14,'income fits status card');
   }
   const states=canvas.toDataURL('image/png');canvas.width=oldWidth;canvas.height=oldHeight;reset();running=true;paused=false;revealUntil=9999;cam={x:950,y:835,zoom:.85};
   selected=[alive(0).find(u=>u.type==='worker')];
   add('trooper',0,930,850);add('trooper',0,945,875);draw();
   check(depotSheet.naturalWidth===1254,'native depot loaded');
   return {count,states,battlefield:canvas.toDataURL('image/png')};
  })()`);
  document.querySelector('#states').src=result.states;document.querySelector('#battlefield').src=result.battlefield;
  out.textContent='PASS '+result.count+' depot checks ('+size+').';
 }catch(e){out.textContent='FAIL '+e.stack;}
};
frame.src='../dist/?depot-qa=2';
