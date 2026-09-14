'use strict';
let courtTeam=0,courtWasPaused=false;
function powerReady(member){return member.cooldown?Math.max(0,(usedPowers[member.id]??-1000)+member.cooldown-t):benefits.has(member.id)?Infinity:0;}
function usePower(id){
  const member=COURT.find(c=>c.id===id);
  if(!member||member.team!==0||!running||ended)return false;
  if(powerReady(member)>0)return false;
  if(ore<member.cost){say('You need more fruit for '+member.name+'’s help.');return false;}
  const leader=alive(0).find(u=>u.type==='hero');
  if(id==='babar'&&!leader){say('Babar is resting. He will be back soon.');return false;}
  ore-=member.cost;usedPowers[id]=t;
  if(!member.cooldown)benefits.add(id);
  if(id==='babar')for(const u of alive(0).filter(u=>defs[u.type].speed&&dist(u,leader)<210))u.hp=Math.min(u.max,u.hp+80);
  if(id==='alexander')nextWave+=25;
  if(id==='zephir')revealUntil=t+25;
  if(id==='truffles')for(const u of alive(0).filter(u=>defs[u.type].speed))u.hp=Math.min(u.max,u.hp+100);
  if(id==='isabelle'||id==='babar-mother'||id==='old-tusk'){
    const gain=id==='isabelle'?20:id==='babar-mother'?30:60;
    for(const u of alive(0).filter(u=>id==='isabelle'?defs[u.type].speed:u.type===(id==='babar-mother'?'worker':'walker'))){u.max+=gain;u.hp+=gain;}
  }
  if(id==='badou')nodes.push({x:550,y:1100,r:20,amount:2200});
  if(id==='periwinkle')for(const r of heroRecovery.filter(r=>r.team===0))r.at=Math.min(r.at,t+12);
  if(id==='babar'&&leader)fx.push({x:leader.x,y:leader.y,life:1,max:1,ring:true});
  say(member.name+': '+member.title+'!');updateUI(true);renderCourt();return true;
}
function renderCourt(){
  $('court-funds').textContent='Fruit available: '+Math.floor(ore)+(running?'':' · Begin an adventure to use powers');
  $('tab-elephants').setAttribute('aria-pressed',String(courtTeam===0));$('tab-rhinos').setAttribute('aria-pressed',String(courtTeam===1));
  const holder=$('court-roster');holder.replaceChildren();let group='';
  for(const member of COURT.filter(c=>c.team===courtTeam)){
    if(member.group!==group){group=member.group;const h=document.createElement('h3');h.textContent=group;holder.appendChild(h);}
    const card=document.createElement('article');card.className='court-card'+(member.team?' rhino':'');
    const ready=powerReady(member),active=benefits.has(member.id);
    let label=active?'Helping the kingdom':ready>0?'Ready in '+Math.ceil(ready)+'s':member.cost?'Invite · '+member.cost+' fruit':'Use royal rally';
    if(member.team){const onset={rataxes:2,lady:1,basil:2,victor:3,rhudi:4}[member.id];label=wave>=onset?'In effect':'From wave '+onset;}
    card.innerHTML='<div class="member-top"><span class="member-monogram">'+member.initials+'</span><div><h4>'+member.name+'</h4><p>'+member.relation+'</p></div></div><strong>'+member.title+'</strong><p>'+member.text+'</p>';
    const button=document.createElement('button');button.textContent=label;
    button.disabled=!!member.team||!running||ended||active||ready>0||ore<member.cost;
    button.onclick=()=>usePower(member.id);card.appendChild(button);holder.appendChild(card);
  }
}
function openCourt(){courtWasPaused=paused;if(running&&!paused)togglePause();renderCourt();$('court-dialog').showModal();}
function closeCourt(){ $('court-dialog').close(); }
$('court-open').onclick=openCourt;$('court-close').onclick=closeCourt;
$('court-dialog').addEventListener('close',()=>{if(running&&!courtWasPaused&&paused)togglePause();});
$('tab-elephants').onclick=()=>{courtTeam=0;renderCourt();};$('tab-rhinos').onclick=()=>{courtTeam=1;renderCourt();};
