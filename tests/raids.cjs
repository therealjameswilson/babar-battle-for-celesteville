const fs=require('node:fs');
const {run,resetSeed}=require('./smoke.cjs');
run(fs.readFileSync('tests/raid-strategy.js','utf8'));
const results=[];
for(const composition of ['guards','sappers'])for(const plan of ['control','raid']){
 resetSeed();run(`raidSetup('${composition}')`);
 const checkpoints=[];
 for(let n=0;n<180&&!run('ended');n++){
  run(`raidStep('${plan}');for(let k=0;k<20&&!ended;k++){update(.05);raidObserve();}`);
  if(n===44||n===89)checkpoints.push(JSON.parse(run('JSON.stringify(raidResult())')));
 }
 const result={composition,plan,checkpoints,...JSON.parse(run('JSON.stringify(raidResult())'))};results.push(result);console.log(JSON.stringify(result));
}

for(const composition of ['guards','sappers']) {
 const control=results.find(r=>r.composition===composition&&r.plan==='control');
 const raid=results.find(r=>r.composition===composition&&r.plan==='raid');
 if(control.seconds!==180||raid.seconds!==180)throw Error('Matched scenario terminated prematurely');
 const attackControl=control.checkpoints[0],attackRaid=raid.checkpoints[0];
 if(attackControl.seconds!==45||attackRaid.seconds!==45)throw Error('Missing matched active-raid observation');
 if(attackRaid.extractedMaterials>=attackControl.extractedMaterials*.8)throw Error('Quarry raid no longer materially disrupts extraction during its attack window');
 // Guard harassment can be recovered from after the squad withdraws or dies.
 // Demolition must still deny extraction at the final observation.
 if(composition==='sappers'&&raid.extractedMaterials>=control.extractedMaterials*.8)throw Error('Destroyed quarry no longer denies long-term extraction');
 if(!raid.quarryAlive&&raid.originalQuarryDestroyed&&raid.extractedMaterials!==attackRaid.extractedMaterials)throw Error('Materials extracted after destruction without a replacement quarry');
}
if(!results.find(r=>r.composition==='sappers'&&r.plan==='raid').originalQuarryDestroyed)throw Error('Demolition raid failed to destroy the original quarry');
// Do not assert a military advantage that this comparison does not demonstrate.
