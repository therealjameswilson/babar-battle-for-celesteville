'use strict';
// Reuse battlefield commands so fog, formations and queue limits stay identical.
let minimapGesture = null;
function minimapPoint(e) {
  const r = mini.getBoundingClientRect();
  return {x:clamp((e.clientX-r.left)/r.width,0,1)*W,
    y:clamp((e.clientY-r.top)/r.height,0,1)*H,
    inside:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};
}
function minimapDown(e) {
  if(!cameraViewsAvailable()||minimapGesture||![0,1,2].includes(e.button))return;
  e.preventDefault();
  const p=minimapPoint(e);
  // Building placement needs the precise battlefield footprint preview.
  if(e.button===2&&!placing){command(p,e.shiftKey||queueOrders);return;}
  const order=e.button===0&&!!mode&&!placing;
  minimapGesture={id:e.pointerId,order,mode,append:e.shiftKey||queueOrders};
  try{mini.setPointerCapture(e.pointerId);}catch{}
  if(!order){cam.x=p.x;cam.y=p.y;}
}
function minimapMove(e) {
  if(minimapGesture?.id!==e.pointerId||minimapGesture.order||!cameraViewsAvailable())return;
  const p=minimapPoint(e);cam.x=p.x;cam.y=p.y;
}
function minimapUp(e) {
  if(minimapGesture?.id!==e.pointerId)return;
  const gesture=minimapGesture;minimapGesture=null;
  const p=minimapPoint(e);
  if(gesture.order&&p.inside&&cameraViewsAvailable()&&!placing&&mode===gesture.mode)
    command(p,gesture.append);
}
mini.addEventListener('contextmenu',e=>e.preventDefault());
mini.addEventListener('pointerdown',minimapDown);
mini.addEventListener('pointermove',minimapMove);
mini.addEventListener('pointerup',minimapUp);
for(const type of ['pointercancel','lostpointercapture'])mini.addEventListener(type,e=>{
  if(minimapGesture?.id===e.pointerId)minimapGesture=null;
});
window.addEventListener('blur',()=>{minimapGesture=null;});
