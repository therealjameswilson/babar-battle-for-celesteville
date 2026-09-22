const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const c=vm.createContext({Image:class{},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))});
vm.runInContext(fs.readFileSync('dist/mushroom-clouds.js','utf8')+'\nthis.profiles=CLOUD_PROFILES;',c);
const {w,h,pixels}=rgba('assets/mushroom-clouds.png');
for(const kind of ['atomic','hydrogen']){
 const [x,y,cw,ch]=c.profiles[kind].crop;assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);let solid=0,edge=0;
 for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){const a=pixels[(yy*w+xx)*4+3];if(a>32)solid++;if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);}
 assert(solid>10000);assert(edge<=32,'cloud crop clips visible alpha');
 const f=c.mushroomCloudEffect({x:20,y:30,kind});assert.equal(f.kind,kind);assert.equal(f.life,kind==='atomic'?8:12);
 const first=c.mushroomCloudPose(f),later=c.mushroomCloudPose({...f,life:f.life-4});assert(later.growth>first.growth);
 assert.equal(c.mushroomCloudPose(f,true).growth,1);assert.equal(c.mushroomCloudPose({...f,life:0}).opacity,0);
}
assert(c.profiles.hydrogen.width>c.profiles.atomic.width);
console.log('PASS: mushroom-cloud alpha/crop bounds, distinct profiles, growth, expiry and reduced motion.');
