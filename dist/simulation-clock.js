'use strict';
// Gameplay advances at 20 Hz independently of display refresh. Five catch-up
// ticks cap a stalled frame; paused/hidden time never becomes gameplay backlog.
const SIMULATION_STEP=.05, MAX_CATCHUP_STEPS=5;
let simulationRemainder=0, renderSamples=new Map(), renderSampleTime=-1;
function resetSimulationClock(){
  simulationRemainder=0;renderSamples.clear();renderSampleTime=-1;last=null;
}
function advanceSimulation(elapsed){
  if(!running||paused||ended){resetSimulationClock();return 0;}
  if(!Number.isFinite(elapsed)||elapsed<=0)return 0;
  simulationRemainder+=Math.min(elapsed,SIMULATION_STEP*MAX_CATCHUP_STEPS);
  let steps=0;
  while(simulationRemainder+1e-9>=SIMULATION_STEP&&steps<MAX_CATCHUP_STEPS&&!ended&&!paused){
    const before=new Map(units.filter(u=>u.hp>0).map(u=>[u.id,{x:u.x,y:u.y}]));
    update(SIMULATION_STEP);
    renderSamples=before;renderSampleTime=t;
    simulationRemainder=Math.max(0,simulationRemainder-SIMULATION_STEP);steps++;
  }
  return steps;
}
function renderedPosition(u){
  const previous=renderSamples.get(u.id);
  if(paused||ended||renderSampleTime!==t||!previous)return u;
  const fraction=clamp(simulationRemainder/SIMULATION_STEP,0,1);
  return {x:previous.x+(u.x-previous.x)*fraction,y:previous.y+(u.y-previous.y)*fraction};
}
