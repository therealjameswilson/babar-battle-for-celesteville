const fs=require('node:fs'),assert=require('node:assert/strict');
const {run,resetSeed}=require('./smoke.cjs');
run(fs.readFileSync('tests/defense-strategy.js','utf8'));run(fs.readFileSync('tests/push-strategy.js','utf8'));
const sizeArg=process.argv.find(a=>a.startsWith('--size='));
const commitSize=sizeArg?Number(sizeArg.split('=')[1]):18;
assert([14,18,24].includes(commitSize),'Supported commitment sizes: 14, 18 or 24');
const outcomes=[];
for(const policy of ['march','staged']){
 resetSeed();run(`pushSetup(${commitSize})`);const checkpoints=[];
 for(let n=0;n<900&&!run('ended');n++){
  run(`pushStep('${policy}');for(let k=0;k<20&&!ended;k++){update(.05);pushObserve(.05);}`);
  if([119,179,239,359].includes(n))checkpoints.push(JSON.parse(run('JSON.stringify(pushResult())')));
 }
 const result=JSON.parse(run('JSON.stringify(pushResult())'));outcomes.push({commitSize,policy,checkpoints,result});console.log(JSON.stringify(outcomes.at(-1)));
}
assert.deepEqual(outcomes[0].checkpoints[0],outcomes[1].checkpoints[0],'Command policies must share the same paid opening before commitment');

for(const outcome of outcomes){
 assert(outcome.result.ended,'Paid push comparison must reach a terminal result');
 assert(outcome.result.commitAt>=120,'Offensive commitment must follow the common opening');
 assert(outcome.result.scouted,'The opening must field a scout and observe enemies through normal vision');
}
const staged=outcomes.find(o=>o.policy==='staged').result;
assert(staged.stages.some(s=>s.stage>=4)&&staged.deployedGunSeconds>200,'Staged policy must advance and actually use deployed artillery');
assert(staged.win,'A scouted staged Commander push must be viable with earned resources');
// Do not require the staged policy to win faster than every alternative.
