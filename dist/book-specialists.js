'use strict';
const bookSpecialistSheet=new Image();
bookSpecialistSheet.src='assets/book/specialist-buildings.png';
// Native alpha bounds and world widths: preserve the established clickable rings.
const BOOK_SPECIALIST_FRAMES={
 quarry:{crop:[31,117,479,337],width:100,bottom:20},
 headquarters:{crop:[535,139,481,314],width:116,bottom:29},
 shelter:{crop:[1048,201,460,248],width:92,bottom:20},
 silo:{crop:[31,513,470,403],width:92,bottom:20},
 interceptor:{crop:[545,570,442,355],width:96,bottom:20},
 trench:{crop:[1030,669,484,269],width:140,bottom:39}
};
function drawBookSpecialist(c,u){
 const frame=BOOK_SPECIALIST_FRAMES[u.type];
 if(!frame||!bookSpecialistSheet.complete||!bookSpecialistSheet.naturalWidth)return false;
 const [x,y,w,h]=frame.crop,height=frame.width*h/w;
 crispSprite(c,bookSpecialistSheet,x,y,w,h,-frame.width/2,frame.bottom-height,frame.width,height);
 c.save();c.fillStyle=u.team?'#a64b3e':'#376c52';c.strokeStyle='#394335';c.lineWidth=1;
 if(u.type==='trench'){
  c.fillRect(-64,2,7,13);c.strokeRect(-64,2,7,13);
 }else{
  const fx=-frame.width*.38,fy=frame.bottom-height*.6;
  c.beginPath();c.moveTo(fx,frame.bottom-4);c.lineTo(fx,fy-15);c.stroke();
  c.fillRect(fx,fy-15,15,10);c.strokeRect(fx,fy-15,15,10);
 }
 if(u.type==='shelter'||u.type==='headquarters'){
  c.font='bold 10px monospace';c.textAlign='center';
  const text=u.type==='shelter'?'CIVIL DEFENSE':'HQ',width=c.measureText(text).width+8;
  const baseline=frame.bottom-height-8;
  c.fillStyle='#f2e6ca';c.fillRect(-width/2,baseline-10,width,13);
  c.fillStyle='#2e4231';c.fillText(text,0,baseline);
 }
 c.restore();return true;
}
