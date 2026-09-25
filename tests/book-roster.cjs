const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {rgba}=require('./character-art.cjs');
const scope=vm.createContext({Image:class{}});
vm.runInContext(['cast','character-art','book-art','book-roster'].map(n=>fs.readFileSync('dist/'+n+'.js','utf8')).join('\n')+';this.roster=COURT;this.art=BOOK_CHARACTER_ART;this.added=BOOK_ROSTER_ART;',scope);
assert.equal(Object.keys(scope.added).length,25);
assert.deepEqual(Object.keys(scope.art).sort(),Array.from(scope.roster,c=>c.id).sort());
const sheets=new Map();
for(const [id,a] of Object.entries(scope.added)){
 if(!sheets.has(a.sheet))sheets.set(a.sheet,rgba(a.sheet,a.width,a.height));
 const {w,h,pixels}=sheets.get(a.sheet);
 for(const [x,y,cw,ch] of [a.frame,a.portrait])assert(x>=0&&y>=0&&cw>0&&ch>0&&x+cw<=w&&y+ch<=h,id+' bounds');
 const [x,y,cw,ch]=a.frame;let solid=0,edge=0;
 for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++){
  const alpha=pixels[(yy*w+xx)*4+3];if(alpha>80)solid++;
  if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,alpha);
 }
 assert(solid>1000&&edge<80,id+' unclipped: '+edge);
 assert(scope.characterArtMarkup(id).includes(a.sheet),id+' full figure uses resolved art');
 assert(scope.characterArtMarkup(id,true).includes(a.portrait.join(' ')),id+' portrait uses measured crop');
}
assert.equal(sheets.size,4);
assert.equal(scope.characterArtMarkup('missing'),'');
console.log('PASS: complete 33-character book roster; 25 new alpha crops, portrait bounds and shared art resolution.');
