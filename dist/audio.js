'use strict';
// Original procedural score and effects. Audio randomness never touches simulation RNG.
let audioContext=null,muted=false,lastSound=0,musicBeat=0;
const motionMedia = typeof matchMedia === 'function'
  ? matchMedia('(prefers-reduced-motion: reduce)') : null;
let motionPreference = 'system', reducedMotion = !!motionMedia?.matches;
try {
  const saved = localStorage.getItem('babar-motion');
  if (['system', 'reduced', 'full'].includes(saved)) motionPreference = saved;
} catch {}
function applyMotionPreference() {
  reducedMotion = motionPreference === 'reduced' ||
    (motionPreference === 'system' && !!motionMedia?.matches);
  document.body?.setAttribute('data-motion',reducedMotion?'reduced':'full');
  $('motion-preference').value = motionPreference;
  $('motion-status').textContent = reducedMotion
    ? 'Reduced motion: static infantry poses, no walking bob or drifting dust.'
    : 'Full motion: walking poses and battlefield effects enabled.';
}
$('motion-preference').onchange = () => {
  const value = $('motion-preference').value;
  if (!['system', 'reduced', 'full'].includes(value)) return;
  motionPreference = value;
  try { localStorage.setItem('babar-motion', value); } catch {}
  applyMotionPreference();
};
motionMedia?.addEventListener?.('change', applyMotionPreference);
applyMotionPreference();
const AUDIO_DEFAULTS={master:.75,music:.45,effects:.8,interface:.65};
let audioLevels={...AUDIO_DEFAULTS},audioGraph=null,scoreStep=0,scoreAt=0,audioWasPaused=false;
const audioVoices=new Set(),audioNoise=new Map(),effectTimes=new Map(),audioGainValues=new WeakMap();
try {
  muted=localStorage.getItem('babar-muted')==='true';
  const saved=JSON.parse(localStorage.getItem('babar-audio-levels')||'{}');
  for(const key of Object.keys(AUDIO_DEFAULTS))if(Number.isFinite(saved[key]))audioLevels[key]=clamp(saved[key],0,1);
}catch{}
function muteLabel(){
  $('mute').textContent=muted?'Sound off':'Sound on';
  $('mute').setAttribute('aria-pressed',String(muted));
}
function ensureAudioGraph(){
  if(!audioContext||audioGraph)return;
  const master=audioContext.createGain(),limiter=audioContext.createDynamicsCompressor();
  limiter.threshold.value=-12;limiter.knee.value=12;limiter.ratio.value=5;
  limiter.attack.value=.005;limiter.release.value=.2;
  master.connect(limiter).connect(audioContext.destination);
  audioGraph={master,limiter};
  for(const key of ['music','effects','interface']){
    audioGraph[key]=audioContext.createGain();audioGraph[key].connect(master);
  }
  updateAudioMix();
}
function audioBus(name){ensureAudioGraph();return audioGraph?.[name]||audioContext?.destination;}
function stopAudioVoices(channel){
  for(const voice of [...audioVoices])if(!channel||voice.channel===channel){
    try{voice.source.stop();}catch{}
    voice.clean();
  }
}
function setAudioGain(gain,value){
  if(audioGainValues.get(gain)===value)return;
  audioGainValues.set(gain,value);gain.setTargetAtTime(value,audioContext.currentTime,.035);
}
function updateAudioMix(){
  if(!audioGraph)return;
  const hidden=document.hidden===true;
  setAudioGain(audioGraph.master.gain,muted||hidden?0:audioLevels.master);
  for(const key of ['music','effects','interface'])setAudioGain(audioGraph[key].gain,audioLevels[key]);
  const stopped=hidden||muted||(running&&(paused||ended));
  if(stopped&&!audioWasPaused){stopAudioVoices('music');scoreAt=0;scoreStep=0;}
  audioWasPaused=stopped;
}
function startAudio(){
  try{
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(Audio&&!audioContext){audioContext=new Audio();ensureAudioGraph();}
    if(!muted)audioContext?.resume()?.catch(()=>{});
  }catch{}
  updateAudioMix();muteLabel();
}
function audioReady(){return audioContext&&audioContext.state==='running'&&!muted&&document.hidden!==true;}
function voice(source,channel,at,duration,volume,pan=0,filterHz=0){
  if(!audioReady()||audioVoices.size>=48)return false;
  ensureAudioGraph();
  const gain=audioContext.createGain(),nodes=[source,gain];
  let tail=source;
  if(filterHz){const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=filterHz;tail.connect(filter);tail=filter;nodes.push(filter);}
  tail.connect(gain);tail=gain;
  if(audioContext.createStereoPanner){const panner=audioContext.createStereoPanner();panner.pan.value=clamp(pan,-1,1);tail.connect(panner);tail=panner;nodes.push(panner);}
  tail.connect(audioBus(channel));
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  const entry={source,channel,clean(){audioVoices.delete(entry);for(const node of nodes)try{node.disconnect();}catch{}}};
  source.onended=entry.clean;audioVoices.add(entry);source.start(at);source.stop(at+duration+.02);return true;
}
function tone(hz,at,duration,volume,channel='music',type='triangle',pan=0,endHz=hz){
  if(!audioReady()||audioVoices.size>=48)return;
  const o=audioContext.createOscillator();o.type=type;o.frequency.setValueAtTime(hz,at);
  if(endHz!==hz)o.frequency.exponentialRampToValueAtTime(endHz,at+duration);
  voice(o,channel,at,duration,volume,pan);
}
function noise(at,duration,volume,filterHz,pan=0,channel='effects'){
  if(!audioReady()||audioVoices.size>=48)return;
  const key=duration+':'+audioContext.sampleRate;
  if(!audioNoise.has(key)){
    const buffer=audioContext.createBuffer(1,Math.ceil(audioContext.sampleRate*duration),audioContext.sampleRate),data=buffer.getChannelData(0);
    let seed=9137;for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=(seed>>>0)/2147483648-1;}
    audioNoise.set(key,buffer);
  }
  const source=audioContext.createBufferSource();source.buffer=audioNoise.get(key);
  voice(source,channel,at,duration,volume,pan,filterHz);
}
function battleSound(kind,position=null){
  if(!audioReady()||(position?.team===1&&!visible(position)))return;
  const now=audioContext.currentTime,previous=effectTimes.get(kind)??-Infinity;
  if(now-previous<(kind==='shot'?.045:.09))return;
  effectTimes.set(kind,now);lastSound=now;
  const pan=position?clamp((position.x-cam.x)/Math.max(250,canvas.clientWidth/cam.zoom/2),-1,1):0;
  const distance=position?Math.hypot(position.x-cam.x,position.y-cam.y):0;
  const volume=1/(1+distance/700);
  if(kind==='cannon'){
    tone(100,now,.48,.22*volume,'effects','sine',pan,30);
    noise(now,.65,.24*volume,650,pan);noise(now,.1,.13*volume,2600,pan);
  }else if(kind==='flame')noise(now,.42,.16*volume,950,pan);
  else if(kind==='shotgun'){
    noise(now,.24,.2*volume,1600,pan);tone(150,now,.13,.08*volume,'effects','triangle',pan,50);
  }else {noise(now,.1,.1*volume,3600,pan);tone(210,now,.065,.035*volume,'effects','triangle',pan,90);}
}
function scoreIntensity(){
  if(typeof atomicStrikes!=='undefined'&&atomicStrikes.length)return 2;
  return alive(0).some(u=>t-(u.hitAt??-100)<7)?1:0;
}
// Original eight-bar theme: low strings, a restrained melodic line and drums
// increase in density under fire. Scheduling uses the audio clock, not frame rate.
function soundscape(){
  if(!audioReady()||!running||paused||ended||audioLevels.music===0)return;
  const now=audioContext.currentTime;
  if(scoreAt<now-.5){scoreAt=now+.03;scoreStep=0;}
  if(scoreAt>now+.12)return;
  const intensity=scoreIntensity(),beat=scoreStep%8,bar=Math.floor(scoreStep/8)%4;
  const roots=[65.406,51.913,58.27,49],root=roots[bar],at=scoreAt;
  if(beat===0){tone(root,at,2.6,.047);tone(root*1.5,at+.04,2.4,.024,'music','sine',-.25);}
  const melody=[2,3,2.5,2.25,2,1.5,1.7818,1.5];
  if(beat%2===0)tone(root*melody[beat],at,.75,.026+intensity*.006,'music','triangle',.2);
  if(beat%4===0||intensity&&beat%2===0)tone(85,at,.22,.055+intensity*.015,'music','sine',0,38);
  if(intensity&&beat%4===2)noise(at,.12,.04,1700,-.15,'music');
  if(intensity===2)tone(root*4,at,.18,.018,'music','triangle',beat%2?.3:-.3);
  scoreAt+=.375;scoreStep++;musicBeat=t;
}
function uiSound(kind='confirm'){
  if(!audioReady())return;
  const now=audioContext.currentTime;
  tone(kind==='back'?330:523.25,now,.09,.04,'interface','sine');
  if(kind==='confirm')tone(783.99,now+.055,.12,.022,'interface','sine');
}
function attackSound(){
  if(!audioReady())return;
  const now=audioContext.currentTime;
  tone(330,now,.14,.065,'interface');tone(440,now+.16,.18,.065,'interface');
}
function resultSound(win){
  if(!audioReady())return;
  stopAudioVoices('music');
  const notes=win?[261.63,329.63,392,523.25]:[261.63,233.08,196,130.81];
  notes.forEach((hz,i)=>tone(hz,audioContext.currentTime+i*.19,.85,.06,'interface'));
}
function renderAudioControls(){
  for(const key of Object.keys(AUDIO_DEFAULTS)){
    const input=$('audio-'+key),output=$('audio-'+key+'-value');
    if(input)input.value=Math.round(audioLevels[key]*100);
    if(output)output.textContent=Math.round(audioLevels[key]*100)+'%';
  }
}
for(const key of Object.keys(AUDIO_DEFAULTS))$('audio-'+key)?.addEventListener('input',e=>{
  audioLevels[key]=clamp(Number(e.target.value)/100,0,1);
  try{localStorage.setItem('babar-audio-levels',JSON.stringify(audioLevels));}catch{}
  updateAudioMix();renderAudioControls();
});
$('audio-preview')?.addEventListener('click',()=>{startAudio();uiSound();battleSound('cannon');});
$('mute').onclick=()=>{muted=!muted;try{localStorage.setItem('babar-muted',String(muted));}catch{}startAudio();};
document.addEventListener('visibilitychange',updateAudioMix);
document.addEventListener('click',e=>{if(e.target.closest?.('button')&&!e.target.closest('#mute,#opening-mute,#audio-preview'))uiSound();});
renderAudioControls();muteLabel();
