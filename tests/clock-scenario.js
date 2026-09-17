// A normal-resource Commander match driven by display frames instead of direct
// simulation calls. The same one-second policy cadence is used in every runtime.
function clockScenario(rate=60){
 doctrineSetup(false);const trace=[];
 for(let second=0;second<900&&!ended;second++){
  doctrineStep('rapid-parallel');
  for(let frame=0;frame<rate&&!ended;frame++)advanceSimulation(1/rate);
  if([1,10,30,60,120,180,240].includes(second+1))trace.push(doctrineSnapshot());
 }
 return {result:doctrineResult(),trace};
}
