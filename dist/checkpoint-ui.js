'use strict';
// Local-only checkpoints. A failed primary write never discards the last save.
const CHECKPOINT_KEY='babar-checkpoint-v1',CHECKPOINT_BACKUP='babar-checkpoint-backup-v1';
let checkpointMission=String(Date.now()),checkpointAt=0,checkpointFailed=false;
function availableCheckpoint(){
  for(const key of [CHECKPOINT_KEY,CHECKPOINT_BACKUP]){
    try {const text=localStorage.getItem(key);if(text)return {record:readCheckpoint(text),backup:key===CHECKPOINT_BACKUP};}catch{}
  }
  return null;
}
function saveBattle(automatic=false){
  if(!running||ended)return false;
  try {
    const text=createCheckpoint(checkpointMission),previous=localStorage.getItem(CHECKPOINT_KEY);
    if(previous){try {readCheckpoint(previous);localStorage.setItem(CHECKPOINT_BACKUP,previous);}catch{}}
    localStorage.setItem(CHECKPOINT_KEY,text);
    checkpointAt=t;checkpointFailed=false;
    $('checkpoint-status').textContent=`Saved at ${time(t)}. Stored on this browser only.`;
    if(!automatic)say('Battle saved on this browser.');
    return true;
  }catch(error){
    checkpointFailed=true;
    $('checkpoint-status').textContent='Save failed. Browser storage may be unavailable or full. Keep this tab open.';
    if(!automatic)say('Unable to save. Keep this tab open.');
    return false;
  }
}
function continueBattle(){
  const saved=availableCheckpoint();
  if(!saved){say('No readable checkpoint is available.');return;}
  startAudio();applyCheckpoint(saved.record);checkpointMission=saved.record.missionId;checkpointAt=t;checkpointFailed=false;
  $('checkpoint-status').textContent=`${saved.backup?'Backup restored':'Checkpoint restored'} at ${time(t)}. Resume when ready.`;
}
$('pause-save').onclick=()=>saveBattle();
$('pause-quit').onclick=()=>{if(saveBattle())location.reload();};
$('continue-battle').onclick=continueBattle;
$('start').addEventListener('click',()=>{checkpointMission=String(Date.now());checkpointAt=0;checkpointFailed=false;});
const existingCheckpoint=availableCheckpoint();
if(existingCheckpoint){
  $('continue-battle').hidden=false;
  $('checkpoint-brief').textContent=`${existingCheckpoint.backup?'Backup · ':''}${existingCheckpoint.record.state.easy?'Story':'Commander'} · ${time(existingCheckpoint.record.state.t)} elapsed · saved ${new Date(existingCheckpoint.record.savedAt).toLocaleString()}. Local to this browser.`;
  $('start').textContent='Start a new battle →';
  document.querySelector('dialog#opening')?.close();
} else {
  try {if(localStorage.getItem(CHECKPOINT_KEY)||localStorage.getItem(CHECKPOINT_BACKUP))$('checkpoint-brief').textContent='The saved battle could not be read by this version. Start a new battle to replace it.';}catch{$('checkpoint-brief').textContent='Browser storage is unavailable. Keep this tab open to retain your battle.';}
}
setInterval(()=>{if(running&&!ended&&!paused&&!checkpointFailed&&t-checkpointAt>=30)saveBattle(true);},2000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveBattle(true);});
window.addEventListener('pagehide',()=>saveBattle(true));

function offerCheckpointRetry(){
  if(!availableCheckpoint())return;
  const button=document.createElement('button');button.id='checkpoint-retry';button.textContent='Return to last checkpoint';
  button.onclick=continueBattle;document.querySelector('.debrief .launch')?.append(button);
}
