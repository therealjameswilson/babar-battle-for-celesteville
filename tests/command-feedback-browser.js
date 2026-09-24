(async()=>{
 const out=document.querySelector('#result'),f=document.createElement('iframe');
 const size=new URLSearchParams(location.search).get('size')||'desktop';
 [f.width,f.height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
 const ready=new Promise(r=>f.onload=r);f.src='../dist/?command-qa=1';document.body.append(f);await ready;
 const g=f.contentWindow,d=g.document,run=s=>g.eval(s);let count=0;
 const check=(v,label)=>{if(!v)throw Error(label);count++;};
 try{
  d.querySelector('#opening-skip').click();d.querySelector('#start').click();
  run(await(await fetch('command-feedback-checks.js')).text());g.commandFeedbackChecks(check);
  run('munitions=100;selected=alive(0).filter(u=>u.type==="trooper");updateUI(true)');
  d.querySelector('#phone-tabs [data-panel=actions]')?.click();
  const heavy=[...d.querySelectorAll('#actions button')].find(b=>b.textContent.includes('Heavy rounds'));
  check(heavy&&heavy.disabled&&heavy.textContent.includes('Select 12 or fewer'),'rendered disabled ability explains limit');
  const aside=d.querySelector('aside'),map=d.querySelector('#minimap');
  if(size==='desktop'){
   for(const scroll of [0,100,250]){aside.scrollTop=scroll;const m=map.getBoundingClientRect(),s=d.querySelector('.selection').getBoundingClientRect();check(m.bottom<=s.top,'map does not overlap selection at scroll '+scroll);}
  }else check(map.parentElement.classList.contains('field'),'mobile map remains on battlefield');
  check(d.documentElement.scrollWidth<=Number(f.width),'no horizontal overflow');
  out.textContent=`PASS ${count} command-feedback browser checks (${size}).`;
 }catch(e){out.textContent='FAIL '+e.stack;}finally{run('running=false');}
})();
