const fs=require('node:fs');
const assert=require('node:assert/strict');
const {run,resetSeed}=require('./smoke.cjs');
for(const file of ['burst-strategy.js','burst-comparison-checks.js'])run(fs.readFileSync('tests/'+file,'utf8'));
// Reset seed once; the scenarios themselves use no random deployment choices.
resetSeed();
const results=JSON.parse(run('JSON.stringify(burstComparisons((ok,label)=>{if(!ok)throw Error(label)}))'));
assert.equal(results.length,8);
for(const result of results)console.log(JSON.stringify(result));
