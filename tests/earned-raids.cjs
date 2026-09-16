const fs=require('node:fs');
const {run,resetSeed}=require('./smoke.cjs');
for(const f of ['defense-strategy.js','earned-raid-strategy.js'])run(fs.readFileSync('tests/'+f,'utf8'));
const outcomes=[];
for(const timing of ['early','established'])for(const plan of ['main-army','raid']){
 const seed=8;resetSeed(seed);run(`earnedRaidSetup('${timing}')`);const checkpoints=[];
 for(let n=0;n<900&&!run('ended');n++){
  run(`earnedRaidStep('${plan}');for(let k=0;k<20&&!ended;k++){update(.05);earnedRaidObserve();}`);
  if(n===179||n===269||n===359)checkpoints.push(JSON.parse(run('JSON.stringify(earnedRaidResult())')));
 }
 const result=JSON.parse(run('JSON.stringify(earnedRaidResult())'));
 outcomes.push({seed,timing,plan,checkpoints,result});
 console.log(JSON.stringify(outcomes.at(-1)));
 // A 15-minute unresolved match is reported explicitly, not relabeled a victory.
 if(!result.ended&&result.seconds!==900)throw Error('Scenario stopped before its observation window');
 if(result.paidSappers!==4||result.raidReadyAt===null)throw Error('Comparison did not field all four paid sappers');
}

const later=outcomes.filter(o=>o.timing==='established');
if(JSON.stringify(later[0].checkpoints[0])!==JSON.stringify(later[1].checkpoints[0]))throw Error('Matched branches diverged before committing their sapper squad');
if(!later.some(o=>o.result.win))throw Error('Neither established combined-arms commitment could win');
