const assert=require('node:assert/strict');
const fs=require('node:fs');const {run}=require('./smoke.cjs');
run(fs.readFileSync('tests/expansion-scenario.js','utf8'));
const results=[];
for(const policy of ['home','expand','destroyed']){
 const expand=policy!=='home';
 run(`expansionSetup(${expand})`);
 if(expand)assert(run('!!expansionLedger.site'),'Paid scouted remote headquarters is placed');
 for(const target of [30,60,120,240]){
  run(`while(t<${target}-.001&&!ended){if(${policy==='destroyed'}&&t>=90&&expansionLedger.site.hp>0){expansionLedger.site.hp=0;rebuildSupply();}update(.05)}`);
  results.push({policy,...JSON.parse(run('JSON.stringify(expansionResult())'))});
 }
}
console.log(JSON.stringify(results,null,2));
assert.equal(results[4].cost,400,'Expansion pays the full construction cost');
assert(results[4].supplies<results[0].supplies,'Expansion delays early available resources');
assert(results[7].delivered>results[3].delivered,'Local delivery increases measured income');
assert(results[7].supplies>results[3].supplies,'Protected expansion repays its cost within four minutes');

assert(results[11].delivered<results[7].delivered*.75,'Losing the local delivery base materially cuts earned income');
