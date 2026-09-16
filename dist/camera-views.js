'use strict';
// Camera locations are mission-local UI state; they never select or order units.
let cameraViews = Array(4).fill(null);
function cameraViewsAvailable() {
  return running && !ended && !['court-dialog','groups-dialog','help-dialog'].some(id=>$(id).open);
}
function closeCameraViews() {
  $('camera-views-panel').hidden=true;
  $('camera-views-open').setAttribute('aria-expanded','false');
}
function resetCameraViews() {cameraViews=Array(4).fill(null);closeCameraViews();}
function saveCameraView(slot) {
  if(!cameraViewsAvailable()||!Number.isInteger(slot)||slot<0||slot>3)return false;
  cameraViews[slot]={x:clamp(cam.x,0,W),y:clamp(cam.y,0,H),zoom:clamp(cam.zoom,.4,1.8)};
  say(`View ${slot+1} saved. F${slot+5} returns here without changing orders.`);
  renderCameraViews();return true;
}
function recallCameraView(slot) {
  if(!cameraViewsAvailable()||!cameraViews[slot])return false;
  Object.assign(cam,cameraViews[slot]);closeCameraViews();
  say(`View ${slot+1}. Army selection and orders retained.`);return true;
}
function renderCameraViews() {
  const rows=$('camera-view-rows');rows.replaceChildren();
  cameraViews.forEach((view,slot)=>{
    const row=document.createElement('div');row.className='camera-view-row';
    const label=document.createElement('span');
    label.textContent=`View ${slot+1} · F${slot+5}`;
    const detail=document.createElement('small');
    detail.textContent=view?`${Math.round(view.x)}, ${Math.round(view.y)} · ${Math.round(view.zoom*100)}% zoom`:'No location saved';
    label.appendChild(detail);
    const save=document.createElement('button');save.textContent=view?'Replace':'Save';
    save.setAttribute('aria-label',`${view?'Replace':'Save'} camera view ${slot+1}`);
    save.onclick=()=>saveCameraView(slot);
    const jump=document.createElement('button');jump.textContent='Go';jump.disabled=!view;
    jump.setAttribute('aria-label',`Go to camera view ${slot+1}`);jump.onclick=()=>recallCameraView(slot);
    row.appendChild(label);row.appendChild(save);row.appendChild(jump);rows.appendChild(row);
  });
}
function toggleCameraViews() {
  if(!cameraViewsAvailable())return;
  const open=$('camera-views-panel').hidden;
  closeProduction();$('camera-views-panel').hidden=!open;
  $('camera-views-open').setAttribute('aria-expanded',String(open));
  if(open){renderCameraViews();$('camera-views-panel').scrollTop=0;}
}
function cameraViewKey(e) {
  if(!/^F[5-8]$/.test(e.key)||e.ctrlKey||e.metaKey||e.altKey||!running||ended)return false;
  e.preventDefault();
  if(!e.repeat&&cameraViewsAvailable()){
    const slot=Number(e.key.slice(1))-5;
    if(e.shiftKey)saveCameraView(slot);
    else if(!recallCameraView(slot))say(`View ${slot+1} is empty. Shift+F${slot+5} saves the current camera.`);
  }
  return true;
}
$('camera-views-open').onclick=toggleCameraViews;
$('camera-views-close').onclick=closeCameraViews;
