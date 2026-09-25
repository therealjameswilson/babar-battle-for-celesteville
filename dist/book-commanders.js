'use strict';
// Measured alpha bounds and foot anchors in two native 1254px book atlases.
const BOOK_COMMANDER_FRAMES = [
 [
  [{"crop":[96,16,199,294],"anchor":[184,306]},{"crop":[386,20,180,289],"anchor":[476,305]},{"crop":[656,19,193,291],"anchor":[761,306]},{"crop":[989,21,177,287],"anchor":[1075,304]}],
  [{"crop":[83,319,214,296],"anchor":[184,611]},{"crop":[379,324,187,293],"anchor":[476,613]},{"crop":[655,319,202,296],"anchor":[765,611]},{"crop":[984,322,190,294],"anchor":[1074,612]}],
  [{"crop":[88,627,213,291],"anchor":[186,914]},{"crop":[389,630,179,290],"anchor":[480,916]},{"crop":[656,628,204,291],"anchor":[763,915]},{"crop":[985,630,194,286],"anchor":[1077,912]}],
  [{"crop":[68,928,272,299],"anchor":[154,1223]},{"crop":[383,933,179,293],"anchor":[476,1222]},{"crop":[610,930,262,297],"anchor":[786,1223]},{"crop":[986,931,206,293],"anchor":[1072,1220]}]
 ],
 [
  [{"crop":[63,9,209,292],"anchor":[151,297]},{"crop":[369,8,193,292],"anchor":[467,296]},{"crop":[673,6,200,295],"anchor":[788,297]},{"crop":[995,8,200,289],"anchor":[1098,293]}],
  [{"crop":[50,320,220,293],"anchor":[149,609]},{"crop":[367,324,207,293],"anchor":[464,613]},{"crop":[666,321,214,291],"anchor":[781,608]},{"crop":[988,321,213,295],"anchor":[1099,612]}],
  [{"crop":[46,632,227,294],"anchor":[150,922]},{"crop":[365,633,204,296],"anchor":[470,925]},{"crop":[660,634,237,293],"anchor":[784,923]},{"crop":[988,635,202,294],"anchor":[1095,925]}],
  [{"crop":[54,944,262,298],"anchor":[148,1238]},{"crop":[383,946,191,297],"anchor":[472,1239]},{"crop":[630,945,276,299],"anchor":[802,1240]},{"crop":[989,940,205,297],"anchor":[1098,1233]}]
 ]
];
const BOOK_COMMANDER_MUZZLES = [
 [[330,1039],[453,1055],[620,1039],[1161,937]],
 [[307,1049],[443,1034],[637,1049],[1163,949]]
];
const bookCommanderSheets=['babar','rataxes'].map(name=>{
 const image=new Image();image.src='assets/book/'+name+'-motion.png';return image;
});
function drawBookCommander(c,u,now,minimizeMotion=false){
 if(u.type!=='hero')return false;
 const image=bookCommanderSheets[u.team];
 if(!image||!image.complete||!image.naturalWidth)return false;
 const pose=commanderPose(u,now,minimizeMotion),{crop,anchor}=BOOK_COMMANDER_FRAMES[u.team][pose.row][pose.direction];
 const [x,y,w,h]=crop,scale=80/300;
 crispSprite(c,image,x,y,w,h,(x-anchor[0])*scale,15+(y-anchor[1])*scale,w*scale,h*scale);
 if(pose.flash){
  const muzzle=BOOK_COMMANDER_MUZZLES[u.team][pose.direction];
  c.fillStyle='#e5bd48';c.beginPath();c.arc((muzzle[0]-anchor[0])*scale,15+(muzzle[1]-anchor[1])*scale,3,0,Math.PI*2);c.fill();
 }
 return true;
}
