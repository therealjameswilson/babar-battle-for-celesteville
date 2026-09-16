'use strict';
// Original synthesized percussion and battlefield effects; no external samples.
let audioContext = null,
  muted = false,
  lastSound = 0,
  musicBeat = 0;
const reducedMotion =
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
  muted = localStorage.getItem('babar-muted') === 'true';
} catch {}
function muteLabel() {
  $('mute').textContent = muted ? 'Sound off' : 'Sound on';
  $('mute').setAttribute('aria-pressed', String(muted));
}
function startAudio() {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (Audio && !audioContext) audioContext = new Audio();
    if (!muted) audioContext?.resume();
  } catch {}
  muteLabel();
}
function battleSound(kind) {
  if (!audioContext || muted) return;
  const now = audioContext.currentTime;
  if (now - lastSound < 0.07) return;
  lastSound = now;
  const length = kind === 'cannon' ? 0.35 : 0.12,
    buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate * length,
      audioContext.sampleRate
    ),
    data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++)
    data[i] = (Math.random() * 2 - 1) * Math.exp((-i / data.length) * 7);
  const source = audioContext.createBufferSource(),
    filter = audioContext.createBiquadFilter(),
    gain = audioContext.createGain();
  source.buffer = buffer;
  filter.type = 'lowpass';
  filter.frequency.value = kind === 'cannon' ? 350 : 1800;
  gain.gain.value = 0.12;
  source.connect(filter).connect(gain).connect(audioContext.destination);
  source.start();
}
function soundscape() {
  if (!audioContext || muted || !running || paused || t < musicBeat) return;
  musicBeat = t + 3;
  const o = audioContext.createOscillator(),
    g = audioContext.createGain(),
    now = audioContext.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(70, now);
  o.frequency.exponentialRampToValueAtTime(35, now + 0.18);
  g.gain.setValueAtTime(0.04, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  o.connect(g).connect(audioContext.destination);
  o.start();
  o.stop(now + 0.3);
}
$('mute').onclick = () => {
  muted = !muted;
  try {
    localStorage.setItem('babar-muted', String(muted));
  } catch {}
  startAudio();
  muteLabel();
};
muteLabel();
// Short original two-note dispatch tone. Never creates/resumes audio on its own.
function attackSound() {
  if(!audioContext||muted||audioContext.state==='suspended')return;
  const now=audioContext.currentTime;
  for(let i=0;i<2;i++){
    const o=audioContext.createOscillator(),g=audioContext.createGain();
    o.type='triangle';o.frequency.value=i?440:330;
    g.gain.setValueAtTime(.035,now+i*.13);g.gain.exponentialRampToValueAtTime(.001,now+i*.13+.12);
    o.connect(g).connect(audioContext.destination);o.start(now+i*.13);o.stop(now+i*.13+.13);
  }
}
