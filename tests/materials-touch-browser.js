(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;};try{
for(const [w,h] of [[390,844],[844,390],[1280,900]]){
 const f=document.createElement('iframe');f.width=w;f.height=h;f.style.border='0';const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?materials=563';document.querySelector('#games').append(f);await ready;
 const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();d.querySelector('#start').click();
 g.eval("reset();running=true;paused=false;nextWave=enemySpawn=9999;this.mineNode=nodes.find(n=>n.kind==='materials'&&n.x===275);this.miner=alive(0).find(u=>u.type==='worker');selected=[miner];cam={x:275,y:650,zoom:.72};ore=1000;build('quarry');command(mineNode);this.mine=alive(0).find(u=>u.type==='quarry');");
 check(g.eval('!!mine&&miner.order.target===mine'),'paid quarry has builder');
 g.eval('for(let i=0;i<1800;i++)update(.05)');
 check(g.eval("!mine.construction&&miner.order.kind==='gather'&&miner.order.node===mineNode"),'builder automatically mines');
 check(g.eval('materials>0'),'materials physically delivered');
 g.eval("issueOrder(miner,{kind:'hold'});selected=[miner];updateUI(true)");d.querySelector('#phone-tabs [data-panel=orders]').click();
 const c=d.querySelector('#game'),r=c.getBoundingClientRect(),p=g.eval('screen(mine)');
 for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval("selected[0]===miner&&miner.order.kind==='gather'&&miner.order.node===mineNode&&!paused"),'tap quarry assigns mining without losing worker selection');
 check(d.querySelector('aside[data-panel=orders]')!==null,'mining tap keeps command panel closed');
 g.eval("mine.construction=5;selected=[miner];command(mineNode)");
 check(g.eval("materialsOrderMessage(mineNode).includes('Finish the quarry')"),'unfinished quarry explains blocker');
 for(const type of ['pointerdown','pointerup'])c.dispatchEvent(new g.PointerEvent(type,{pointerId:1,pointerType:'touch',button:0,clientX:r.left+p.x,clientY:r.top+p.y,bubbles:true,cancelable:true}));
 check(g.eval("miner.order.kind==='build'&&miner.order.target===mine"),'tap unfinished quarry assigns construction');
 g.eval('running=false');if(w!==390)f.remove();
}
document.querySelector('#result').textContent='PASS '+count+' assertions';
}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
