function minimapChecks(check){
 easy=true;reset();running=true;paused=false;nextWave=enemySpawn=9999;
 const oldRect=mini.getBoundingClientRect;
 mini.getBoundingClientRect=()=>({left:10,top:20,right:210,bottom:120,width:200,height:100});
 const event=(x,y,button=0,shiftKey=false)=>({clientX:10+x*200,clientY:20+y*100,button,shiftKey,pointerId:7,preventDefault(){}});
 try{
 const unit=alive(0).find(u=>u.type==='trooper');selected=[unit];mode=null;placing=null;
 minimapDown(event(.4,.5));minimapMove(event(.6,.7));minimapUp(event(.6,.7));
 check(cam.x===W*.6&&cam.y===H*.7&&selected[0]===unit,'Minimap drag pans without losing selection');
 const camera=JSON.stringify(cam);
 minimapDown(event(.4,.4,2));
 check(unit.order?.kind==='move'&&unit.order.x===W*.4&&JSON.stringify(cam)===camera,'Minimap right-click moves units without moving camera');
 minimapDown(event(.6,.4,2,true));
 check(unit.orders?.length===1,'Shift right-click queues a minimap waypoint');
 mode='attack';minimapDown(event(.5,.5));minimapUp(event(.5,.5));
 check(unit.order?.kind==='attack'&&mode===null,'Explicit attack-move works on minimap release');
 mode='move';const order=unit.order;minimapDown(event(.3,.3));minimapUp(event(1.1,.3));
 check(unit.order===order&&mode==='move','Release outside minimap cancels order and keeps mode armed');
 paused=true;minimapDown(event(.2,.2,2));check(unit.order===order&&mode==='move','Paused minimap cannot issue orders');paused=false;
 placing='home';const funds=ore;minimapDown(event(.2,.2,2));minimapUp(event(.2,.2,2));
 check(ore===funds&&placing==='home'&&cam.x===W*.2,'Building placement pans without spending on minimap');placing=null;mode=null;
 const core=alive(0).find(u=>u.type==='core');selected=[core];minimapDown(event(.5,.7,2));
 check(core.rally?.x===W*.5&&core.rally?.y===H*.7,'Production buildings accept minimap rally points');
 minimapDown(event(.3,.3));reset();check(minimapGesture===null,'Restart clears an unfinished minimap gesture');
 }finally{mini.getBoundingClientRect=oldRect;minimapGesture=null;}
}
