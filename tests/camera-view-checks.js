function cameraViewChecks(check){
 reset();running=true;
 const u=alive(0).find(u=>u.type==='trooper');selected=[u];issueOrder(u,{kind:'attack',x:900,y:830});
 const order=u.order;mode='attack';cam={x:410,y:850,zoom:1.25};
 check(saveCameraView(0),'An active mission can save its current camera');
 cam.x=1300;cam.y=300;cam.zoom=.6;
 check(cameraViews[0].x===410&&cameraViews[0].zoom===1.25,'Saved view is a snapshot, not a live camera reference');
 check(recallCameraView(0)&&cam.x===410&&cam.y===850&&cam.zoom===1.25,'Recall restores both position and zoom');
 check(selected.length===1&&selected[0]===u&&u.order===order&&mode==='attack','Recall preserves selection, orders and pending command mode');
 paused=true;saveCameraView(1);cam.x=100;recallCameraView(1);
 check(paused&&cam.x===410,'Saved views can be used while retaining a paused mission');paused=false;
 const cameraBefore=JSON.stringify(cam);check(!recallCameraView(2)&&JSON.stringify(cam)===cameraBefore,'Empty slots do not move the camera');
 cam.x=520;saveCameraView(0);check(cameraViews[0].x===520,'Saving again replaces only the chosen slot');
 check(cameraViews[1].x===410,'Other saved views remain independent');
 cam={x:-50,y:H+50,zoom:5};saveCameraView(3);recallCameraView(3);
 check(cam.x===0&&cam.y===H&&cam.zoom===1.8,'Saved locations remain inside map and zoom limits');
 check(!saveCameraView(-1)&&!saveCameraView(4),'Invalid slot numbers are rejected');
 toggleCameraViews();check(!$('camera-views-panel').hidden&&!paused,'Views panel is live and does not pause combat');
 toggleProduction();check($('camera-views-panel').hidden&&!$('production-panel').hidden,'Production report replaces the camera panel');
 toggleCameraViews();check($('production-panel').hidden&&!$('camera-views-panel').hidden,'Camera panel replaces the production report');
 for(const id of ['court-dialog','groups-dialog','help-dialog']){
  $(id).showModal();const old=JSON.stringify(cam);
  check(!saveCameraView(0)&&!recallCameraView(1)&&JSON.stringify(cam)===old,`${id} blocks camera shortcuts behind the modal`);
  $(id).close();
 }
 let prevented=false;cam={x:123,y:456,zoom:.8};
 cameraViewKey({key:'F6',shiftKey:true,preventDefault(){prevented=true;}});
 check(prevented&&cameraViews[1].x===123,'Shift+F6 saves and prevents the browser default');
 cam.x=800;cameraViewKey({key:'F6',preventDefault(){}});
 check(cam.x===123,'F6 recalls the saved view');
 cam.x=800;cameraViewKey({key:'F6',shiftKey:true,repeat:true,preventDefault(){}});
 check(cameraViews[1].x===123,'Held keys cannot repeatedly replace a saved location');
 check(!cameraViewKey({key:'F5',ctrlKey:true}),'Browser modifier shortcuts are left available');
 finish(true);check($('camera-views-panel').hidden&&!saveCameraView(0)&&!recallCameraView(1),'Mission end closes and disables camera views');
 reset();check(cameraViews.every(v=>v===null)&&$('camera-views-panel').hidden,'Restart clears mission-specific camera locations');
}
