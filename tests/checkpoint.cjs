// State round trips use the engine harness; browser reload/input QA is separate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {run,tick}=require('./smoke.cjs');
run(fs.readFileSync(require('node:path').join(__dirname,'../dist/checkpoint-state.js'),'utf8'));
run('reset();running=true;nextWave=9999;enemySpawn=9999');
tick(100);
run(`const workerSave=alive(0).find(u=>u.type==='worker');
workerSave.order={kind:'gather',node:nodes[0]};
const coreSave=alive(0).find(u=>u.type==='core');
coreSave.queue=['worker'];coreSave.progress=2;
selected=[workerSave];controlGroups[1]=[workerSave.id];
resourceMemory[0].set(nodes[0],nodes[0].amount);
const snapshot=createCheckpoint('test-battle');
const restored=readCheckpoint(snapshot);`);
assert(run('restored.state.selected[0]===restored.state.units.find(u=>u.id===workerSave.id)'));
assert(run('restored.state.selected[0].order.node===restored.state.nodes[0]'));
assert(run('restored.state.resourceMemory[0].has(restored.state.nodes[0])'));
assert.equal(run('restored.state.units.find(u=>u.id===coreSave.id).progress'),2);
run('applyCheckpoint(restored)');
assert(run('paused&&running&&!ended'));
assert(Math.abs(run('t')-5)<1e-9);
// Replaying the same restored timeline yields the same simulated result.
run('paused=false');tick(200);
const outcome=run('JSON.stringify(checkpointGraph(checkpointState()))');
run('applyCheckpoint(readCheckpoint(snapshot));paused=false');tick(200);
assert.equal(run('JSON.stringify(checkpointGraph(checkpointState()))'),outcome,'restored continuation matches original continuation');
// Version/corruption failures must not mutate the running battle.
const before=run('JSON.stringify(checkpointGraph(checkpointState()))');
for(const corruption of [
  'const r=JSON.parse(snapshot);r.schema=999;readCheckpoint(JSON.stringify(r))',
  'const r=readCheckpoint(snapshot);r.state.units[0].hp=NaN;applyCheckpoint(r)',
  'const r=readCheckpoint(snapshot);r.state.selected=[{}];applyCheckpoint(r)',
  'restoreCheckpointGraph({root:{r:9},graph:[]})',
  'restoreCheckpointGraph({root:{r:0},graph:[["object",[["__proto__",null]]]]})'
])assert.throws(()=>run('{'+corruption+'}'));
assert.equal(run('JSON.stringify(checkpointGraph(checkpointState()))'),before);
run(`reset();running=true;t=100;const launchSave=alive(1).find(u=>u.type==='core');
atomicStrikes=[{team:1,site:launchSave,kind:'ballistic',x:200,y:800,at:110}];
heroRecovery=[{team:0,at:150,name:"Babar"}];
const armed=readCheckpoint(createCheckpoint('armed'));
applyCheckpoint(armed);`);
assert(run('atomicStrikes[0].site===units.find(u=>u.id===atomicStrikes[0].site.id)'));
assert.equal(run('atomicStrikes[0].at-t'),10,'incoming strike keeps countdown');
console.log('PASS: checkpoint identity, clock, queues, deterministic continuation, corruption rejection and incoming-strike countdown.');
run('reset();running=true;ore=materials=uranium=10000;nextWave=9999;enemySpawn=9999');
for(const id of run('COURT.filter(c=>c.team===0&&!c.storyOnly).map(c=>c.id)'))run(`usePower(${JSON.stringify(id)})`);
tick(4000);
run('const developed=readCheckpoint(createCheckpoint("developed"));applyCheckpoint(developed)');
assert(run('benefits.size>0&&t>199'),'developed economy and council powers restore');
console.log('PASS: developed battle with all available friendly council powers round trips.');
