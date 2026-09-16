// Comparative balance evidence, not a claim that every opening should win.
const fs=require('node:fs');
const {run}=require('./smoke.cjs');
run(fs.readFileSync('tests/strategy.js','utf8'));
for(const difficulty of ['Story','Commander']) for(const plan of ['siege','mixed']) {
  run(`easy=${difficulty==='Story'};reset();running=true;`);
  let fieldedSappers=false;
  for(let n=0;n<900&&!run('ended');n++) {
    run(`strategyStep('${plan}');for(let k=0;k<20&&!ended;k++)update(.05)`);
    fieldedSappers ||= run("alive(0).some(u=>u.type==='sapper')");
  }
  const result=JSON.parse(run('JSON.stringify({seconds:Math.round(t),ended,win:ended&&alive(0).some(u=>u.type==="core"),palace:alive(0).find(u=>u.type==="core")?.hp||0,kills,enemyResearch:[...enemyTechnologies],enemySpent})'));
  console.log(JSON.stringify({difficulty,plan,fieldedSappers,...result}));
  if(!result.ended || !Number.isFinite(result.seconds))throw Error('Balance scenario failed to resolve');
  if(plan==='mixed'&&!fieldedSappers)throw Error('Mixed strategy never fielded its intended counter unit');
}
