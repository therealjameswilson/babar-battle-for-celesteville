const assert=require('node:assert/strict');
const {run}=require('./smoke.cjs');
run(`this.originalNearest=(u,list)=>list.reduce((best,a)=>(!best||dist(u,a)<dist(u,best)?a:best),null);
 this.lookupChecks=0;
 for(let trial=0;trial<300;trial++){
  const origin={x:Math.random()*1800,y:Math.random()*1260};
  const list=Array.from({length:trial%150},(_,i)=>({id:i,x:Math.random()*1800,y:Math.random()*1260}));
  if(nearest(origin,list)!==originalNearest(origin,list))throw Error('Nearest identity differs');
  lookupChecks++;
 }
 this.origin={x:0,y:0};this.first={x:1,y:0};this.second={x:-1,y:0};
`);
assert.equal(run('lookupChecks'),300);
assert(run('nearest(origin,[])===null'));
assert(run('nearest(origin,[first])===first'));
assert(run('nearest(origin,[first,second])===first'),'Equidistant units retain list order');
run(`this.distanceCalls=0;this.countedOrigin={get x(){distanceCalls++;return 0},y:0};
 this.longList=Array.from({length:100},(_,i)=>({x:i+1,y:0}));nearest(countedOrigin,longList);this.newCalls=distanceCalls/2;
 distanceCalls=0;originalNearest(countedOrigin,longList);this.oldCalls=distanceCalls/2;`);
assert.equal(run('newCalls'),100);
assert.equal(run('oldCalls'),198);
console.log('PASS: nearest identity on 300 seeded lists, empty/single/tied cases, and 100 rather than 198 distances for 100 candidates.');
