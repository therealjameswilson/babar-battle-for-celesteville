
'use strict';
const productionRows=new Map();
function productionSites() {return alive(0).filter(b=>['core','forge','factory'].includes(b.type));}
function productionReport(b) {
  if(b.construction) {
    const assigned=alive(0).filter(w=>w.order?.kind==='build'&&w.order.target===b);
    return {fraction:1-b.construction/(b.buildDuration||defs[b.type].build),
      text:assigned.length?'Construction · '+Math.ceil(b.construction)+'s on-site work':'Construction halted · assign a builder'};
  }
  const isolation=supplied(b)?'':' · ISOLATED: 25% speed';
  if(b.research) {
    const tech=researchDefs[b.research.id];
    return {fraction:b.research.progress/tech.time,text:tech.name+' · '+Math.ceil((tech.time-b.research.progress)/productionRate(b,true))+'s'+isolation+' · '+b.queue.length+' recruits waiting'};
  }
  if(b.queue.length) {
    const first=b.queue[0],remaining=Math.max(0,defs[first].time-b.progress);
    return {fraction:b.progress/defs[first].time,text:defs[first].name+' · '+Math.ceil(remaining/productionRate(b))+'s · '+b.queue.length+'/5 queued'+isolation};
  }
  return {fraction:0,text:'Idle'+isolation};
}
function closeProduction() {$('production-panel').hidden=true;$('production-open').setAttribute('aria-expanded','false');}
function toggleProduction() {
  if(!running||ended||$('court-dialog').open||$('groups-dialog').open||$('help-dialog').open)return;
  const panel=$('production-panel');panel.hidden=!panel.hidden;
  $('production-open').setAttribute('aria-expanded',String(!panel.hidden));
  renderProduction();
}
function selectProduction(sites) {
  if(!running||ended)return;
  selected=sites.filter(b=>b.hp>0&&b.team===0);
  if(selected.length){cam.x=selected[0].x;cam.y=selected[0].y;}
  mode=null;placing=null;closeProduction();updateUI(true);
}
function renderProduction() {
  const sites=productionSites();
  const idle=sites.filter(b=>!b.construction&&!b.research&&!b.queue.length).length;
  const label='Production · '+idle+' idle · F4';
  if($('production-open').textContent!==label)$('production-open').textContent=label;
  if(ended)closeProduction();
  if($('production-panel').hidden)return;
  const holder=$('production-rows');
  for(const [id,row] of productionRows) if(!sites.some(b=>b.id===id&&row.site===b)){row.button.remove();productionRows.delete(id);}
  for(const b of sites) {
    let row=productionRows.get(b.id);
    if(!row){
      const button=document.createElement('button'),name=document.createElement('strong'),status=document.createElement('span'),progress=document.createElement('progress');
      progress.max=1;button.appendChild(name);button.appendChild(status);button.appendChild(progress);
      button.onclick=()=>selectProduction([b]);holder.appendChild(button);
      row={site:b,button,name,status,progress};productionRows.set(b.id,row);
    }
    const report=productionReport(b);
    const peers=sites.filter(s=>s.type===b.type);
    row.name.textContent=(b.name||defs[b.type].name)+(peers.length>1?' · '+(peers.indexOf(b)+1):'');
    row.status.textContent=report.text;row.progress.value=Math.max(0,Math.min(1,report.fraction));
    row.progress.setAttribute('aria-label',row.name.textContent+' progress');
  }
  $('production-all').disabled=!sites.some(b=>!b.construction);
}
$('production-open').onclick=toggleProduction;
$('production-close').onclick=closeProduction;
$('production-all').onclick=()=>selectProduction(productionSites().filter(b=>!b.construction));
