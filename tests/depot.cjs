const fs=require('node:fs'),assert=require('node:assert/strict');
const {run}=require('./smoke.cjs');
run(fs.readFileSync('tests/depot-checks.js','utf8'));
run('depotChecks((ok,label)=>{if(!ok)throw Error(label)});');
const {rgba}=require('./character-art.cjs');
const {w,pixels}=rgba('assets/book/depot.png',1254,1254);
const [x,y,cw,ch]=run('DEPOT_CROP');let solid=0,edge=0;
for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
 const a=pixels[(yy*w+xx)*4+3];if(a>80)solid++;
 if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,a);
}
assert(solid>10000&&edge<80,'depot art visible and unclipped');
console.log('PASS: depot stock command, label spacing, ownership/income, pure rendering and alpha crop.');
