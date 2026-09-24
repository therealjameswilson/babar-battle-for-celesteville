'use strict';
// Standard Gamepad mapping uses physical positions, independent of printed
// Nintendo/Xbox face labels. All commands reuse the normal simulation APIs.
const controller = {
  active:false, index:null, previous:[], cursor:{x:0,y:0}, panel:false,
  focus:null, repeatAt:0, lastStamp:0, connected:false
};
function controllerAxis(value){
  const n=Number.isFinite(value)?clamp(value,-1,1):0;
  return Math.abs(n)<.2?0:Math.sign(n)*(Math.abs(n)-.2)/.8;
}
function controllerVisible(el){
  return !!el&&!el.disabled&&!el.closest('[hidden]')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
}
function controllerModal(){
  return [...document.querySelectorAll('dialog[open]')].at(-1)||
    (controllerVisible($('opening'))?$('opening'):null);
}
function controllerControls(){
  const modal=controllerModal();
  const root=modal||(paused&&controllerVisible($('pause-panel'))?$('pause-panel'):null)||(!running||ended?$('overlay')||document:document);
  const controls=[...root.querySelectorAll('button,input,select,summary')].filter(controllerVisible);
  // During battle, the command panel starts with recruitment/abilities, then
  // offers the regular command, production, council and settings controls.
  if(!modal&&running&&!ended)return controls.sort((a,b)=>Number(!!b.closest('#actions'))-Number(!!a.closest('#actions')));
  return controls;
}
function controllerFocus(delta=0){
  const list=controllerControls();if(!list.length)return;
  let index=list.indexOf(controller.focus);
  if(index<0&&controller.focus)index=list.findIndex(el=>el.textContent===controller.focus.textContent&&el.tagName===controller.focus.tagName);
  index=index<0?Math.max(0,(!running&&!ended?list.indexOf($('continue-battle')&&!$('continue-battle').hidden?$('continue-battle'):$('difficulty')):0)):(index+delta+list.length)%list.length;
  controller.focus?.classList.remove('controller-focus');
  controller.focus=list[index];controller.focus.classList.add('controller-focus');
  controller.focus.focus({preventScroll:true});controller.focus.scrollIntoView({block:'nearest',inline:'nearest'});
}
function controllerPanel(open,blur=true){
  controller.panel=open;
  if(open){
    document.querySelector('#phone-tabs [data-panel="actions"]')?.click();
    controller.focus=null;controllerFocus();
  }else{
    controller.focus?.classList.remove('controller-focus');controller.focus=null;
    if(blur)document.activeElement?.blur();
  }
}
function controllerCancel(){
  const modal=controllerModal();
  if(modal){
    const close=modal.querySelector('#opening-skip,#help-close,#court-close,#groups-close');
    if(close)close.click();else if(modal.tagName==='DIALOG')modal.close();
    controllerPanel(false);return;
  }
  if(paused&&running&&!ended){togglePause();controllerPanel(false);return;}
  if(controller.panel){controllerPanel(false);return;}
  mode=null;placing=null;atomicTargetSite=null;clearUnitTap();updateUI(true);
}
function controllerPoint(){return world(controller.cursor);}
function controllerSelect(){
  if(!running||paused||ended)return;
  const p=controllerPoint();
  if(mode||placing){command(p);updateUI(true);return;}
  const producer=productionBuildingAt(p),unit=nearest(p,alive(0));
  if(producer){selectProduction([producer]);controllerPanel(true);}
  else if(unit&&dist(unit,p)<unit.r+22){selected=[unit];resetSubgroups();updateUI(true);}
  else {command(p);updateUI(true);}
}
function controllerProduction(){
  const sites=productionSites();if(!sites.length)return;
  const index=sites.indexOf(selected.length===1?selected[0]:null);
  selectProduction([sites[(index+1)%sites.length]]);
  controller.cursor={x:canvas.clientWidth/2,y:canvas.clientHeight/2};controllerPanel(true);
}
function controllerAdjust(direction){
  const el=controller.focus;if(!el)return;
  if(el.matches('input[type="range"]')){
    el.value=clamp(Number(el.value)+direction*5,Number(el.min)||0,Number(el.max)||100);
    el.dispatchEvent(new Event('input',{bubbles:true}));
  }else if(el.tagName==='SELECT'){
    el.selectedIndex=clamp(el.selectedIndex+direction,0,el.options.length-1);
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }else controllerFocus(direction);
}
function controllerConfirm(){
  if(controller.panel||controllerModal()||paused||!running||ended){
    if(!controllerControls().includes(controller.focus)){controllerFocus();return;}
    const el=controller.focus;if(!el)return;
    if(el.tagName==='SELECT'||el.matches('input[type="range"]'))return;
    const previousMode=mode,previousPlacing=placing;
    el.click();uiSound();
    if(mode!==previousMode||placing!==previousPlacing||el.id==='start'||el.id==='continue-battle'||el.id==='opening-skip')controllerPanel(false);
    else if(!controllerControls().includes(el))controllerFocus();
  }else controllerSelect();
}
function controllerDeactivate(){
  if(!controller.active)return;
  controller.active=false;controllerPanel(false,false);
  document.body.classList.remove('using-controller');
  $('controller-cursor').hidden=true;$('controller-hints').hidden=true;
}
function controllerRender(){
  if(!controller.active)return;
  const modal=controllerModal(),field=running&&!ended&&!modal&&!controller.panel&&!paused;
  const r=canvas.getBoundingClientRect(),cursor=$('controller-cursor');
  cursor.hidden=!field;cursor.style.left=(r.left+controller.cursor.x)+'px';cursor.style.top=(r.top+controller.cursor.y)+'px';
  cursor.classList.toggle('targeting',!!(mode||placing));
  const hints=$('controller-hints'),hintParent=modal||document.body;
  if(hints.parentElement!==hintParent)hintParent.insertBefore(hints,hintParent.firstChild);
  hints.hidden=false;
  const text=modal||controller.panel||paused||!running||ended
    ? 'D-pad Navigate · South Confirm · East Back · Left/Right Adjust'
    : paused?'Start Resume · West Commands'
    : 'Left stick Cursor · Right stick Camera · South Select / order · West Commands · North Same type · LB Army · RB Production · Start Pause';
  if(hints.textContent!==text)hints.textContent=text;
}
// Accepting samples as an argument permits deterministic browser input tests;
// production always passes navigator.getGamepads() from the render loop.
function pollController(pads,dt,stamp){
  const pad=[...pads].find(p=>p&&p.connected&&p.mapping==='standard'&&p.index===controller.index)||
    [...pads].find(p=>p&&p.connected&&p.mapping==='standard');
  if(!pad){
    if(controller.connected&&controller.active&&running&&!ended&&!paused)togglePause();
    controller.connected=false;controller.index=null;controller.previous=[];if(controller.active)controllerDeactivate();return;
  }
  controller.connected=true;controller.index=pad.index;
  const buttons=pad.buttons.map(b=>!!b.pressed),axes=pad.axes.map(controllerAxis);
  const previous=controller.previous;
  const pressed=i=>buttons[i]&&!previous[i];
  const activity=buttons.some((v,i)=>v&&!controller.previous[i])||axes.some(v=>Math.abs(v)>.05);
  controller.previous=buttons;
  if(document.hidden)return;
  if(activity&&!controller.active){
    controller.active=true;controller.cursor={x:canvas.clientWidth/2,y:canvas.clientHeight/2};startAudio();
    document.body.classList.add('using-controller');
    if(controllerModal()||!running||ended)controllerFocus();
  }
  if(!controller.active)return;
  if(pressed(1)){controllerCancel();controllerRender();return;}
  if(pressed(9)&&running&&!ended&&!controllerModal()){controllerPanel(false);togglePause();}
  const menu=!!controllerModal()||controller.panel||paused||!running||ended;
  if(menu){
    const direction=buttons[13]?1:buttons[12]?-1:buttons[15]?1:buttons[14]?-1:0;
    if(direction&&(pressed(12)||pressed(13)||pressed(14)||pressed(15)||stamp>=controller.repeatAt)){
      if(buttons[14]||buttons[15])controllerAdjust(direction);else controllerFocus(direction);
      controller.repeatAt=stamp+180;
    }
    if(pressed(0))controllerConfirm();
    if(pressed(2)&&!controllerModal()&&running&&!ended)controllerPanel(false);
  }else if(!paused){
    dt=clamp(dt,0,.05);
    controller.cursor.x=clamp(controller.cursor.x+(axes[0]||0)*600*dt,8,Math.max(8,canvas.clientWidth-8));
    controller.cursor.y=clamp(controller.cursor.y+(axes[1]||0)*600*dt,8,Math.max(8,canvas.clientHeight-8));
    cam.x=clamp(cam.x+(axes[2]||0)*650*dt/cam.zoom,0,W);
    cam.y=clamp(cam.y+(axes[3]||0)*650*dt/cam.zoom,0,H);
    const zoom=(pad.buttons[7]?.value||0)-(pad.buttons[6]?.value||0);
    cam.zoom=clamp(cam.zoom*Math.exp(zoom*dt),.45,1.8);
    pointer={...controller.cursor};
    if(pressed(0))controllerConfirm();
    if(pressed(2))controllerPanel(true);
    if(pressed(3)&&selected[0])selectAllOfType(selected[0]);
    if(pressed(4)){selectArmy();controllerPanel(false);}
    if(pressed(5))controllerProduction();
  }else if(pressed(2))controllerPanel(true);
  controllerRender();
}
document.addEventListener('pointerdown',controllerDeactivate,true);
document.addEventListener('keydown',controllerDeactivate,true);
window.addEventListener('gamepaddisconnected',e=>{
  if(e.gamepad.index!==controller.index)return;
  if(controller.active&&running&&!paused&&!ended)togglePause();
  controller.connected=false;controller.index=null;controller.previous=[];controllerDeactivate();
});
