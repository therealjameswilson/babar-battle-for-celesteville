'use strict';
const dimensions=new URLSearchParams(location.search);
document.querySelector('iframe').width=Number(dimensions.get('w'))||1280;
document.querySelector('iframe').height=Number(dimensions.get('h'))||800;
document.querySelector('iframe').onload=async()=>{
 const g=document.querySelector('iframe').contentWindow,d=g.document,out=document.querySelector('#result');let count=0;
 const check=(v,label)=>{if(!v)throw Error(label);count++;};
 const run=s=>g.eval(s);
 try{
  // Feed browser-standard samples through the production polling function.
  // This verifies the integration, not physical controller connectivity.
  run("this.qaPad={index:0,connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};this.qaStamp=1000;Object.defineProperty(navigator,'getGamepads',{value:()=>[qaPad],configurable:true})");
  function press(index){run(`qaPad.buttons[${index}]={pressed:true,value:1};pollController([qaPad],.016,qaStamp+=200);qaPad.buttons[${index}]={pressed:false,value:0};pollController([qaPad],.016,qaStamp+=200)`);}
  check(run('controllerAxis(.15)===0&&controllerAxis(-1)===-1'),'stick deadzone');
  press(1);check(!d.querySelector('#opening').open,'East skips opening');
  const hasCheckpoint=!d.querySelector('#continue-battle').hidden;
  run('controller.focus=null;controllerFocus()');check(run('controller.focus.id')===(hasCheckpoint?'continue-battle':'difficulty'),'briefing prioritizes available saved battle');
  if(hasCheckpoint)run('controller.focus=$("difficulty");controllerFocus()');
  press(15);check(d.querySelector('#difficulty').selectedIndex===1,'difficulty selection');
  press(14);press(13);
  if(d.querySelector('#guide-enabled')){check(run('controller.focus.id')==='guide-enabled','D-pad reaches adviser option');press(0);check(!d.querySelector('#guide-enabled').checked,'controller toggles adviser');press(0);press(13);}
  if(hasCheckpoint)press(13);check(run("controller.focus.id==='start'"),'D-pad reaches start');
  press(0);check(run('running&&!paused'),'South starts game');
  run('nextWave=enemySpawn=9999;ore=3000;materials=1000');
  press(4);check(run("selected.length>1&&selected.every(u=>defs[u.type].damage&&defs[u.type].speed)"),'bumper selects army');
  run("controller.cursor=screen({x:650,y:1050})");press(0);
  check(run("selected.some(u=>u.order?.kind==='attack')"),'default attack order');
  press(5);check(run('controller.panel&&selected.length===1&&!defs[selected[0].type].speed'),'production bumper selects and opens');
  run("controller.focus=[...document.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Provisioner'));controller.focus.focus()");
  const before=run('selected[0].queue.length');press(0);check(run('selected[0].queue.length')===before+1,'production confirm recruits');
  press(1);check(run('!controller.panel'),'East leaves command menu');
  press(5);check(run("selected[0].type==='forge'"),'production cycles school');
  press(1);press(4);press(3);check(run('new Set(selected.map(u=>u.type)).size===1'),'North selects same type');
  run('setMode("repair");placing=null');press(1);check(run('mode===null&&placing===null'),'cancel clears targeting');
  const cx=run('cam.x');run('qaPad.axes[2]=1;pollController([qaPad],.05,qaStamp+=200);qaPad.axes[2]=0');check(run('cam.x')>cx,'right stick pans');
  const x=run('controller.cursor.x');run('qaPad.axes[0]=1;pollController([qaPad],.05,qaStamp+=200);qaPad.axes[0]=0');check(run('controller.cursor.x')>x,'left stick moves cursor');
  const zoom=run('cam.zoom');press(7);check(run('cam.zoom')>zoom,'trigger zoom');
  press(9);check(run('paused'),'Start pauses');press(9);check(run('!paused'),'Start resumes');
  press(9);press(0);check(run('!paused'),'South resumes through pause card');
  press(9);press(1);check(run('!paused'),'East resumes through pause card');
  run('controllerPanel(true)');
  if(run('controllerVisible($("help"))'))run('controller.focus=$("help")');
  else {run('controller.focus=document.querySelector("#phone-menu summary")');press(0);run('controller.focus=[...document.querySelectorAll("#phone-menu button")].find(b=>b.textContent==="Field manual")');}
  press(0);
  check(d.querySelector('#help-dialog').open,'controller opens manual');
  check(run("controllerControls().every(el=>el.closest('#help-dialog'))"),'focus trapped to modal');
  const closed=new Promise(r=>d.querySelector('#help-dialog').addEventListener('close',r,{once:true}));press(1);await closed;check(!d.querySelector('#help-dialog').open&&run('!paused'),'Back closes and resumes');
  run("document.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))");check(run('!controller.active'),'pointer switches input mode');
  press(4);check(run('controller.active'),'controller can regain input');
  run('$("zoom-in").focus();document.dispatchEvent(new KeyboardEvent("keydown",{key:"Tab",bubbles:true}))');
  check(run('!controller.active&&document.activeElement===$("zoom-in")'),'keyboard handoff retains native focus');press(4);
  run('pollController([],.016,qaStamp+=200)');check(run('paused&&!controller.active'),'disconnect pauses');
  run('qaPad.connected=false');
  check(d.documentElement.scrollWidth<=Number(document.querySelector('iframe').width),'layout fits');
  const demo=document.createElement('button');demo.textContent='Preview controller command panel';demo.onclick=()=>{run('qaPad.connected=true;paused=false;controller.previous=[]');press(5);};document.body.insertBefore(demo,out);
  out.textContent='PASS '+count+' controller browser assertions (standard samples; physical controller untested).';
 }catch(e){out.textContent='FAIL '+e.stack+' '+run('JSON.stringify({paused,helpWasPaused,helpOpen:$("help-dialog").open,panel:controller.panel,focus:controller.focus?.id})');}
};
