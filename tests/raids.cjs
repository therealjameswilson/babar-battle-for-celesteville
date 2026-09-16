const fs=require('node:fs');
const {run,resetSeed}=require('./smoke.cjs');
run(fs.readFileSync('tests/raid-strategy.js','utf8'));
const results=[];
for(const composition of ['guards','sappers'])for(const plan of ['control','raid']){
 resetSeed();run(`raidSetup('${composition}')`);
 for(let n=0;n<180&&!run('ended');n++)run(`raidStep('${plan}');for(let k=0;k<20&&!ended;k++){update(.05);raidObserve();}`);
 const result={composition,plan,...JSON.parse(run('JSON.stringify(raidResult())'))};results.push(result);console.log(JSON.stringify(result));
}

for(const composition of ['guards','sappers']) {
 const control=results.find(r=>r.composition===composition&&r.plan==='control');
 const raid=results.find(r=>r.composition===composition&&r.plan==='raid');
 if(control.seconds!==180||raid.seconds!==180)throw Error('Matched scenario terminated prematurely');
 if(raid.extractedMaterials>=control.extractedMaterials*.8)throw Error('Quarry raid no longer materially disrupts extraction');
 if(raid.enemySpent<=control.enemySpent)throw Error('Raid no longer forces paid repairs or rebuilding');
}
if(!results.find(r=>r.composition==='sappers'&&r.plan==='raid').originalQuarryDestroyed)throw Error('Demolition raid failed to destroy the original quarry');
// Do not assert a military advantage that this comparison does not demonstrate.
