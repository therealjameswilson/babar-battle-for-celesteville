'use strict';
const bookLadySheet=new Image();bookLadySheet.src='assets/book/old-lady-motion.png?v=2';
const bookBikeSheet=new Image();bookBikeSheet.src='assets/book/arthur-bike.png';
const BOOK_LADY_FRAMES=[
 [[75,13,189,296],[392,13,148,296],[678,13,184,296],[1036,13,157,294]],
 [[74,330,189,289],[396,329,142,293],[677,330,187,289],[1034,328,157,293]],
 [[69,644,194,288],[406,641,145,294],[679,643,191,289],[1034,641,157,293]],
 [[53,957,254,267],[392,956,156,269],[636,956,251,269],[1013,939,164,283]]
];
const BOOK_LADY_ANCHORS=[
 [[147,304],[478,304],[799,304],[1107,302]],
 [[144,614],[478,617],[798,614],[1109,616]],
 [[144,927],[478,930],[798,927],[1109,930]],
 [[143,1219],[469,1220],[800,1220],[1098,1218]]
];
const BOOK_LADY_MUZZLES=[[299,1061],[471,1093],[642,1064],[1100,946]];
const BOOK_BIKE_FRAMES=[
 [[17,54,428,428],[482,46,213,439],[756,53,434,430],[1268,48,220,441]],
 [[18,547,434,415],[494,542,215,422],[756,549,440,414],[1268,551,226,413]]
];
const BOOK_BIKE_ANCHORS=[[[232,478],[591,481],[973,479],[1377,485]],[[235,958],[598,960],[977,959],[1380,960]]];
function bookSpecialHeroPose(u,now,minimizeMotion=false){
 if(!['madame','bike'].includes(u.type))return null;
 const firing=now-(u.firedAt??-Infinity)>=0&&now-u.firedAt<.4;
 const angle=firing?(u.firedAngle??u.angle):u.angle;
 const direction=((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const moving=u.movingUntil>now&&!minimizeMotion;
 const row=u.type==='bike'?(moving?1:0):firing?3:moving?1+Math.floor((u.walkDistance||0)/14)%2:0;
 return {direction,row,firing,angle};
}
function bookLadyMuzzle(angle){
 const direction=((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const [x,y]=BOOK_LADY_MUZZLES[direction],[ax,ay]=BOOK_LADY_ANCHORS[3][direction];
 return {x:(x-ax)*72/290,y:15+(y-ay)*72/290};
}
function drawBookSpecialHero(c,u,now,minimizeMotion=false){
 const pose=bookSpecialHeroPose(u,now,minimizeMotion);
 if(!pose)return false;
 const lady=u.type==='madame',sheet=lady?bookLadySheet:bookBikeSheet;
 if(!sheet.complete||!sheet.naturalWidth)return false;
 const frames=lady?BOOK_LADY_FRAMES:BOOK_BIKE_FRAMES,anchors=lady?BOOK_LADY_ANCHORS:BOOK_BIKE_ANCHORS;
 const [x,y,w,h]=frames[pose.row][pose.direction],[ax,ay]=anchors[pose.row][pose.direction],scale=lady?72/290:68/432;
 crispSprite(c,sheet,x,y,w,h,(x-ax)*scale,15+(y-ay)*scale,w*scale,h*scale);
 return true;
}
function specialHeroLabel(c,text,y){
 c.save();c.font='bold 11px Georgia';c.textAlign='center';c.lineWidth=3;
 c.strokeStyle='#f3e9cc';c.strokeText(text,0,y);c.fillStyle='#263d2b';c.fillText(text,0,y);c.restore();
}
