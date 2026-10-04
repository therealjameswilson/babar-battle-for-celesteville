const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,['scripts/pwa-cache.cjs','--check'],{stdio:'inherit'});
const manifest=JSON.parse(fs.readFileSync('dist/app.webmanifest'));
assert.equal(manifest.display,'standalone');assert.equal(manifest.scope,'./');
for(const icon of manifest.icons){const b=fs.readFileSync('dist/'+icon.src);assert.equal(b.readUInt32BE(16),Number(icon.sizes.split('x')[0]));}
const html=fs.readFileSync('dist/index.html','utf8');
assert.match(html,/apple-touch-icon/);assert.match(html,/app\.webmanifest/);
(async()=>{
 const handlers={},deleted=[],requests=[],scope='https://example.org/babar/',prefix='babar-offline:'+scope+':';
 const cache={addAll:async list=>requests.push(...list),match:async(url,options)=>{
   assert.equal(options.ignoreSearch,true);return new URL(url).pathname==='/babar/index.html'?'offline launch':undefined;
 }};
 const context={URL,Request,fetch:async()=> 'network',self:{registration:{scope},addEventListener:(name,fn)=>handlers[name]=fn},
 caches:{open:async()=>cache,keys:async()=>[prefix+'old','another-app-cache'],delete:async key=>deleted.push(key)}};
 context.importScripts=()=>vm.runInContext(fs.readFileSync('dist/offline-files.js','utf8'),context);
 vm.createContext(context);vm.runInContext(fs.readFileSync('dist/sw.js','utf8'),context);
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 assert.ok(requests.length>80);assert.ok(requests.every(r=>r.url.startsWith(scope)&&r.cache==='reload'));
 handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,[prefix+'old']);
 let result;handlers.fetch({request:new Request(scope+'?source=homescreen'),respondWith:p=>result=p});assert.equal(await result,'offline launch');
 handlers.fetch({request:new Request(scope+'index.html?v=old'),respondWith:p=>result=p});assert.equal(await result,'offline launch');
 result=null;handlers.fetch({request:new Request('https://example.org/other/'),respondWith:p=>result=p});assert.equal(result,null);
 result=null;handlers.fetch({request:new Request(scope,{method:'POST'}),respondWith:p=>result=p});assert.equal(result,null);
 assert.doesNotMatch(fs.readFileSync('dist/sw.js','utf8'),/self\.skipWaiting\(|clients\.claim\(/);
 cache.addAll=async()=>{throw Error('storage full');};handlers.install({waitUntil:p=>pending=p});await assert.rejects(pending,/storage full/);
 console.log('PASS: app manifest, icon sizes, project-scope offline launch, safe updates, failed cache install');
})().catch(e=>{console.error(e);process.exitCode=1;});
