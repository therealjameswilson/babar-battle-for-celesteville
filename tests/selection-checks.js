function selectionChecks(check) {
  easy=true;reset();running=true;paused=false;nextWave=enemySpawn=9999;
  const guard=alive(0).find(u=>u.type==='trooper'), hero=alive(0).find(u=>u.type==='hero');
  const gun=add('walker',0,500,900);
  selected=[guard,hero,gun];updateUI(true);
  check(selectionPool.length===3 && selectionType===null,'Mixed selection retains all three unit types');
  chooseSubgroup('walker');
  check(selected.length===1 && selected[0]===gun,'Artillery subgroup isolates guns');
  const oldOrder=guard.order;
  tacticalOrders('hold');
  check(gun.order.kind==='hold' && guard.order===oldOrder,'Subgroup order leaves infantry orders unchanged');
  chooseSubgroup('hero');
  check(selected[0]===hero,'Officer subgroup exposes the selected commander');
  chooseSubgroup(null);
  check(selected.length===3,'All restores the original mixed selection');
  cycleSubgroup();check(selectionType==='trooper','T cycles into the first unit type');
  cycleSubgroup(true);check(selectionType===null,'Reverse cycling returns to All');
  chooseSubgroup('walker');gun.hp=0;selected=selected.filter(u=>u.hp>0);updateUI(true);
  check(selectionType===null && selected.length===2,'Loss of the last subgroup member restores surviving selection');
  selected=[guard];updateUI(true);
  check(selectionPool.length===1 && selectionType===null,'Fresh map selection discards the previous retained group');
  selected=[guard,hero];updateUI(true);chooseSubgroup('hero');controlGroup(4,true,false);
  chooseSubgroup(null);controlGroup(4,false,false);updateUI(true);
  check(selected.length===1 && selected[0]===hero && selectionPool.length===1,'Control groups save the actual subgroup and replace retained selection');
  reset();check(selectionPool.length<=1 && selectionType===null,'Restart clears retained subgroups');
}
