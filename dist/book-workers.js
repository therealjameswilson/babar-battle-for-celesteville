'use strict';
// Measured native alpha crops: empty strides, then loaded strides.
const BOOK_WORKER_FRAMES = [
 [
  [{"crop":[60,40,218,268],"anchor":[150,304]},{"crop":[376,42,189,268],"anchor":[468,306]},{"crop":[665,40,209,267],"anchor":[788,303]},{"crop":[1003,44,192,266],"anchor":[1100,306]}],
  [{"crop":[58,341,228,266],"anchor":[154,603]},{"crop":[372,339,192,268],"anchor":[470,603]},{"crop":[659,340,219,267],"anchor":[784,603]},{"crop":[1001,341,191,268],"anchor":[1098,605]}],
  [{"crop":[59,640,214,270],"anchor":[150,906]},{"crop":[375,636,190,275],"anchor":[470,907]},{"crop":[668,637,213,274],"anchor":[790,907]},{"crop":[1002,636,193,276],"anchor":[1100,908]}],
  [{"crop":[56,943,220,273],"anchor":[154,1212]},{"crop":[372,939,192,279],"anchor":[467,1214]},{"crop":[667,942,216,275],"anchor":[788,1213]},{"crop":[1002,940,193,278],"anchor":[1098,1214]}]
 ],
 [
  [{"crop":[69,16,209,292],"anchor":[171,304]},{"crop":[378,16,187,292],"anchor":[471,304]},{"crop":[664,16,207,291],"anchor":[772,303]},{"crop":[995,16,189,292],"anchor":[1096,304]}],
  [{"crop":[70,320,207,294],"anchor":[166,610]},{"crop":[373,319,187,293],"anchor":[468,608]},{"crop":[664,320,207,293],"anchor":[774,609]},{"crop":[995,320,197,292],"anchor":[1094,608]}],
  [{"crop":[79,628,204,296],"anchor":[168,920]},{"crop":[370,627,198,297],"anchor":[470,920]},{"crop":[657,627,204,297],"anchor":[772,920]},{"crop":[997,628,190,296],"anchor":[1096,920]}],
  [{"crop":[76,933,207,296],"anchor":[164,1225]},{"crop":[371,933,200,297],"anchor":[467,1226]},{"crop":[657,933,206,296],"anchor":[775,1225]},{"crop":[999,933,192,297],"anchor":[1096,1226]}]
 ]
];
const bookWorkerSheets=['elephant','rhino'].map(name=>{
 const image=new Image();image.src='assets/book/'+name+'-worker.png';return image;
});
function bookWorkerPose(u,now,minimizeMotion=false){
 if(u.type!=='worker')return null;
 const direction=((Math.floor((u.angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const loaded=u.carrying>0,phase=!minimizeMotion&&u.movingUntil>now?Math.floor((u.walkDistance||0)/14)%2:0;
 return {direction,loaded,row:(loaded?2:0)+phase};
}
function drawBookWorker(c,u,now,minimizeMotion=false){
 const pose=bookWorkerPose(u,now,minimizeMotion);
 if(!pose)return false;
 const image=bookWorkerSheets[u.team];
 if(!image||!image.complete||!image.naturalWidth)return false;
 const {crop:[x,y,w,h],anchor}=BOOK_WORKER_FRAMES[u.team][pose.row][pose.direction],scale=53/(u.team?290:270);
 crispSprite(c,image,x,y,w,h,(x-anchor[0])*scale,15+(y-anchor[1])*scale,w*scale,h*scale);
 return true;
}
function drawWorkerCargo(c,u){
 if(u.type!=='worker'||!(u.carrying>0))return false;
 const kind=u.cargoKind||'supplies',label=kind==='uranium'?'U':kind==='materials'?'M':'S';
 c.save();c.fillStyle=kind==='uranium'?'#d8c56f':kind==='materials'?'#aac6d0':'#d8b98a';
 c.strokeStyle='#344238';c.lineWidth=1;c.fillRect(-7,-52,14,12);c.strokeRect(-7,-52,14,12);
 c.fillStyle='#243329';c.font='bold 10px monospace';c.textAlign='center';c.fillText(label,0,-42);c.restore();return true;
}
