const fs=require('node:fs'),vm=require('node:vm');
const scope=vm.createContext({Image:class{}});
vm.runInContext(fs.readFileSync('dist/book-art.js','utf8')+'\n'+fs.readFileSync('tests/book-motion-checks.js','utf8'),scope);
vm.runInContext('bookMotionChecks((ok,label)=>{if(!ok)throw Error(label)})',scope);
console.log('PASS: book infantry four facings, two distance-driven strides, rest, aim, expiry and reduced motion.');
vm.runInContext(`
this.drawn=[];this.crispSprite=(...args)=>drawn.push(args);
this.c={save(){},restore(){},translate(){},rotate(){},scale(){}};
this.unit=Object.freeze({type:'trooper',team:0,angle:0,movingUntil:11,walkDistance:14});
bookInfantrySheet.complete=true;bookInfantrySheet.naturalWidth=1254;
if(!drawBookUnit(c,unit,10)||drawn[0][1]!==bookInfantrySheet)throw Error('Directional sheet not used');
bookInfantrySheet.naturalWidth=0;bookUnitSheet.complete=true;bookUnitSheet.naturalWidth=1536;
if(!drawBookUnit(c,unit,10)||drawn[1][1]!==bookUnitSheet)throw Error('Profile fallback not used');
bookUnitSheet.naturalWidth=0;if(drawBookUnit(c,unit,10))throw Error('Missing images must defer to legacy renderer');
`,scope);
console.log('PASS: directional art routing, book-profile loading fallback and legacy fallback.');
