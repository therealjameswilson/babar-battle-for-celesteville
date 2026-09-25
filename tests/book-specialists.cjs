const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{constructor(){this.complete=true;this.naturalWidth=1536;}},crispSprite(){}});
vm.runInContext(fs.readFileSync('dist/book-art.js','utf8')+fs.readFileSync('dist/book-specialists.js','utf8')+';this.frames=BOOK_SPECIALIST_FRAMES;',scope);
const {w,h,pixels}=rgba('assets/book/specialist-buildings.png',1536,1024);
for(const [type,{crop:[x,y,cw,ch],width,bottom}] of Object.entries(scope.frames)){
 assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);assert(width>=90&&width<=140&&bottom<=39);
 let solid=0,edge=0;
 for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
  const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
  if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
 }
 assert(solid>1000&&edge<80,type+' unclipped');
}
vm.runInContext(`
const c={save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(){},measureText(s){return {width:s.length*6}}};
for(const type of Object.keys(BOOK_SPECIALIST_FRAMES))for(const team of [0,1]){
 if(!drawBookSpecialist(c,Object.freeze({type,team})))throw Error(type+' route');
 if(drawBookBuilding(c,{type,team},90))throw Error(type+' must not use unrelated base atlas');
}
bookSpecialistSheet.naturalWidth=0;
if(drawBookSpecialist(c,{type:'silo',team:0}))throw Error('loading fallback');
if(drawBookSpecialist(c,{type:'hero',team:0}))throw Error('wrong type');
`,scope);
console.log('PASS: six specialist alpha crops, faction routing, unsupported-type rejection and loading fallback.');
