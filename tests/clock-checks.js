function clockChecks(check){
 const fresh=()=>{easy=false;reset();running=true;paused=false;nextWave=enemySpawn=9999;
 const scout=add('scout',0,690,600);issueOrder(scout,{kind:'move',x:1050,y:600});};
 const state=()=>JSON.stringify({t,ore,materials,units:units.map(u=>[u.id,u.x,u.y,u.hp,u.carrying,u.harvest,u.order?.kind])});
 const atRate=rate=>{fresh();for(let i=0;i<rate*3;i++)advanceSimulation(1/rate);return state();};
 const reference=atRate(20);
 for(const rate of [10,30,60,144])check(atRate(rate)===reference,`${rate} FPS produces identical economy and movement after three seconds`);
 fresh();for(let i=0;i<30;i++)for(const dt of [.012,.024,.036,.028])advanceSimulation(dt);
 check(state()===reference,'Jittered display frames preserve the same fixed simulation sequence');
 fresh();advanceSimulation(.024);check(t===0,'Sub-tick display frames accumulate without changing gameplay');
 const unit=alive(0).find(u=>u.type==='worker'),before={x:unit.x,y:unit.y};advanceSimulation(.026);
 check(Math.abs(t-.05)<1e-10,'Accumulated fifty milliseconds executes exactly one tick');
 const visual=renderedPosition(unit);check(visual.x===before.x&&visual.y===before.y,'Rendering begins interpolation from the previous simulation position');
 const actual={x:unit.x,y:unit.y};advanceSimulation(.025);const middle=renderedPosition(unit);
 check(middle.x===(before.x+actual.x)/2&&middle.y===(before.y+actual.y)/2&&unit.x===actual.x,'Half-tick interpolation smooths drawing without moving simulation units');
 togglePause();const pausedAt=t;advanceSimulation(30);
 check(t===pausedAt&&simulationRemainder===0&&renderedPosition(unit)===unit,'Pause discards elapsed time and draws exact frozen state');
 togglePause();advanceSimulation(.025);check(t===pausedAt,'Resume starts a fresh tick rather than replaying paused time');
 fresh();check(advanceSimulation(10)===MAX_CATCHUP_STEPS&&t===.25,'Long stalls have a bounded five-tick catch-up budget');
 const stalledAt=t;advanceSimulation(NaN);advanceSimulation(-1);check(t===stalledAt,'Invalid or reversed frame time cannot corrupt simulation state');
 reset();check(simulationRemainder===0&&renderSamples.size===0&&last===null,'Restart clears the frame clock and interpolation samples');
 fresh();ended=true;advanceSimulation(1);check(t===0&&simulationRemainder===0,'Ended matches cannot advance through frame catch-up');
}
