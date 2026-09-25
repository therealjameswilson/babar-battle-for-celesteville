const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class {}});
vm.runInContext(fs.readFileSync('dist/book-art.js','utf8')+'\nthis.units=BOOK_UNIT_FRAMES;this.buildings=BOOK_BUILDING_FRAMES;this.council=BOOK_COUNCIL_FRAMES;',scope);
for(const [name,frames] of [['units',scope.units.flat()],['buildings',scope.buildings],['council',scope.council]]){
 const {w,h,pixels}=rgba('assets/book/'+name+'.png',name==='council'?1181:1536,name==='council'?1332:1024);
 assert.equal(frames.length,name==='council'?6:8);
 for(const [x,y,cw,ch] of frames){
  assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h,'crop in bounds');let solid=0,edge=0;
  for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
   const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
   if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
  }
  assert(solid>1000,name+' visible');assert(edge<80,name+' no clipped outline: '+edge);
 }
}
console.log('PASS: book unit/building alpha bounds and transparent margins.');
