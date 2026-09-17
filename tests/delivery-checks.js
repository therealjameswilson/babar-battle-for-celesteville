function deliveryChecks(check){
 easy=false;reset();running=true;paused=false;nextWave=enemySpawn=9999;
 const base=add('headquarters',0,1020,1070),stock=nodes.find(n=>n.x===1040&&n.y===900);
 const worker=add('worker',0,1080,1070,{carrying:10,cargoKind:'supplies',order:{kind:'gather',node:stock}});
 rebuildSupply();const before=ore;update(.05);
 check(ore===before+10&&base.deliveredSupplies===10&&worker.carrying===0,'Headquarters records Supplies only after physical cargo delivery');
 const count=base.deliveredSupplies;update(.05);check(base.deliveredSupplies===count,'An empty returning worker cannot count its delivery twice');
 worker.x=1080;worker.y=1070;worker.carrying=10;worker.cargoKind='materials';const metal=materials;update(.05);
 check(materials===metal+10&&base.deliveredMaterials===10&&base.deliveredSupplies===10,'Materials and Supplies receipts stay separate');
 worker.x=1080;worker.y=1070;worker.carrying=10;worker.cargoKind='supplies';benefits.add('pompadour');update(.05);
 check(base.deliveredSupplies===22.5,'Supply receipts include the same council efficiency bonus as credited funds');
 selected=[base];updateUI(true);check($('selected-info').textContent.includes('Delivered 22 S · 10 M'),'Selected camp reports rounded receipts in the live status panel');
 const text=headquartersSummary(base),snapshot=JSON.stringify(base);headquartersSummary(base);check(JSON.stringify(base)===snapshot&&text.includes('+10 population'),'Delivery report is read-only and retains the camp population role');
 base.hp=0;worker.x=1080;worker.y=1070;worker.carrying=10;rebuildSupply();update(.05);
 check(base.deliveredSupplies===22.5&&worker.carrying===10,'Destroyed camp cannot credit cargo; worker retains its load for another base');
 easy=false;reset();running=true;nextWave=enemySpawn=9999;
 const enemyCamp=add('headquarters',1,1020,1070),enemyWorker=add('worker',1,1080,1070,{carrying:10,cargoKind:'supplies',order:{kind:'gather',node:nodes[4]}});
 rebuildSupply();const budget=enemyBudget;update(.05);
 check(enemyBudget===budget+10&&enemyCamp.deliveredSupplies===10&&!enemyWorker.carrying,'Enemy camps account for real deliveries under the same rules');
}
