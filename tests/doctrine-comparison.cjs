const fs=require('node:fs'),assert=require('node:assert/strict');
const {run,resetSeed}=require('./smoke.cjs');
for(const file of ['defense-strategy.js','doctrine-strategy.js'])run(fs.readFileSync('tests/'+file,'utf8'));
const results=[],openings=new Map();
for(const story of [true,false])for(const policy of ['troops','drill','rapid']){
 resetSeed();run(`doctrineSetup(${story})`);const checkpoints=[];
 for(let n=0;n<900&&!run('ended');n++){
  run(`doctrineStep('${policy}');for(let k=0;k<20&&!ended;k++)update(.05)`);
  if([120,180,240].includes(n+1))checkpoints.push(JSON.parse(run('JSON.stringify(doctrineResult())')));
 }
 const result=JSON.parse(run('JSON.stringify(doctrineResult())'));
 console.log(JSON.stringify({difficulty:story?'Story':'Commander',policy,checkpoints,result}));
 results.push(result);
 const beforeChoice=checkpoints.find(r=>r.seconds===120);
 assert(beforeChoice,'Every policy must reach the common 120s starting comparison');
 if(openings.has(story))assert.deepEqual(beforeChoice,openings.get(story),'Policies must have identical state before research reservation begins');
 else openings.set(story,beforeChoice);
 if(policy==='troops')assert.deepEqual(result.purchases,[]);
 else assert(result.technologies.includes('drill'),'The paid weapons policy must complete its prerequisite');
 if(policy==='rapid')assert(result.readyAt!==null&&result.activations>0,'Both difficulties must actually complete and activate the paid doctrine');
 assert.equal(new Set(result.purchases.map(p=>p.id)).size,result.purchases.length,'Research is purchased once');
 assert(result.ended,'Policy must reach a terminal match result within 900s');
 for(const p of result.purchases){assert.equal(p.supplies,p.id==='drill'?150:180);assert.equal(p.materials,p.id==='rapid'?60:0);}
}
assert(results.some(r=>r.readyAt!==null&&r.activations>0),'At least one paid doctrine policy must complete research and use the ability');
