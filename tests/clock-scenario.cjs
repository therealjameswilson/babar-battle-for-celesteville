const fs=require('node:fs'),assert=require('node:assert/strict');const {run}=require('./smoke.cjs');
for(const file of ['defense-strategy.js','doctrine-strategy.js','clock-scenario.js'])run(fs.readFileSync('tests/'+file,'utf8'));
const reference=JSON.parse(run('JSON.stringify(clockScenario(30))'));
assert(reference.result.ended&&reference.result.win,'Paid fixed-clock Commander match must reach victory');
for(const rate of [60,144])assert.deepEqual(JSON.parse(run(`JSON.stringify(clockScenario(${rate}))`)),reference,`${rate} FPS preserves every recorded state and the full-match result`);
if(process.argv.includes('--save'))fs.writeFileSync('artifacts/clock-node-trace.json',JSON.stringify(reference));
console.log('PASS: 30, 60 and 144 FPS produce identical full Commander match traces and results.');
console.log(JSON.stringify(reference.result));
