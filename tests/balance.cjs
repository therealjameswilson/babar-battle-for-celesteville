const fs = require('node:fs');
const { run } = require('./smoke.cjs');
run(fs.readFileSync('tests/strategy.js', 'utf8'));
run('easy=true;reset();running=true;');
for (let n = 0; n < 1500; n++) {
  run('strategyStep();for(let k=0;k<20&&!ended;k++)update(.05)');
  if (n % 60 === 0)
    console.log(
      run(
        'JSON.stringify({t,ore,army:supply(),cap:cap(),depot:depot.team,enemy:alive(1).length,kills,palace:alive(0).find(u=>u.type==="core")?.hp,fortress:alive(1).find(u=>u.type==="core")?.hp})'
      )
    );
  if (run('ended')) break;
}
console.log(
  'END',
  run('JSON.stringify({t,ended,win:!!alive(0).find(u=>u.type==="core"),navigation:navStats})')
);

require('node:assert/strict')(
  run(`ended && alive(0).some(u=>u.type==="core")`),
  'Story strategy must reach a victory with earned supplies'
);
