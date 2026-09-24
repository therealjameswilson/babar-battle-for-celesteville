'use strict';
// Presentation state is disposable. Orders, costs and progression remain in the engine.
let actionCategory='all',actionSelection='',actionFilterKey='',pauseShown=false;
function classifyAction(name){
  if(name.startsWith('Cancel'))return 'queue';
  if(Object.values(researchDefs).some(tech=>tech.name===name))return 'research';
  const type=Object.keys(defs).find(type=>defs[type].name===name||type==='bike'&&name==='Arthur’s Motorbike');
  if(type)return defs[type].speed?'recruit':'build';
  return 'command';
}
function renderActionFilters(){
  const bar=$('action-filters'),buttons=[...$('actions').children];
  const identity=selected.map(u=>u.id).join(',');
  if(identity!==actionSelection){actionSelection=identity;actionCategory='all';}
  const categories=[...new Set(buttons.map(b=>b.dataset.category))].filter(Boolean);
  if(!categories.includes(actionCategory))actionCategory='all';
  bar.hidden=categories.length<2||buttons.length<7;
  const labels={all:'All',recruit:'Recruit',build:'Build',research:'Research',command:'Orders',queue:'Queue'};
  const key=categories.join(',')+':'+actionCategory+':'+buttons.length;
  if(key!==actionFilterKey){
    actionFilterKey=key;bar.replaceChildren();
    for(const category of ['all',...categories]){
      const b=document.createElement('button');b.textContent=labels[category];b.dataset.category=category;
      b.setAttribute('aria-pressed',String(category===actionCategory));
      b.onclick=()=>{actionCategory=category;renderActionFilters();};bar.appendChild(b);
    }
  }
  for(const b of buttons)b.hidden=!bar.hidden&&actionCategory!=='all'&&b.dataset.category!==actionCategory;
}
function updatePresentation(){
  const panel=$('pause-panel');
  const show=running&&!ended&&paused&&!document.querySelector('dialog[open]');
  if(show!==pauseShown){
    pauseShown=show;panel.hidden=!show;$('pause-shade').hidden=!show;
    if(show){
      const soldiers=alive(0).filter(u=>defs[u.type].damage&&defs[u.type].speed).length;
      $('pause-report').textContent=`${time(t)} elapsed · ${soldiers} combat units · ${Math.floor(ore)} supplies`;
      if(document.hidden!==true)$('pause-resume').focus({preventScroll:true});
      if(typeof controller!=='undefined'&&controller.active){controller.focus=$('pause-resume');controllerFocus();}
    }
  }
}
function renderDebrief(win){
  $('pause-panel').hidden=true;$('pause-shade').hidden=true;pauseShown=false;
  const box=$('overlay');
  box.innerHTML=`<section class="brief debrief ${win?'won':'lost'}" aria-labelledby="debrief-title">
    <div class="debrief-mark" aria-hidden="true">${win?'VICTORY':'REGROUP'}</div>
    <p class="eyebrow">AFTER-ACTION REPORT · ${easy?'STORY':'COMMANDER'}</p>
    <h1 id="debrief-title">${win?'Celesteville holds.':'The line has broken.'}</h1>
    <p>${win?'Rataxes’s fortress is secured. Bring the wounded home. The kingdom will remember those who held the line.':'The palace has fallen. Rebuild your supply line, protect the field guns, and return with a stronger plan.'}</p>
    <div class="debrief-stats"><div><b>${time(t)}</b><span>Mission time</span></div><div><b>${wave}</b><span>Assault waves</span></div><div><b>${kills}</b><span>Enemy losses</span></div><div><b>${alive(0).filter(u=>defs[u.type].speed).length}</b><span>Units remaining</span></div></div>
    <p class="debrief-doctrine">${win?'A combined force wins the ground. A working supply line keeps it.':'Scout the approaches. Keep infantry ahead of artillery. Withdraw wounded troops to supplied homes.'}</p>
    <div class="launch"><button id="again">${win?'Command another battle':'Regroup and try again'} →</button></div>
  </section>`;
  $('again').onclick=restartMission;$('again').focus({preventScroll:true});
  if(typeof controller!=='undefined'&&controller.active){controller.focus=$('again');controllerFocus();}
}
$('pause-resume').onclick=()=>{if(paused)togglePause();updatePresentation();};
$('pause-settings').onclick=()=>$('help').click();
$('pause-council').onclick=()=>$('court-open').click();
$('difficulty').addEventListener('change',()=>{
  $('difficulty-note').textContent=$('difficulty').value==='easy'
    ? 'More time to prepare, lighter enemy damage, and a stronger chance to recover.'
    : 'Faster assaults and sustained pressure. Scout early, control supply, and field a combined force.';
});

const compactBriefing=matchMedia('(max-height:500px) and (min-width:581px)');
function fitBriefing(){if($('brief-orders'))$('brief-orders').open=!compactBriefing.matches;}
compactBriefing.addEventListener('change',fitBriefing);fitBriefing();

// Keep keyboard navigation inside the full-screen briefing/result and pause card.
// Native dialogs provide their own focus trap.
document.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  const root=!$('overlay').classList.contains('hidden')?$('overlay'):pauseShown?$('pause-panel'):null;
  if(!root)return;
  e.stopPropagation();
  if(e.key==='Escape'&&pauseShown){e.preventDefault();$('pause-resume').click();return;}
  if(e.key!=='Tab')return;
  const focusable=[...root.querySelectorAll('button,select,input,summary')].filter(el=>!el.disabled&&el.getClientRects().length&&!el.closest('[hidden]'));
  const index=focusable.indexOf(document.activeElement);
  if(index<0||(!e.shiftKey&&index===focusable.length-1)||(e.shiftKey&&index===0)){
    e.preventDefault();focusable[e.shiftKey?focusable.length-1:0]?.focus();
  }
},true);
