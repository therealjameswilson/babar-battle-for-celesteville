function buildQueueChecks(check){
 function fresh(){easy=true;reset();running=true;ore=1500;materials=200;nextWave=enemySpawn=9999;enemyScoutSent=true;}
 function step(seconds){for(let k=0;k<seconds*20&&!ended;k++)update(.05);}
 function place(p,append){build('relay');command(p,append);return alive(0).find(u=>u.type==='relay'&&u.x===p.x&&u.y===p.y);}
 const first={x:570,y:1070},second={x:620,y:970};
 fresh();let worker=alive(0).find(u=>u.type==='worker');selected=[worker];const work=worker.order;
 let a=place(first,false),b=place(second,true);
 check(a&&b&&ore===1300,'Two foundations pay once each at placement');
 check(worker.order.target===a&&worker.orders.length===1&&worker.orders[0].target===b,'Shift construction retains the active site and queues the second');
 check(constructionCrew(b).queued===1&&productionReport(b).text.includes('Queued construction'),'Future site reports a queued builder instead of a missing one');
 const untouched=b.construction;step(5);
 check(b.construction===untouched,'Queued foundation cannot progress before its builder arrives');
 step(60);check(!a.construction&&!b.construction,'One provisioner completes both sites through travel and labor');
 check(worker.order?.kind==='gather'&&worker.order.node===work.node,'Consecutive construction returns to the original gathering assignment');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,false);b=place(second,true);
 issueOrder(worker,{kind:'move',x:500,y:1190},true);step(70);
 check(!a.construction&&!b.construction&&!worker.order&&dist(worker,{x:500,y:1190})<12,'An explicit follow-up move takes priority over automatic gathering');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];worker.carrying=10;
 const gather=worker.order;const funds=ore;a=place(first,true);
 check(worker.order===gather&&worker.orders[0].target===a&&worker.carrying===10,'Queueing from gathering preserves the current cargo delivery');
 step(65);check(!a.construction&&ore>=funds-100+10,'Cargo is delivered before queued construction completes');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,false);b=place(second,true);
 cancelConstruction(b);check(ore===1375&&worker.orders.length===0&&worker.order.target===a,'Cancelling a future site refunds 75 percent and leaves current work intact');
 cancelConstruction(b);check(ore===1375,'A cancelled foundation cannot refund twice');
 b=place(second,true);cancelConstruction(a);
 check(worker.order.target===b&&!worker.orders.length,'Cancelling the current site advances its queued successor');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];
 for(let i=0;i<16;i++)issueOrder(worker,{kind:'move',x:400+i,y:1000},true);
 const oldFunds=ore,oldCount=units.length;build('relay');command(first,true);
 check(ore===oldFunds&&units.length===oldCount,'A full selected queue rejects placement before spending or creating a foundation');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,false);b=place(second,true);
 b.hp=0;step(60);check(!a.construction&&worker.order?.kind==='gather'&&!worker.orders.length,'Destroyed future sites are skipped without trapping the worker');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,false);b=place(second,true);worker.hp=0;
 step(2);check(constructionCrew(a).active===0&&constructionCrew(b).queued===0&&productionReport(b).text.includes('halted'),'Builder loss leaves both sites visibly halted');
 const replacement=alive(0).find(u=>u.type==='worker');selected=[replacement];const beforeRepair=ore;
 repairOrder(a);repairOrder(b,true);check(ore===beforeRepair,'Replacement assignments never buy the foundations again');
 step(65);check(!a.construction&&!b.construction,'A replacement provisioner can finish the abandoned chain');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,false);b=place(second,true);tacticalOrders('hold');
 check(!worker.orders.length&&constructionCrew(b).queued===0&&productionReport(b).text.includes('halted'),'Hold cancels the worker queue but preserves paid unfinished sites');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];
 const deposit=nodes.find(n=>n.kind==='materials'&&n.x===275);issueOrder(worker,{kind:'gather',node:deposit});
 build('quarry');command(deposit,true);const quarry=alive(0).find(u=>u.type==='quarry');
 check(resourceWorkReport(deposit).state==='queued','Materials report distinguishes a queued quarry from an unassigned foundation');step(.1);
 check(worker.order?.target===quarry,'Blocked Materials gathering yields to the queued quarry construction');
 step(45);check(!quarry.construction&&materials>200,'Queued quarry completes and its provisioner resumes Materials gathering');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];orderRetreat(worker);a=place(first,true);step(65);
 check(!a.construction,'A queued foundation can follow a deliberate retreat to safety');
 fresh();worker=alive(0).find(u=>u.type==='worker');selected=[worker];a=place(first,true);
 nodes.forEach(n=>{n.amount=0;resourceMemory[0].set(n,0)});step(.05);
 check(worker.order?.target===a,'Exhausted gathering with no known replacement advances the queued job');
}
