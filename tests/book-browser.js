(async()=>{
 const out=document.querySelector('#result'),f=document.createElement('iframe');
 const size=new URLSearchParams(location.search).get('size')||'desktop';
 [f.width,f.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
 const ready=new Promise(r=>f.onload=r);f.src='../dist/?book-qa=2';document.body.append(f);await ready;
 const g=f.contentWindow,d=g.document,run=s=>g.eval(s);let count=0;
 const check=(v,label)=>{if(!v)throw Error(label);count++;};
 try{
  d.querySelector('#opening-skip').click();d.querySelector('#start').click();
  await run('Promise.all([bookUnitSheet,bookBuildingSheet,bookCouncilSheet].map(img=>img.decode()))');
  check(run('bookUnitSheet.naturalWidth===1536&&bookBuildingSheet.naturalWidth===1536&&bookCouncilSheet.naturalWidth===1181'),'all new sheets decode');
  const old=run('JSON.stringify(alive(0).map(u=>[u.id,u.hp,u.x,u.y,u.order]))');
  run('draw()');check(run('JSON.stringify(alive(0).map(u=>[u.id,u.hp,u.x,u.y,u.order]))')===old,'rendering preserves simulation');
  d.querySelector('#court-open').click();
  check(d.querySelector('.member-portrait image').getAttribute('href').includes('assets/book/'),'new leader portraits used');
  check(run('characterArtMarkup("celeste").includes("1181")'),'council native dimensions retained');
  const courtClosed=new Promise(r=>d.querySelector('#court-dialog').addEventListener('close',r,{once:true}));
  d.querySelector('#court-close').click();await courtClosed;
  run('selected=alive(0).filter(u=>u.type==="trooper");updateUI(true)');
  d.querySelector('#phone-tabs [data-panel=actions]')?.click();
  const button=d.querySelector('#actions button'),style=g.getComputedStyle(button);
  check(style.backgroundColor==='rgb(228, 232, 205)'||style.backgroundColor==='rgb(238, 237, 220)','actions use light paper');
  check(style.color==='rgb(41, 62, 53)'||style.color==='rgb(102, 107, 87)','actions have dark ink');
  check(d.documentElement.scrollWidth<=Number(f.width),'no horizontal overflow');
  run('nextWave=enemySpawn=9999;');
  d.querySelector('#pause').click();check(!d.querySelector('#pause-panel').hidden,'pause usable');d.querySelector('#pause-resume').click();check(d.querySelector('#pause-panel').hidden,'resume usable');
  out.textContent=`PASS ${count} book-art browser checks (${size}).`;
 }catch(e){out.textContent='FAIL '+e.stack;}finally{run('running=false');}
})();
