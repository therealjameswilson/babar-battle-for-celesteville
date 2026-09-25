function depotChecks(check) {
  easy=true;reset();running=true;paused=false;nextWave=enemySpawn=99999;revealUntil=9999;
  check(resourceWorkText({kind:'uranium'},{state:'missing',extracting:0,slots:2})[1]==='ARTILLERY WORKS NEEDED','uranium prerequisite label');
  check(resourceWorkText({kind:'materials'},{state:'missing',extracting:0,slots:3})[1]==='QUARRY NEEDED','materials prerequisite label');
  const stock=nodes.find(isDepotStock);
  check(stock?.x===970&&stock?.y===840,'original central stock preserved');
  check(nodes.filter(isDepotStock).length===1,'only central supply icon integrated');
  const worker=alive(0).find(u=>u.type==='worker');selected=[worker];command({x:stock.x,y:stock.y});
  check(worker.order?.kind==='gather'&&worker.order.node===stock,'stock accepts normal gathering command');
  for(const n of nodes){
    ctx.font='bold 11px monospace';
    const width=ctx.measureText(resourceName(n).toUpperCase()+' '+resourceLabel(n)).width+10;
    const r={x:n.x-width/2,y:n.y+22,width,height:45},c=depotCard(depot,false);
    check(c.x+c.width<r.x||r.x+r.width<c.x||c.y+c.height<r.y||r.y+r.height<c.y,'status clear of '+n.kind+' label/work area');
  }
  const c=depotCard({x:950,y:830,team:-1,progress:4},false);
  check(c.owner==='CENTRAL DEPOT'&&c.progress===.5&&c.benefit.includes('8s'),'neutral capture progress');
  check(depotCard({team:0,progress:0},true).benefit.includes('+0.5 MU/s'),'secured income');
  check(depotCard({team:0,progress:0},false).benefit.includes('+2 S/s · MU stopped'),'interruption retains supplies');
  check(depotCard({team:1,progress:-4},false).captureTeam===1,'rhino capture color');
  check(depotCard({team:1,progress:0},false).benefit.includes('Rhino command'),'rhino budget identified');
  depot.team=0;const raider=add('trooper',1,depot.x+10,depot.y+10);
  check(!munitionsIncome(),'actual enemy presence interrupts munitions');
  const before=JSON.stringify({nodes,units,depot,ore,materials,munitions});
  drawDepotYard(ctx);drawDepotStatus(ctx);drawResourceSprite(stock,true,true);
  check(before===JSON.stringify({nodes,units,depot,ore,materials,munitions}),'drawing does not change simulation');
  raider.hp=0;check(munitionsIncome(),'clearing enemy restores munitions');
}
