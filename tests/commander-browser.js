'use strict';
(async()=>{
 let checks=0;const lines=[],out=document.getElementById('result');
 const check=(value,label)=>{if(!value)throw Error(label);checks++;};
 try {
  for(const [width,height] of [[390,844],[844,390],[1280,900]]) {
   const f=document.createElement('iframe');f.width=width;f.height=height;
   const ready=new Promise(resolve=>f.onload=resolve);f.src='../dist/index.html?v=0.38.0-commanders';document.getElementById('games').append(f);await ready;
   const g=f.contentWindow;await g.eval('Promise.all(commanderSheets.map(i=>i.decode()))');
   check(f.contentDocument.documentElement.scrollWidth<=width,'layout '+width);
   for(let team=0;team<2;team++)for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++) {
    const u={type:'hero',team,angle:dir*Math.PI/2,movingUntil:row===1||row===2?11:0,walkDistance:row===2?16:0,firedAt:row===3?10:undefined};
    check(g.commanderPose(u,10).row===row,'correct pose');
    const c=document.createElement('canvas');c.width=160;c.height=140;const cx=c.getContext('2d');cx.translate(80,100);
    check(g.drawCommanderSprite(cx,u,10),'draw');const pixels=cx.getImageData(0,0,160,140).data;
    check(pixels.some((v,i)=>i%4===3&&v>128),'visible pixels');
    if(width===390){const sheet=document.getElementById('sheet').getContext('2d');const x=dir*160,y=(team*4+row)*130;sheet.fillStyle='#b7b4a1';sheet.fillRect(x,y,160,130);sheet.drawImage(c,x,y);sheet.fillStyle='#161e18';sheet.font='12px sans-serif';sheet.fillText(['Babar','Rataxes'][team]+' '+['idle','walk A','walk B','fire'][row]+' '+['E','S','W','N'][dir],x+8,y+125);}
   }
   g.eval("reset();running=true;nextWave=9999;enemySpawn=9999;this.heroQA=alive(0).find(u=>u.type==='hero');heroQA.order={kind:'move',x:550,y:1000};for(let i=0;i<30;i++)update(.05)");
   check(g.eval('heroQA.walkDistance>0'),'real commander movement');
   check(g.eval('commanderPose(heroQA,t).row===1||commanderPose(heroQA,t).row===2'),'real movement animation');
   g.eval("heroQA.order=null;heroQA.movingUntil=0;this.targetQA=add('trooper',1,heroQA.x+45,heroQA.y);sightAt=-1;shoot(heroQA,targetQA)");
   check(g.eval('heroQA.firedAt===t'),'actual shot timestamp');
   check(g.eval('commanderPose(heroQA,t).row===3'),'actual shot pose');
   check(g.eval('commanderPose(heroQA,t,true).flash===false'),'reduced flash');
   g.eval('paused=true;this.poseBeforeQA=JSON.stringify(commanderPose(heroQA,t));advanceSimulation(.25)');
   check(g.eval('JSON.stringify(commanderPose(heroQA,t))===poseBeforeQA'),'pause pose frozen');
   g.eval('draw()');
   lines.push('PASS '+width+'×'+height+': 32 rendered poses, real movement/fire, reduced motion, pause and battlefield draw.');
  }
  const review=document.createElement('img');review.id='rendered-review';review.alt='Browser-rendered commander frame review';review.src=document.getElementById('sheet').toDataURL('image/png');document.body.append(review);
  out.textContent=lines.join('\n')+'\nPASS '+checks+' browser commander checks';
 }catch(e){out.textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
