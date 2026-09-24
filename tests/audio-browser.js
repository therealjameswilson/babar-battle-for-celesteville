'use strict';
document.querySelector('#run').onclick=async()=>{
 const g=document.querySelector('iframe').contentWindow,d=g.document,out=document.querySelector('#result');let count=0;
 const check=(condition,label)=>{if(!condition)throw Error(label);count++;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 try{
  check(g.eval('audioContext===null'),'no audio before interaction');
  g.eval('muted=false;startAudio()');await wait(100);
  check(g.eval("audioContext.state==='running'"),'real context running after gesture');
  check(g.eval("['master','music','effects','interface'].every(k=>audioGraph[k] instanceof GainNode)"),'real channel graph');
  await g.eval('audioContext.close()');
  // The in-app browser may expose a running device context with a stalled
  // hardware clock. Render the production graph through real OfflineAudioContext.
  // The context is scheduled before rendering; production readiness is
  // temporarily enabled for offline scheduling, then restored immediately.
  const rendered=await g.eval(`(async()=>{
    audioContext=new OfflineAudioContext(2,48000,48000);audioGraph=null;ensureAudioGraph();
    const ready=audioReady;audioReady=()=>true;
    try{tone(220,0,.7,.2,'effects');muted=true;audioGraph.master.gain.setValueAtTime(0,.5);}
    finally{audioReady=ready;}
    const b=await audioContext.startRendering(),a=b.getChannelData(0);
    return {signal:a.slice(2000,10000).some(v=>Math.abs(v)>.001),silent:a.slice(35000).every(v=>Math.abs(v)<.001)};
  })()`);
  check(rendered.signal,'real rendered audio output');check(rendered.silent,'master gain silences output');
  g.eval('audioContext=new AudioContext();audioGraph=null;muted=false;startAudio();stopAudioVoices()');
  for(const key of ['master','music','effects','interface']){const input=d.querySelector('#audio-'+key);input.value=37;input.dispatchEvent(new g.Event('input'));check(g.eval('audioLevels.'+key+'===.37'),'slider '+key);}
  check(JSON.parse(g.localStorage.getItem('babar-audio-levels')).music===.37,'mix persisted');
  g.eval("(()=>{const original=Math.random;Math.random=()=>{throw Error('simulation random consumed')};try{noise(audioContext.currentTime,.123,.02,500)}finally{Math.random=original}})()");check(true,'audio randomness independent');
  g.eval("stopAudioVoices();for(let i=0;i<80;i++)tone(100,audioContext.currentTime,.1,.001)");
  check(g.eval('audioVoices.size===48'),'voice limit');g.eval('stopAudioVoices()');check(g.eval('audioVoices.size===0'),'explicit voice cleanup');
  g.eval('running=true;paused=false;ended=false;scoreAt=0;soundscape()');check(g.eval('audioVoices.size>0'),'score plays');
  g.eval("paused=true;updateAudioMix()");check(g.eval("![...audioVoices].some(v=>v.channel==='music')"),'pause clears score');
  g.eval('paused=false;updateAudioMix();soundscape()');check(g.eval('audioVoices.size>0'),'score resumes');
  g.eval("running=false;stopAudioVoices();audioLevels={...AUDIO_DEFAULTS};localStorage.setItem('babar-audio-levels',JSON.stringify(audioLevels));renderAudioControls();updateAudioMix()");
  d.querySelector('#opening-skip').click();d.querySelector('#help-dialog').showModal();
  out.textContent='PASS '+count+' real Web Audio assertions. Mobile sound controls below.';
 }catch(e){out.textContent='FAIL '+e.stack+' '+g.eval('JSON.stringify({hidden:document.hidden,state:audioContext?.state,time:audioContext?.currentTime,voices:audioVoices.size,step:scoreStep,at:scoreAt,wasPaused:audioWasPaused,music:audioLevels.music,master:audioGraph?.master.gain.value})');}
};
