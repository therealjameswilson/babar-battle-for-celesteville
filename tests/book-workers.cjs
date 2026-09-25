const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{constructor(){this.complete=true;this.naturalWidth=1254;}},crispSprite(){}});
for(const file of ['dist/book-art.js','dist/book-workers.js','tests/book-workers-checks.js'])vm.runInContext(fs.readFileSync(file,'utf8'),scope);
vm.runInContext('bookWorkerChecks((ok,label)=>{if(!ok)throw Error(label)});this.frames=BOOK_WORKER_FRAMES;',scope);
for(let team=0;team<2;team++){
 const {w,h,pixels}=rgba('assets/book/'+['elephant','rhino'][team]+'-worker.png',1254,1254);
 for(const row of scope.frames[team])for(const {crop:[x,y,cw,ch],anchor:[ax,ay]} of row){
  assert(x>=0&&y>=0&&x+cw<=w&&y+ch<=h);assert(ax>x&&ax<x+cw&&ay>y&&ay<y+ch);
  let solid=0,edge=0;for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
   const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
   if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
  }
  assert(solid>1000&&edge<80,'visible unclipped worker');
 }
}
vm.runInContext(`
this.draws=[];crispSprite=(...args)=>draws.push(args);this.labels=[];
const c={save(){},restore(){},fillRect(){},strokeRect(){},fillText(s){labels.push(s)}};
for(const [kind,label] of [['supplies','S'],['materials','M'],['uranium','U']]){
 const u=Object.freeze({type:'worker',team:0,angle:0,carrying:4,cargoKind:kind});
 if(!drawBookUnit(c,u,10)||draws.at(-1)[1]!==bookWorkerSheets[0])throw Error('Worker routing');
 if(!drawWorkerCargo(c,u)||labels.at(-1)!==label)throw Error('Cargo label');
}
if(drawWorkerCargo(c,{type:'worker',carrying:0}))throw Error('Empty worker badge');
bookWorkerSheets[0].naturalWidth=0;
if(drawBookWorker(c,{type:'worker',team:0,angle:0},10))throw Error('Missing sheet fallback');
`,scope);
console.log('PASS: 32 worker crops/anchors, cargo/facing/stride/reduced-motion states, badges, route and fallback.');
