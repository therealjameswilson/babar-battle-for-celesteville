// Deterministic engine checks, with a minimal DOM/canvas harness (not browser QA).
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = new Proxy(
  {},
  { get: (o, k) => o[k] || (() => {}), set: (o, k, v) => ((o[k] = v), true) }
);
function element() {
  const events = {};
  return {
    textContent: '',
    innerHTML: '',
    style: {},
    open: false,
    children: [],
    firstElementChild: { style: {} },
    classList: { add() {}, remove() {}, toggle() {} },
    getContext: () => context,
    clientWidth: 950,
    clientHeight: 650,
    width: 950,
    height: 650,
    setAttribute() {},
    addEventListener(name, fn) {
      events[name] = fn;
    },
    appendChild(child) {
      this.children.push(child);
      child.parentElement = this;
    },
    insertBefore(child) {
      this.appendChild(child);
    },
    replaceChildren() {
      this.children = [];
    },
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      events.close?.();
    },
  };
}
const els = {};
let randomSeed = 8;
const deterministicMath = Object.create(Math);
deterministicMath.random = () =>
  ((randomSeed = (randomSeed * 16807) % 2147483647) - 1) / 2147483646;
const sandbox = {
  console,
  Math: deterministicMath,
  devicePixelRatio: 1,
  document: {
    getElementById: (id) => (els[id] ||= element()),
    createElement: element,
    querySelectorAll: () => [],
    querySelector: (id) => (els[id] ||= element()),
    addEventListener() {},
  },
  Image: class {
    constructor() {
      this.complete = true;
      this.naturalWidth = 1254;
    }
  },
  window: { innerWidth: 1000, addEventListener() {} },
  requestAnimationFrame() {},
  alert() {},
  confirm: () => true,
  location: { reload() {} },
};
vm.createContext(sandbox);
for (const file of [
  'cast.js',
  'game.js',
  'navigation.js',
  'tactics.js',
  'audio.js',
  'court.js',
  'render.js',
])
  vm.runInContext(fs.readFileSync(path.join(root, 'dist', file), 'utf8'), sandbox, {
    filename: file,
  });
const run = (s) => vm.runInContext(s, sandbox);
const tick = (n) => run(`for(let i=0;i<${n}&&!ended;i++)update(.05)`);
assert.equal(run('COURT.length'), 33);
assert.equal(run('new Set(COURT.map(c=>c.id)).size'), 33);
assert.equal(run('supply()'), 10);
assert.equal(run('cap()'), 30);
run('running=true');
tick(220);
assert(run('ore') > 300, 'Fruit is returned to the palace.');
run("selected=[alive(0).find(u=>u.type==='forge')];train('trooper')");
tick(150);
assert.equal(run("alive(0).filter(u=>u.type==='trooper').length"), 6);
assert.equal(run("validBuild({x:320,y:900},'relay')"), false);
run(
  "ore=10000;selected=[alive(0).find(u=>u.type==='core')];build('relay');command({x:600,y:1030})"
);
tick(500); // Worker travel to the site plus nine seconds of construction.
assert.equal(run('cap()'), 40);
// Every purchasable character power activates; one-time powers cannot charge twice.
run('reset();running=true;ore=10000');
for (const id of run('COURT.filter(c=>c.team===0&&!c.cooldown&&!c.storyOnly).map(c=>c.id)')) {
  assert(run(`usePower('${id}')`), `${id} activates.`);
  const funds = run('ore');
  assert.equal(run(`usePower('${id}')`), false);
  assert.equal(run('ore'), funds);
}
assert.equal(run('buildingCost("forge")'), 128);
assert.equal(run('cap()'), 45);
assert.equal(run('nodes.length'), 12);
assert.equal(run('nextWave'), 110);
assert(run('vision(alive(0)[0])') > 300);
assert.equal(run("add('worker',0,250,750).max"), 135);
assert.equal(run("add('walker',0,500,800).max"), 320);
run("const h=alive(0).find(u=>u.type==='hero');h.hp=200;usePower('babar')");
assert.equal(run("alive(0).find(u=>u.type==='hero').hp"), 280);
assert.equal(run("usePower('babar')"), false);
run("usePower('zephir')");
assert.equal(run('revealUntil'), 25);
run("const h2=alive(0).find(u=>u.type==='hero');h2.hp=150;usePower('truffles')");
assert.equal(run("alive(0).find(u=>u.type==='hero').hp"), 250);
// Partial final baskets are deposited rather than abandoned.
run(
  "reset();running=true;nodes=[{x:225,y:800,r:20,amount:5}];alive(0).filter(u=>u.type==='worker').forEach(u=>{u.x=225;u.y=830;u.order={kind:'gather',node:nodes[0]}})"
);
tick(280);
assert.equal(run('ore'), 305);
// Commander recovery and the enemy court's first upgrade.
run(
  "reset();running=true;const h3=alive(0).find(u=>u.type==='hero');h3.hp=1;shoot(alive(1).find(u=>u.type==='hero'),h3)"
);
tick(940);
assert.equal(run("alive(0).filter(u=>u.type==='hero').length"), 1);
run('t=nextWave;update(.05)');
assert.equal(run('wave'), 1);
assert.equal(run("alive(1).find(u=>u.type==='core').max"), 2050);
run('selectArmy();mode="attack";command({x:1460,y:280})');
tick(2500);
assert(
  run('ended || units.some(u=>u.hp<u.max)'),
  'An opposed attack resolves damage or the mission.'
);
run('draw()');
run('reset();running=true;openCourt()');
assert.equal(run('paused'), true);
run('closeCourt()');
assert.equal(run('paused'), false);
run(
  "reset();running=true;units.filter(u=>u.team===1&&u.type==='core').forEach(u=>u.hp=0);update(.05)"
);
assert.equal(run('ended'), true);
run(
  "reset();running=true;units.filter(u=>u.team===0&&u.type==='core').forEach(u=>u.hp=0);update(.05)"
);
assert.equal(run('ended'), true);
// The static deployment is self-contained, including artwork.
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))
  assert(fs.existsSync(path.join(root, 'dist', match[1].split('?')[0])), match[1]);
for (const file of ['characters.png', 'buildings.png'])
  assert(fs.statSync(path.join(root, 'dist/assets', file)).size > 1000);
console.log(
  'PASS: 33-character roster, fruit, production, supply, placement, every family power, cooldowns, commander recovery, enemy court, combat, dialog pause, victory/defeat, static assets.'
);

module.exports = { run, tick };
