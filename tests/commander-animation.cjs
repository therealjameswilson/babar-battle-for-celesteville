const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const context=vm.createContext({Image:class {constructor(){this.complete=true;this.naturalWidth=1254;}}});
vm.runInContext(fs.readFileSync('dist/commander-animation.js','utf8')+'\nthis.frames=COMMANDER_FRAMES;',context);
for(let team=0;team<2;team++) {
 const {w,h,pixels}=rgba('assets/commanders/'+['babar','rataxes'][team]+'.png',1254,1254);
 for(const row of context.frames[team])for(const {crop,anchor} of row) {
  const [x,y,cw,ch]=crop;assert.ok(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);
  assert.ok(anchor[0]>x&&anchor[0]<x+cw&&anchor[1]>y&&anchor[1]<=y+ch);
  let solid=0,edge=0;for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);}
  assert.ok(solid>1000);assert.ok(edge<80,'unclipped frame '+JSON.stringify(crop)+' edge '+edge);
 }
}
const pose=(u,t=10,reduced=false)=>context.commanderPose(u,t,reduced);
for(let d=0;d<4;d++) {
 const u=Object.freeze({type:'hero',team:0,angle:d*Math.PI/2,movingUntil:11,walkDistance:0});
 assert.equal(pose(u).direction,d);assert.equal(pose(u).row,1);
 assert.equal(pose({...u,walkDistance:16}).row,2);assert.equal(pose({...u,walkDistance:32}).row,1);
 assert.equal(pose({...u,movingUntil:10}).row,0);assert.equal(pose(u,10,true).row,0);
 const firing={...u,firedAt:10,firedAngle:-Math.PI/2};
 assert.equal(pose(firing).row,3);assert.equal(pose(firing).direction,3);assert.equal(pose(firing).flash,true);
 assert.equal(pose(firing,10,true).flash,false);assert.equal(pose(firing,10.1).flash,false);assert.equal(pose(firing,10.25).row,1);
 assert.notEqual(pose({...u,firedAt:11}).row,3);
}
let draws=0;const fake={drawImage(){draws++;},beginPath(){},arc(){},fill(){}};
assert.equal(context.drawCommanderSprite(fake,{type:'worker'},10),false);
context.drawCommanderSprite(fake,{type:'hero',team:0,angle:0},10);assert.equal(draws,1);
vm.runInContext('commanderSheets[0].naturalWidth=0',context);
assert.equal(context.drawCommanderSprite(fake,{type:'hero',team:0,angle:0},10),false);
console.log('PASS: 32 commander frames/anchors/alpha bounds, four facings, distance cadence, stop, shot direction/expiry, reduced motion, immutable pose selection and missing-image fallback');
