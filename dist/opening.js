'use strict';
// Original fictional dispatches, not quotations or claims about book continuity.
const OPENING_SCENES = [
  {tag:'I · THE ULTIMATUM',title:'Rataxes marches.',speaker:'BASIL · RHINOLAND HIGH COMMAND',line:'The eastern road is secured, my lord. The guns await your order.',reply:'RATAXES: “Babar has held this border long enough. At dawn, we take it.”',side:'rataxes'},
  {tag:'II · THE ANSWER',title:'Babar stands.',speaker:'CORNELIUS · CELESTEVILLE COUNCIL',line:'Their columns outnumber the border guard. We can still withdraw the town.',reply:'BABAR: “Celeste will bring the families to safety. I will hold the road.”',side:'babar'},
  {tag:'III · THE NUCLEAR AGE',title:'The war changes.',speaker:'CORNELIUS · A SEALED DISPATCH',line:'As the war escalates, Uranium will feed atomic weapons—and then the H-bomb. Every deposit becomes a front.',reply:'Once nuclear weapons are acquired, even Arthur’s motorbike can carry a neutron strike.',side:'both',nuclear:'arsenal'},
  {tag:'IV · THE SIRENS',title:'Bring them under cover.',speaker:'CELESTE · CIVIL DEFENSE',line:'Study Damage Limitation. Build the shelters before the warning comes. When a launch is detected, the workers will run for cover.',reply:'A weapon may win ground. A shelter may save the people who must rebuild it.',side:'babar',nuclear:'shelter'},
  {tag:'V · THE FINAL ORDER',title:'Only the king.',speaker:'BABAR AND RATAXES · NUCLEAR COMMAND',line:'Babar alone can authorize his arsenal. Rataxes alone can authorize his. Each must have direct sight of a friendly headquarters.',reply:'The warning gives both armies time to move. The button is yours. So are the consequences.',side:'both',nuclear:'authority'}
];
(() => {
  const dialog=document.createElement('dialog');dialog.id='opening';dialog.setAttribute('aria-labelledby','opening-title');
  dialog.innerHTML='<div class="opening-sky" aria-hidden="true"></div><div class="opening-nuclear" aria-hidden="true"><svg class="opening-cloud" viewBox="16 440 620 530"><image href="assets/mushroom-clouds.png" width="1536" height="1024"/></svg><div class="opening-shelter"><i></i><b>CIVIL DEFENSE</b></div><div class="opening-button"><i></i><b>COMMAND AUTHORITY</b></div></div><div class="opening-rivals" aria-hidden="true"><div class="opening-babar">'+characterArtMarkup('babar')+'</div><div class="opening-rataxes">'+characterArtMarkup('rataxes')+'</div></div><div class="opening-body"><p id="opening-tag">A KINGDOM AT THE BREAKING POINT</p><div id="opening-copy" aria-live="polite"><h2 id="opening-title">Two crowns.<br>One border.</h2><p id="opening-speaker">BABAR · THE SIEGE OF CELESTEVILLE</p><p id="opening-line">Rataxes is gathering his army. Beyond the border war lies a nuclear age—and a decision only a king can make.</p><p id="opening-reply">An original wartime prologue. Nuclear weapons arrive later in the battle.</p></div><div class="opening-progress" aria-label="Opening progress"><i></i><i></i><i></i><i></i><i></i></div><div class="opening-controls"><button id="opening-play">Begin opening</button><button id="opening-next" hidden>Next scene</button><button id="opening-mute"></button><button id="opening-skip">Skip to briefing</button></div><small id="opening-hint">Sound begins only after you choose Begin opening. About 40 seconds.</small></div>';
  document.body.append(dialog);
  let scene=-1, timer=null, playing=false, bus=null, voices=[];
  function clearTimer(){clearTimeout(timer);timer=null;}
  function stopScore(){for(const voice of voices){try{voice.stop();}catch{}}voices=[];bus?.disconnect();bus=null;}
  function syncMute(){ $('opening-mute').textContent=muted?'Sound off':'Sound on';$('opening-mute').setAttribute('aria-pressed',String(muted));if(bus)bus.gain.value=muted?0:.07; }
  function score(){
    stopScore();if(!audioContext||muted||!playing)return;
    const now=audioContext.currentTime;bus=audioContext.createGain();bus.gain.value=.07;bus.connect(audioContext.destination);
    // Original low fifth and restrained drum pulses; all voices stop on skip/pause.
    for(const [hz,delay,length,type] of [[65.41,0,5,'triangle'],[98,0,5,'sine'],[130.81,1.7,3,'triangle'],[55,0,.3,'sine'],[55,1.4,.3,'sine'],[49,2.8,.4,'sine']]){
      const o=audioContext.createOscillator(),gain=audioContext.createGain();o.type=type;o.frequency.value=hz;
      gain.gain.setValueAtTime(.001,now+delay);gain.gain.linearRampToValueAtTime(.3,now+delay+.06);gain.gain.exponentialRampToValueAtTime(.001,now+delay+length);
      o.connect(gain).connect(bus);o.start(now+delay);o.stop(now+delay+length+.05);voices.push(o);
    }
  }
  function schedule(){clearTimer();if(playing&&!reducedMotion)timer=setTimeout(next,8000);}
  function show(){
    const s=OPENING_SCENES[scene];dialog.dataset.side=s.side;dialog.dataset.nuclear=s.nuclear||'none';dialog.dataset.motion=reducedMotion?'reduced':'full';
    $('opening-tag').textContent=s.tag;$('opening-title').textContent=s.title;$('opening-speaker').textContent=s.speaker;$('opening-line').textContent=s.line;$('opening-reply').textContent=s.reply;
    [...dialog.querySelectorAll('.opening-progress i')].forEach((el,i)=>el.classList.toggle('current',i<=scene));
    $('opening-next').hidden=false;$('opening-next').textContent=scene===OPENING_SCENES.length-1?'Mission briefing':'Next scene';
    $('opening-play').textContent=playing?'Pause opening':'Resume opening';
    $('opening-hint').textContent=reducedMotion?'Reduced motion: static scenes. Choose Next scene when ready.':'Next scene advances immediately. Escape skips to briefing.';
    dialog.classList.toggle('opening-playing',playing&&!reducedMotion);score();schedule();
  }
  function finish(){clearTimer();stopScore();playing=false;if(dialog.open)dialog.close();$('start')?.focus();}
  function next(){if(scene>=OPENING_SCENES.length-1){finish();return;}scene++;show();}
  $('opening-play').onclick=()=>{startAudio();playing=!playing;if(scene<0)scene=0;show();};
  $('opening-next').onclick=next;
  $('opening-skip').onclick=finish;
  $('opening-mute').onclick=()=>{$('mute').click();syncMute();};
  $('mute').addEventListener('click',syncMute);
  dialog.addEventListener('close',()=>{clearTimer();stopScore();playing=false;});
  dialog.addEventListener('cancel',e=>{e.preventDefault();finish();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&dialog.open&&scene>=0){playing=false;show();}});
  // A programmatic or keyboard start must never leave a cinematic over live play.
  $('start').addEventListener('click',finish);
  const replay=document.createElement('button');replay.id='opening-replay';replay.textContent='Watch opening';
  replay.onclick=()=>{scene=0;playing=false;dialog.showModal();show();$('opening-play').focus();};
  document.querySelector('.brief').append(replay);
  syncMute();dialog.dataset.side='both';dialog.dataset.motion=reducedMotion?'reduced':'full';
  let retry=null;
  try {retry=sessionStorage.getItem('babar-retry-difficulty');sessionStorage.removeItem('babar-retry-difficulty');} catch {}
  if(retry==='easy'||retry==='normal') {
    $('difficulty').value=retry;
    $('start').focus();
  } else dialog.showModal();
})();
