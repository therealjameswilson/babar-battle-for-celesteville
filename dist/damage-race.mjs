const ladder=Object.freeze(['Community warning network','Emergency shelters','Medical readiness','Civil recovery network','Crisis communications pact']);
const names=['King Babar','Lord Rataxes'];
const rivalMoves=['research','protect','research','talk','research','protect','research'];
const crisisTurns=new Set([2,4,6,8,10]);
export {ladder};
export function startRace(){return {turn:0,sides:[0,1].map(()=>({step:0,leader:3,shelter:0,harm:0})),out:null};}
function act(s,action){
  if(action==='research')s.step=Math.min(ladder.length,s.step+1);
  else if(action==='protect'){s.shelter=Math.min(2,s.shelter+1);s.leader=Math.min(3,s.leader+1);}
}
export function stepRace(state,action){
  if(state.out||!['research','protect','talk'].includes(action))return state;
  const turn=state.turn+1,sides=state.sides.map(s=>({...s})),rival=rivalMoves[(turn-1)%rivalMoves.length];
  act(sides[0],action);act(sides[1],rival);
  if(crisisTurns.has(turn)&&action!=='talk'&&rival!=='talk'){
    for(const side of sides) {
      if(side.shelter)side.shelter--;
      else{side.leader--;side.harm+=side.step>=3?1:2;}
    }
  }
  const qualifies=sides.map(s=>s.step===ladder.length&&s.leader>0);
  let out=null;
  if(qualifies.every(Boolean))out=sides[0].harm===sides[1].harm?'draw':sides[0].harm<sides[1].harm?'win':'loss';
  else if(qualifies[0])out='win';else if(qualifies[1])out='loss';
  else if(sides.every(s=>s.leader<=0)||turn>=12)out='draw';
  else if(sides[0].leader<=0)out='loss-no-winner';else if(sides[1].leader<=0)out='rival-out';
  return {turn,sides,out};
}
const dialog=globalThis.document?.getElementById('damage-race');
if(dialog){
  let s,side=0;
  const by=id=>document.getElementById(id),buttons=[...dialog.querySelectorAll('[data-race]')];
  by('race-ladder').replaceChildren(...ladder.map(name=>{const li=document.createElement('li');li.textContent=name;return li;}));
  function render(){
    const [mine,rival]=s.sides;
    const result={win:'Your side wins: its civic ladder is complete and its leader survived.',loss:'Your rival finished first with their leader alive.',draw:'No winner.', 'loss-no-winner':'Your leader did not survive. No winner: neither surviving side completed the ladder.', 'rival-out':'Rival leader did not survive. No winner: neither surviving side completed the ladder.'}[s.out];
    by('race-board').textContent=(result?result+' ':'')+'Turn '+s.turn+' · '+names[side]+': '+mine.step+'/'+ladder.length+' readiness, '+Math.max(0,mine.leader)+'/3 leader safety, '+mine.harm+' community harm. '+names[side^1]+': '+rival.step+'/'+ladder.length+' readiness, '+Math.max(0,rival.leader)+'/3 leader safety, '+rival.harm+' community harm.';
    Array.from(by('race-ladder').children).forEach((li,i)=>li.textContent=(i<mine.step?'Complete: ':'')+ladder[i]);
    buttons.forEach(b=>b.disabled=!!s.out);
  }
  by('open-damage-race').addEventListener('click',()=>dialog.showModal());
  by('race-close').addEventListener('click',()=>dialog.close());
  by('race-start').addEventListener('click',()=>{side=Number(by('race-side').value);s=startRace();by('race-play').hidden=false;render();});
  buttons.forEach(b=>b.addEventListener('click',()=>{s=stepRace(s,b.dataset.race);render();if(s.out)dialog.dispatchEvent(new Event('race-finished'));}));
}
