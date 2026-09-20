const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('dist/cast.js','utf8') + '\n' + fs.readFileSync('dist/character-art.js','utf8') + '\nthis.roster=COURT;this.art=CHARACTER_ART;', context);
assert.equal(context.roster.length, 33);
assert.deepEqual(Object.keys(context.art).sort(),Array.from(context.roster,c=>c.id).sort());
function rgba(file, expectedWidth = 1536, expectedHeight = 1024) {
  const b=fs.readFileSync('dist/'+file), w=b.readUInt32BE(16), h=b.readUInt32BE(20);
  assert.equal(w,expectedWidth); assert.equal(h,expectedHeight); assert.equal(b[24],8); assert.equal(b[25],6); assert.equal(b[28],0);
  const blocks=[];
  for(let p=8;p<b.length;) { const n=b.readUInt32BE(p);if(b.toString('ascii',p+4,p+8)==='IDAT')blocks.push(b.subarray(p+8,p+8+n));p+=n+12; }
  const raw=zlib.inflateSync(Buffer.concat(blocks)), stride=w*4, pixels=Buffer.alloc(w*h*4);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<h;y++) {const f=raw[y*(stride+1)];assert.ok(f<=4);for(let x=0;x<stride;x++) {const at=y*stride+x,a=x>=4?pixels[at-4]:0,up=y?pixels[at-stride]:0,c=y&&x>=4?pixels[at-stride-4]:0;pixels[at]=(raw[y*(stride+1)+1+x]+(f===0?0:f===1?a:f===2?up:f===3?Math.floor((a+up)/2):paeth(a,up,c)))&255;}}
  return {w,h,pixels};
}
const sheets=new Map();
for(const [id,a] of Object.entries(context.art)) {
  assert.match(a.sheet,/^assets\/roster\/[a-z]+\.png$/);
  if(!sheets.has(a.sheet))sheets.set(a.sheet,rgba(a.sheet));
  const {w,h,pixels}=sheets.get(a.sheet);
  for(const crop of [a.frame,a.portrait]) {const [x,y,cw,ch]=crop;assert.ok(crop.every(Number.isInteger));assert.ok(x>=0&&y>=0&&cw>0&&ch>0&&x+cw<=w&&y+ch<=h,id+' bounds');}
  const [x,y,cw,ch]=a.frame;
  let solid=0,clear=0,edge=0;
  for(let yy=y;yy<y+ch;yy++)for(let xx=x;xx<x+cw;xx++) {const alpha=pixels[(yy*w+xx)*4+3];if(alpha>80)solid++;if(alpha<10)clear++;if(xx===x||xx===x+cw-1||yy===y||yy===y+ch-1)edge=Math.max(edge,alpha);}
  assert.ok(solid>1000,id+' has visible sprite');assert.ok(clear>100,id+' has transparent surroundings');assert.ok(edge<80,id+' crop must not cut opaque pixels: '+edge);
}
assert.equal(sheets.size,6);
console.log('PASS: all 33 roster sprites, six decoded RGBA atlases, transparent margins, valid portrait/full-body bounds, no opaque pixels clipped');

module.exports = { rgba };
