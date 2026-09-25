'use strict';
// Book-reference art: inspected alpha crops, not assumed equal grid cells.
const BOOK_UNIT_FRAMES = [
 [[40,27,360,473],[456,68,298,432],[830,38,278,463],[1220,38,274,461]],
 [[51,526,315,475],[459,543,292,451],[837,528,283,473],[1238,523,236,479]]
];
const bookUnitSheet = new Image();bookUnitSheet.src='assets/book/units.png';
const bookBuildingSheet = new Image();bookBuildingSheet.src='assets/book/buildings.png';
const BOOK_BUILDING_FRAMES = [[32, 123, 372, 310], [428, 187, 370, 237], [828, 135, 347, 295], [1223, 175, 281, 260], [33, 551, 368, 323], [445, 662, 358, 214], [860, 603, 324, 276], [1268, 557, 213, 334]];
// Four headings and two alternating strides, measured against native alpha bounds.
const BOOK_INFANTRY_FRAMES = [
 [[86,8,202,304],[383,8,180,304],[667,8,199,304],[997,6,181,306]],
 [[90,319,201,305],[383,319,180,305],[671,319,194,304],[997,318,181,306]],
 [[71,631,214,292],[385,629,191,296],[686,631,185,291],[1000,630,188,294]],
 [[70,936,210,293],[386,934,187,298],[692,936,185,292],[1002,936,180,294]]
];
const bookInfantrySheet = new Image();bookInfantrySheet.src='assets/book/infantry-walk.png';
function bookInfantryPose(u, now, minimizeMotion=false) {
 if (!['trooper','scout','sapper'].includes(u.type)) return null;
 const firing=now-(u.firedAt??-Infinity)>=0&&now-u.firedAt<.24;
 const angle=firing?(u.firedAngle??u.angle):u.angle;
 const direction=((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const moving=u.movingUntil>now&&!minimizeMotion&&!firing;
 const phase=moving?Math.floor((u.walkDistance||0)/14)%2:0;
 return {direction,phase,row:u.team*2+phase,angle,firing};
}
function drawBookInfantry(c,u,now,minimizeMotion=false) {
 const pose=bookInfantryPose(u,now,minimizeMotion);
 if (!pose||!bookInfantrySheet.complete||!bookInfantrySheet.naturalWidth) return false;
 const [x,y,w,h]=BOOK_INFANTRY_FRAMES[pose.row][pose.direction];
 const height=55,scale=height/h;
 // Body centers are shared across each direction's stride pair; long trunks must
 // not pull the foot anchor sideways when the figure changes its facing.
 const anchors=u.team?[167,480,797,1094]:[169,473,795,1088];
 c.save();
 if(pose.firing&&!minimizeMotion){const recoil=Math.max(0,1-(now-u.firedAt)/.12);c.translate(-Math.cos(pose.angle)*recoil*1.4,-Math.sin(pose.angle)*recoil*.7);}
 crispSprite(c,bookInfantrySheet,x,y,w,h,(x-anchors[pose.direction])*scale,15-height,w*scale,height);
 c.restore();return true;
}
function drawBookUnit(c,u,now,minimizeMotion=false){
 if(drawBookInfantry(c,u,now,minimizeMotion))return true;
 const col={hero:0,worker:1,trooper:2,scout:2,sapper:2,walker:3}[u.type];
 if(col===undefined||!bookUnitSheet.complete||!bookUnitSheet.naturalWidth)return false;
 const [x,y,w,h]=BOOK_UNIT_FRAMES[u.team][col];
 const height=u.type==='hero'?80:u.type==='walker'?61:u.type==='worker'?53:55,width=height*w/h;
 const moving=u.movingUntil>now&&!minimizeMotion;
 const stride=moving?Math.sin((u.walkDistance||0)/7):0;
 const firing=now-(u.firedAt??-Infinity)>=0&&now-u.firedAt<.24;
 const angle=firing?(u.firedAngle??u.angle):u.angle;
 c.save();if(Math.cos(angle)<0)c.scale(-1,1);
 // Paper-cut gait: distance-driven lean/lift, no idle jiggle or simulation changes.
 c.translate(0,-Math.abs(stride)*1.4);c.rotate(stride*.018);
 crispSprite(c,bookUnitSheet,x,y,w,h,-width/2,15-height,width,height);
 if(u.type==='hero'&&firing){
  c.strokeStyle='#2c322a';c.lineWidth=3;c.beginPath();c.moveTo(8,-18);c.lineTo(30,-18);c.stroke();
  if(!minimizeMotion&&now-u.firedAt<.09){c.fillStyle='#e6bc44';c.beginPath();c.arc(33,-18,3,0,Math.PI*2);c.fill();}
 }
 c.restore();return true;
}
function drawBookBuilding(c,u,height){
 const index=u.type==='turret'?7:u.type==='relay'?3:({core:0,forge:1,factory:2}[u.type]??-1)+(u.team?4:0);
 const frame=BOOK_BUILDING_FRAMES[index];
 if(!frame||!bookBuildingSheet.complete||!bookBuildingSheet.naturalWidth)return false;
 const [x,y,w,h]=frame,width=height*w/h;
 crispSprite(c,bookBuildingSheet,x,y,w,h,-width/2,29-height,width,height);return true;
}

const BOOK_COUNCIL_FRAMES = [[53, 97, 314, 540], [450, 87, 309, 547], [915, 162, 154, 479], [64, 707, 283, 557], [438, 707, 339, 552], [870, 698, 269, 562]];
const bookCouncilSheet=new Image();bookCouncilSheet.src="assets/book/council.png";
const BOOK_CHARACTER_ART={};
for(const [id,frame] of [["babar",BOOK_UNIT_FRAMES[0][0]],["rataxes",BOOK_UNIT_FRAMES[1][0]]])BOOK_CHARACTER_ART[id]={sheet:"assets/book/units.png",frame,portrait:[frame[0],frame[1],frame[2],Math.round(frame[3]*.58)],width:1536,height:1024};
["celeste","cornelius","madame","pompadour","troubadour","basil"].forEach((id,i)=>{const frame=BOOK_COUNCIL_FRAMES[i];BOOK_CHARACTER_ART[id]={sheet:"assets/book/council.png",frame,portrait:[frame[0],frame[1],frame[2],Math.round(frame[3]*.58)],width:1181,height:1332};});
