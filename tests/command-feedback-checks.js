function commandFeedbackChecks(check) {
  reset();running=true;nextWave=enemySpawn=9999;
  const resource=nodes.find(n=>!n.kind||n.kind==='supplies'),soldier=alive(0).find(u=>u.type==='trooper'),worker=alive(0).find(u=>u.type==='worker');
  selected=[soldier];mode=null;command(resource);
  check(soldier.order.kind==='attack'&&$('toast').textContent.includes('Attack-move')&&!$('toast').textContent.includes('gather'),'combat at resource reports attack');
  mode='move';command(resource);check($('toast').textContent==='Move confirmed.','explicit move reported');
  selected=[worker,soldier];mode=null;command(resource);
  check($('toast').textContent.includes('gathering assigned')&&$('toast').textContent.includes('Attack-move'),'mixed orders both reported');
  selected=[soldier];mode='move';command({x:500,y:1000});mode='attack';command(resource,true);
  check(soldier.order.kind==='move'&&soldier.orders[0].kind==='attack'&&$('toast').textContent.startsWith('Queued orders: Attack-move'),'queued new order reported');
  soldier.orders=Array.from({length:16},()=>({kind:'move',x:500,y:1000}));mode='attack';command(resource,true);
  check($('toast').textContent.includes('queues full'),'rejected queue not reported successful');
  mode='gather';command(resource);check($('toast').textContent.includes('Select provisioners'),'combat-only gather gives guidance');
  selected=Array.from({length:34},()=>add('trooper',0,500,1000));munitions=100;
  let actions=[];munitionsActions(actions,selected[0]);
  check(actions[0][1].includes('272 MU')&&actions[0][1].includes('Select 12 or fewer')&&actions[0][3],'heavy rounds cap explained');
  check(actions[1][1].includes('204 MU')&&actions[1][1].includes('Select 16 or fewer')&&actions[1][3],'smoke cap explained');
  selected=selected.slice(0,12);actions=[];munitionsActions(actions,selected[0]);check(!actions[0][3],'affordable group enabled');
  check(spendMunitions('rounds')&&munitions===4&&selected.every(u=>u.heavyRoundsUntil===t+15),'normal cost and effects retained');
  munitions=0;actions=[];munitionsActions(actions,selected[0]);check(actions[1][1].includes('replenish'),'empty reserve recovery explained');
}
