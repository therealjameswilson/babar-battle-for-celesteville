(async()=>{
 let count=0;const lines=[];
 const check=(v,s)=>{if(!v)throw Error(s);count++;};
 try{
 for(const [w,h] of [[320,568],[375,667],[390,844],[430,932],[667,375],[844,390],[932,430],[1280,900]]){
  const f=document.createElement('iframe');f.width=w;f.height=h;
  const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?phone=40';document.querySelector('#games').append(f);await ready;
  const g=f.contentWindow,d=f.contentDocument, q=s=>d.querySelector(s), rect=s=>q(s).getBoundingClientRect();
  q('#start').click();g.eval('paused=true');
  const phone=w<=580||h<=500;
  check(d.documentElement.scrollWidth<=w,'horizontal overflow '+w);
  check(rect('#game').height>=200,'battlefield height '+w+' '+rect('#game').height);
  check(rect('aside').bottom<=h+1,'panel fits '+w);
  if(phone){
   for(const b of d.querySelectorAll('#phone-tabs button,.quick button,.orders button,header button,.camera-tools button')){
    const r=b.getBoundingClientRect();check(r.height>=44&&r.width>=44,'target size '+w+' '+b.textContent+' '+r.width+' '+r.height);
    check(r.left>=0&&r.right<=w+1&&r.bottom<=h+1,'target bounds '+w+' '+b.textContent);
   }
   q('[data-panel="actions"]').click();check(rect('#actions').height>0,'actions accessible');
   check(rect('#actions').right<=w+1,'actions fit');
   q('[data-panel="status"]').click();check(rect('.selection').height>0,'status accessible');
   q('[data-panel="orders"]').click();
  }else check(g.getComputedStyle(q('#phone-tabs')).display==='none','desktop tabs hidden');
  g.eval("paused=false;selected=[alive(0).find(u=>u.type==='babar')||alive(0).find(u=>defs[u.type].speed)];mode='move';window.beforeOrders=JSON.stringify(selected.map(u=>u.order));window.beforeZoom=cam.zoom");
  const c=q('#game'),r=c.getBoundingClientRect();
  const pointer=(type,id,x,y)=>c.dispatchEvent(new g.PointerEvent(type,{pointerId:id,pointerType:'touch',clientX:r.left+x,clientY:r.top+y,button:0,bubbles:true,cancelable:true}));
  pointer('pointerdown',1,80,100);pointer('pointerdown',2,180,100);pointer('pointermove',2,230,110);pointer('pointerup',2,230,110);pointer('pointerup',1,80,100);
  check(g.eval('cam.zoom>beforeZoom'),'pinch zoom');
  check(g.eval('JSON.stringify(selected.map(u=>u.order))===beforeOrders'),'no accidental order');
  check(g.eval('down===null'),'gesture cleared');
  pointer('pointerdown',3,80,100);pointer('pointerdown',4,180,100);pointer('pointercancel',4,180,100);pointer('pointerup',3,80,100);
  check(g.eval('JSON.stringify(selected.map(u=>u.order))===beforeOrders'),'cancel no order');
  pointer('pointerdown',5,120,150);pointer('pointerup',5,120,150);
  check(g.eval('JSON.stringify(selected.map(u=>u.order))!==beforeOrders'),'single finger order after pinch');
  q('#pause').click();check(g.eval('paused'),'pause');q('#pause').click();check(g.eval('!paused'),'resume');
  q('#court-open').click();check(q('#court-dialog').open,'council');q('#court-close').click();check(!q('#court-dialog').open,'council closes');
  q('#help').click();check(q('#help-dialog').open,'help');check(!!q('#phone-restart'),'restart reachable');q('#help-close').click();
  g.eval('paused=true;draw()');lines.push('PASS '+w+'×'+h);f.remove();
 }
 document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';
 }catch(e){document.querySelector('#result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
