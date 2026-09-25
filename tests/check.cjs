const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
for (const f of fs.readdirSync('dist').filter((f) => f.endsWith('.js')))
  execFileSync(process.execPath, ['--check', 'dist/' + f], { stdio: 'inherit' });
console.log('PASS: JavaScript syntax');

for (const name of ['characters-siege.png', 'buildings-siege.png', 'infantry-directions.png','infantry-walk.png']) {
  const png = fs.readFileSync('dist/assets/' + name);
  if (png.readUInt32BE(16) !== 1254 || png.readUInt32BE(20) !== 1254 || png[25] !== 6)
    throw Error(name + ' must be 1254px RGBA');
}
console.log('PASS: final atlas dimensions and alpha channel');
require('./character-art.cjs');
require('./commander-animation.cjs');
require('./mushroom-clouds.cjs');

require('./book-art.cjs');

require('./book-motion.cjs');

require('./book-commanders.cjs');

require('./book-workers.cjs');
