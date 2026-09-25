const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{constructor(){this.complete=true;this.naturalWidth=1254;}},crispSprite(){}});
vm.runInContext(fs.readFileSync('dist/book-specialist-heroes.js','utf8')+fs.readFileSync('tests/special-heroes-checks.js','utf8'),scope);
vm.runInContext('specialHeroChecks((ok,label)=>{if(!ok)throw Error(label)});this.frames=[BOOK_LADY_FRAMES,BOOK_BIKE_FRAMES];this.anchors=[BOOK_LADY_ANCHORS,BOOK_BIKE_ANCHORS];',scope);
for(let sheet=0;sheet<2;sheet++){
 const {w,h,pixels}=rgba('assets/book/'+(sheet?'arthur-bike':'old-lady-motion')+'.png',sheet?1536:1254,sheet?1024:1254);
 for(let row=0;row<scope.frames[sheet].length;row++)for(let dir=0;dir<4;dir++){
  const [x,y,cw,ch]=scope.frames[sheet][row][dir],[ax,ay]=scope.anchors[sheet][row][dir];
  assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);assert(ax>x&&ax<x+cw&&ay>y&&ay<y+ch);
  let solid=0,edge=0;for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
   const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
   if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
  }
  assert(solid>1000&&edge<80,'unclipped specialist hero');
 }
}
vm.runInContext(`
const u=Object.freeze({type:'madame',angle:0});
if(!drawBookSpecialHero({},u,10))throw Error('lady ready');
bookLadySheet.naturalWidth=0;if(drawBookSpecialHero({},u,10))throw Error('lady fallback');
bookBikeSheet.naturalWidth=0;if(drawBookSpecialHero({},{type:'bike',angle:0},10))throw Error('bike fallback');
`,scope);
console.log('PASS: 24 hero crops/anchors, directions, stride, shot bearing/expiry, reduced motion and loading fallback.');
