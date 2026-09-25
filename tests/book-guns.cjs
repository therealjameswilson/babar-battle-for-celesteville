const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{constructor(){this.complete=true;this.naturalWidth=1254;}},crispSprite(){}});
for(const f of ['dist/book-art.js','dist/book-guns.js','tests/book-gun-checks.js'])vm.runInContext(fs.readFileSync(f,'utf8'),scope);
vm.runInContext('this.frames=BOOK_GUN_FRAMES;this.anchors=BOOK_GUN_ANCHORS;this.muzzles=BOOK_GUN_MUZZLES;',scope);
for(let team=0;team<2;team++){
 const {w,h,pixels}=rgba('assets/book/'+['elephant','rhino'][team]+'-guns.png',1254,1254);
 for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++){
  const [x,y,cw,ch]=scope.frames[team][row][dir],[ax,ay]=scope.anchors[team][row][dir];
  assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);assert(ax>x&&ax<x+cw&&ay>y&&ay<y+ch);
  let solid=0,edge=0;
  for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
   const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
   if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
  }
  assert(solid>1000&&edge<80,[team,row,dir]+' unclipped '+edge);
  if(row===0||row===3){const [mx,my]=scope.muzzles[team][row===3?1:0][dir];assert(mx>=x&&mx<x+cw&&my>=y&&my<y+ch,'muzzle inside frame');}
 }
}
vm.runInContext(`
bookGunChecks((ok,label)=>{if(!ok)throw Error(label)});
let calls=[];crispSprite=(...args)=>calls.push(args);let flashes=0;
const c={globalAlpha:1,save(){},restore(){},translate(){},beginPath(){},arc(){},ellipse(){},moveTo(){},lineTo(){},closePath(){},fill(){if(this.fillStyle==='#edc55c')flashes++},stroke(){},scale(){},rotate(){}};
for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++)for(let row=0;row<4;row++){
 const u=Object.freeze({type:'walker',team,angle:dir*Math.PI/2,movingUntil:[1,2].includes(row)?11:0,walkDistance:row===2?14:0,deployed:row===3});
 if(!drawBookUnit(c,u,10)||calls.at(-1)[1]!==bookGunSheets[team])throw Error('actual book routing');
 if(calls.at(-1).slice(2,6).join()!==BOOK_GUN_FRAMES[team][row][dir].join())throw Error('wrong frame');
}
drawBookGun(c,{type:'walker',team:0,angle:0,firedAt:10},10,true);if(flashes)throw Error('reduced flash');
drawBookGun(c,{type:'walker',team:0,angle:0,firedAt:10},10);if(flashes!==1)throw Error('muzzle flash');
bookGunSheets[0].naturalWidth=0;drawBookUnit(c,{type:'walker',team:0,angle:0},10);if(calls.at(-1)[1]!==bookUnitSheet)throw Error('profile fallback');
if(drawBookGunShot(c,{heavy:true,team:0,gun:{angle:0}},false))throw Error('effect fallback');
if(drawBookGunShot(c,{heavy:true,team:1},false))throw Error('older saved effect fallback');
`,scope);
console.log('PASS: 32 gun-crew crops/anchors/muzzles, movement/deployment/shot poses, reduced motion, actual routing and loading/older-effect fallback.');
