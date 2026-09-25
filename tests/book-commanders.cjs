const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{constructor(){this.complete=true;this.naturalWidth=1254;}},crispSprite(){}});
for(const file of ['book-art.js','commander-animation.js','book-commanders.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),scope);
vm.runInContext('this.frames=BOOK_COMMANDER_FRAMES;this.muzzles=BOOK_COMMANDER_MUZZLES;',scope);
for(let team=0;team<2;team++){
 const {w,h,pixels}=rgba('assets/book/'+['babar','rataxes'][team]+'-motion.png',1254,1254);
 assert.equal(scope.frames[team].length,4);
 for(let row=0;row<4;row++)for(let dir=0;dir<4;dir++){
  const {crop:[x,y,cw,ch],anchor:[ax,ay]}=scope.frames[team][row][dir];
  assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);
  assert(ax>x&&ax<x+cw&&ay>y&&ay<y+ch,'foot anchor inside crop');
  let solid=0,edge=0;
  for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
   const alpha=pixels[(yy*w+xx)*4+3];if(alpha>80)solid++;
   if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,alpha);
  }
  assert(solid>1000&&edge<80,'visible, unclipped commander');
  if(row===3){const [mx,my]=scope.muzzles[team][dir];assert(mx>=x&&mx<x+cw&&my>=y&&my<y+ch,'muzzle inside firing frame');}
 }
}
vm.runInContext(`
this.drawn=[];crispSprite=(...args)=>drawn.push(args);this.flashes=0;
this.c={beginPath(){},arc(){flashes++},fill(){},save(){},restore(){},translate(){},rotate(){},scale(){}};
for(let team=0;team<2;team++)for(let dir=0;dir<4;dir++)for(let row=0;row<4;row++){
 const u=Object.freeze({type:'hero',team,angle:dir*Math.PI/2,movingUntil:row===1||row===2?11:0,walkDistance:row===2?16:0,firedAt:row===3?10:-10,firedAngle:dir*Math.PI/2});
 if(!drawBookUnit(c,u,10))throw Error('Book commander not drawn');
 const last=drawn.at(-1);if(last[1]!==bookCommanderSheets[team]||last.slice(2,6).join()!==BOOK_COMMANDER_FRAMES[team][row][dir].crop.join())throw Error('Wrong commander frame');
}
if(flashes!==8)throw Error('Expected eight directional firing flashes');
const old=flashes;drawBookCommander(c,{type:'hero',team:0,angle:0,firedAt:10},10,true);if(flashes!==old)throw Error('Reduced motion flash');
bookCommanderSheets[0].naturalWidth=0;drawBookUnit(c,{type:'hero',team:0,angle:0},10);
if(drawn.at(-1)[1]!==bookUnitSheet)throw Error('Book profile fallback missing');
if(drawBookCommander(c,{type:'worker'},10))throw Error('Worker got hero sheet');
`,scope);
console.log('PASS: 32 book commander frames, alpha/anchors/muzzles, actual routing, reduced motion and fallback.');
