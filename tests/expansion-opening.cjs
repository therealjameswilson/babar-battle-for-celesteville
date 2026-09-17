const fs=require('node:fs'),assert=require('node:assert/strict');
const {run,resetSeed}=require('./smoke.cjs');
for(const file of ['defense-strategy.js','push-strategy.js','expansion-opening.js'])run(fs.readFileSync('tests/'+file,'utf8'));
const outcomes=[];
for(const policy of ['army','early','secured']){
 resetSeed();run(`expansionOpeningSetup('${policy}')`);const checkpoints=[];
 for(let n=0;n<900&&!run('ended');n++){
  run('expansionOpeningStep();for(let k=0;k<20&&!ended;k++){update(.05);expansionOpeningObserve(.05);}');
  if([59,119,179,239,359].includes(n))checkpoints.push(JSON.parse(run('JSON.stringify(expansionOpeningResult())')));
 }
 const result=JSON.parse(run('JSON.stringify(expansionOpeningResult())'));outcomes.push({policy,checkpoints,result});console.log(JSON.stringify(outcomes.at(-1)));
}
// Inspection comes before outcome assertions: do not define balance as all
// openings winning, or edit combat values just to produce a preferred table.

function openingState(o){const {policy,...state}=o.checkpoints[0];return state;}
assert.deepEqual(openingState(outcomes[0]),openingState(outcomes[1]),'Expansion choices must follow an identical first minute');
assert.deepEqual(openingState(outcomes[0]),openingState(outcomes[2]),'Secured expansion must also share the normal-resource opening');
for(const o of outcomes){
 assert(o.result.ended,'Each measured opening must reach a terminal result');
 if(o.policy==='army')continue;
 assert(o.result.investment>=400&&o.result.finishedAt>o.result.paidAt+29,'Camp investment must be paid and consume real construction time');
 assert(o.result.campDeliveries>0,'Full-match expansion must actually deliver gathered cargo');
}
const early=outcomes[1],secured=outcomes[2];
assert(early.checkpoints[1].palace<outcomes[0].checkpoints[1].palace,'The early diversion exposes a measured defensive opportunity cost');
assert(secured.result.startedAt>early.result.startedAt,'Securing the depot must delay the expansion decision');
assert(secured.result.win&&secured.result.campDeliveries>secured.result.investment,'A protected, paid expansion must remain a viable earned-resource opening');
// Early defeat and exact victory times are reported, not enforced as universal
// balance rules. The tested regression is a cost and a viable alternative.
