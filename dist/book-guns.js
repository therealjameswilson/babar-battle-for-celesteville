'use strict';
// Native 1254px alpha bounds, wheel/ground anchors and muzzle centers.
// Rows: mobile idle, alternating travel strides, deployed. Columns: E/S/W/N.
const BOOK_GUN_FRAMES = [[[[86,127,236,183],[410,122,149,186],[625,128,234,182],[1009,126,148,212]],[[71,414,252,184],[410,403,149,200],[624,414,255,184],[1009,406,150,211]],[[68,699,257,185],[407,689,152,200],[622,698,253,186],[1009,692,150,211]],[[65,988,269,184],[382,979,215,193],[633,988,256,184],[974,976,211,197]]],[[[70,95,246,193],[399,86,157,198],[652,96,246,193],[1024,91,157,216]],[[58,399,262,186],[399,386,159,202],[649,399,258,186],[1022,393,160,209]],[[60,688,260,188],[400,679,160,203],[648,688,256,189],[1020,680,162,210]],[[50,981,278,193],[370,977,227,197],[642,983,272,191],[988,970,222,204]]]];
const BOOK_GUN_ANCHORS = [[[[229,305],[484,302],[710,304],[1083,322]],[[231,593],[484,588],[712,593],[1083,607]],[[231,879],[483,875],[711,879],[1083,893]],[[242,1165],[489,1164],[717,1164],[1080,1165]]],[[[224,282],[477,277],[739,282],[1103,294]],[[226,579],[478,575],[738,579],[1103,592]],[[226,870],[479,873],[738,870],[1101,881]],[[234,1167],[484,1166],[734,1167],[1101,1167]]]];
const BOOK_GUN_MUZZLES = [[[[314,226],[484,240],[633,224],[1080,135]],[[326,1076],[489,1088],[644,1075],[1079,985]]],[[[305,198],[477,210],[660,198],[1103,100]],[[318,1076],[484,1090],[651,1077],[1103,979]]]];
const BOOK_GUN_SCALE=64/195;
const bookGunSheets=['elephant','rhino'].map(name=>{const image=new Image();image.src='assets/book/'+name+'-guns.png';return image;});
function bookGunReady(team){const image=bookGunSheets[team];return !!(image&&image.complete&&image.naturalWidth);}
function bookGunPose(u,now,minimizeMotion=false){
 if(u.type!=='walker')return null;
 const age=now-(u.firedAt??-Infinity),firing=age>=0&&age<.35&&!u.artilleryTransition;
 const angle=firing?(u.firedAngle??u.angle):u.angle;
 const direction=((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const moving=!u.deployed&&!u.artilleryTransition&&!firing&&!minimizeMotion&&u.movingUntil>now;
 const row=u.deployed?3:moving?1+Math.floor((u.walkDistance||0)/14)%2:0;
 return {direction,row,angle,firing,age};
}
function bookGunMuzzle(team,angle,deployed){
 const direction=((Math.floor((angle+Math.PI/4)/(Math.PI/2))%4)+4)%4;
 const [x,y]=BOOK_GUN_MUZZLES[team][deployed?1:0][direction];
 const [ax,ay]=BOOK_GUN_ANCHORS[team][deployed?3:0][direction];
 return {x:(x-ax)*BOOK_GUN_SCALE,y:15+(y-ay)*BOOK_GUN_SCALE};
}
function drawBookGun(c,u,now,minimizeMotion=false){
 const pose=bookGunPose(u,now,minimizeMotion);
 if(!pose||!bookGunReady(u.team))return false;
 const [x,y,w,h]=BOOK_GUN_FRAMES[u.team][pose.row][pose.direction];
 const [ax,ay]=BOOK_GUN_ANCHORS[u.team][pose.row][pose.direction];
 c.save();
 if(pose.firing&&!minimizeMotion){const recoil=2*Math.max(0,1-pose.age/.2);c.translate(-Math.cos(pose.angle)*recoil,-Math.sin(pose.angle)*recoil);}
 crispSprite(c,bookGunSheets[u.team],x,y,w,h,(x-ax)*BOOK_GUN_SCALE,15+(y-ay)*BOOK_GUN_SCALE,w*BOOK_GUN_SCALE,h*BOOK_GUN_SCALE);
 if(pose.firing&&!minimizeMotion){
  const m=bookGunMuzzle(u.team,pose.angle,!!u.deployed);
  if(pose.age<.1){
   c.fillStyle='#edc55c';c.strokeStyle='#765332';c.lineWidth=.8;c.beginPath();
   const dx=Math.cos(pose.angle),dy=Math.sin(pose.angle);
   for(const [i,a,b] of [[0,8,0],[1,1,3],[2,-2,0],[3,1,-3]]){
    const x=m.x+dx*a-dy*b,y=m.y+dy*a+dx*b;if(i)c.lineTo(x,y);else c.moveTo(x,y);
   }
   c.closePath();c.fill();c.stroke();
  }
  else {const p=(pose.age-.1)/.25;c.globalAlpha*=.28*(1-p);c.fillStyle='#b6af91';c.beginPath();c.ellipse(m.x+Math.cos(pose.angle)*p*9,m.y+Math.sin(pose.angle)*p*9-3*p,3+5*p,2+3*p,0,0,Math.PI*2);c.fill();}
 }
 c.restore();return true;
}
function drawBookGunShot(c,f,minimizeMotion=false){
 if(!f.heavy||!f.gun||!bookGunReady(f.team))return false;
 const m=bookGunMuzzle(f.team,f.gun.angle,f.gun.deployed);
 const sx=f.x+m.x,sy=f.y+m.y,p=minimizeMotion?1:Math.max(0,Math.min(1,1-f.life/f.max));
 c.fillStyle='#d6ac4d';c.strokeStyle='#3b3d2c';c.lineWidth=1;
 c.beginPath();c.arc(sx+(f.tx-sx)*p,sy+(f.ty-sy)*p-Math.sin(p*Math.PI)*22,3,0,Math.PI*2);c.fill();c.stroke();return true;
}
