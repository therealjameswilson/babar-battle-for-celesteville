// Controlled equal-resource comparison. Combat is disabled to isolate delivery
// distance and construction opportunity cost; this is not a full-match win test.
let expansionLedger=null;
function expansionSetup(expand){
 easy=false;reset();running=true;paused=false;nextWave=enemySpawn=9999;
 units=units.filter(u=>!defs[u.type].speed||u.team===0&&u.type==='worker');
 ore=500;materials=0;rebuildNav();
 const stocks=nodes.filter(n=>!n.kind&&n.x>800&&n.x<1200);
 const workers=alive(0).filter(w=>w.type==='worker');
 workers.forEach((w,i)=>{w.x=940+i*28;w.y=970;w.carrying=0;issueOrder(w,{kind:'gather',node:stocks[i%stocks.length]});});
 sightAt=-1;observeResources();
 expansionLedger={expand,cost:0,startStock:stocks.reduce((n,s)=>n+s.amount,0),stocks,workers,site:null};
 if(expand){selected=[workers[0]];build('headquarters');command({x:1020,y:1070});expansionLedger.site=alive(0).find(b=>b.type==='headquarters');expansionLedger.cost=500-ore;}
 return expansionLedger;
}
function expansionResult(){const e=expansionLedger;return {seconds:Math.round(t),expand:e.expand,cost:e.cost,supplies:Math.round(ore),delivered:Math.round(ore-500+e.cost),extracted:e.startStock-e.stocks.reduce((n,s)=>n+s.amount,0),completed:!!e.site&&e.site.hp>0&&!e.site.construction,workers:e.workers.filter(w=>w.hp>0).length};}
