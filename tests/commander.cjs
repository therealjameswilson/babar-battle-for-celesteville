// A defensive Commander opening must win through ordinary player actions.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {run,resetSeed}=require('./smoke.cjs');
run(fs.readFileSync('tests/defense-strategy.js','utf8'));
resetSeed();run('uid=0;easy=false;reset();running=true;');
let fortified=false,deployed=false,scouted=false;
for(let n=0;n<1200&&!run('ended');n++){
  run('defenseStep();for(let k=0;k<20&&!ended;k++)update(.05)');
  scouted ||=run("alive(0).some(u=>u.type==='scout')");
  fortified ||=run("alive(0).some(u=>u.type==='turret'&&!u.construction)");
  deployed ||=run("alive(0).some(u=>u.type==='walker'&&u.deployed)");
  if(n%120===0)console.log(run('JSON.stringify({t,ore,materials,workers:alive(0).filter(u=>u.type==="worker").length,army:supply(),palace:alive(0).find(u=>u.type==="core")?.hp})'));
}
const result=JSON.parse(run('JSON.stringify({seconds:Math.round(t),ended,win:ended&&alive(0).some(u=>u.type==="core"),palace:alive(0).find(u=>u.type==="core")?.hp,kills})'));
console.log(JSON.stringify({difficulty:'Commander',opening:'defensive',fortified,deployed,scouted,...result}));
assert(fortified&&deployed&&scouted,'Defensive strategy must field reconnaissance, build fortifications and deploy artillery');
assert(result.win,'Defensive Commander opening must win with normal starting resources and earned income');
