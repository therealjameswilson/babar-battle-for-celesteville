'use strict';
// Paid foundations can wait in a provisioner's existing sixteen-order queue.
function constructionWorker(p, append=false) {
  const workers=alive(0).filter(w=>w.type==='worker');
  const chosen=workers.filter(w=>selected.includes(w));
  const hasRoom=w=>!w.order||w.order.kind==='hold'||(w.orders?.length||0)<16;
  if(append&&chosen.length)return nearest(p,chosen.filter(hasRoom));
  const available=workers.filter(w=>w.order?.kind!=='build'&&(!append||hasRoom(w)));
  return nearest(p,available.filter(w=>selected.includes(w)))||nearest(p,available);
}
function finishConstructionOrder(worker) {
  completeOrder(worker);
  if(!worker.order&&worker.returnToWork)worker.order=worker.returnToWork;
  // Keep automatic gathering only across consecutive construction orders.
  if(worker.order?.kind!=='build')worker.returnToWork=null;
}
function removeConstructionOrders(site) {
  for(const worker of alive(0).filter(w=>w.type==='worker')) {
    worker.orders=(worker.orders||[]).filter(o=>!(o.kind==='build'&&o.target===site));
    if(worker.order?.kind==='build'&&worker.order.target===site)finishConstructionOrder(worker);
  }
}
function constructionCrew(site) {
  const workers=alive(site.team).filter(w=>w.type==='worker');
  return {
    active:workers.filter(w=>w.order?.kind==='build'&&w.order.target===site).length,
    queued:workers.filter(w=>w.orders?.some(o=>o.kind==='build'&&o.target===site)).length,
  };
}
