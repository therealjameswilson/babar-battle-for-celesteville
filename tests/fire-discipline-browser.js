'use strict';
(async()=>{
 const lines=[];let count=0;const check=(v,label)=>{if(!v)throw Error(label);count++;};
 try {
  const checks=await fetch('fire-discipline-checks.js').then(r=>r.text());
  for(const [width,height] of [[390,844],[844,390],[1280,900]]) {
   const f=document.createElement('iframe');f.width=width;f.height=height;
   const ready=new Promise(r=>f.onload=r);f.src='../dist/index.html?v=0.39.0-discipline2';document.getElementById('games').append(f);await ready;
   const g=f.contentWindow,d=f.contentDocument;g.eval(checks);g.fireDisciplineChecks(check);
   g.eval("reset();running=true;paused=false;selected=[alive(0).find(u=>u.type==='scout')||add('scout',0,500,1000)];updateUI(true)");
   d.querySelector('#phone-tabs [data-panel=actions]')?.click();
   const button=name=>[...d.querySelectorAll('#actions button')].find(b=>b.querySelector('span')?.textContent===name);
   check(!!button('Hold fire'),'Touch action present');button('Hold fire').click();
   check(g.eval('selected[0].holdFire'),'Touch action enables stance');
   check(d.getElementById('tactical-status').textContent.includes('HOLD FIRE 1/1'),'Selected status explains silence');
   check(!!button('Weapons free'),'Action becomes weapons free');button('Weapons free').click();
   check(g.eval('!selected[0].holdFire'),'Touch releases stance');
   g.dispatchEvent(new g.KeyboardEvent('keydown',{key:'c',bubbles:true}));
   check(g.eval('selected[0].holdFire'),'C enables stance');
   g.dispatchEvent(new g.KeyboardEvent('keydown',{key:'c',ctrlKey:true,bubbles:true}));
   check(g.eval('selected[0].holdFire'),'Ctrl+C does not toggle');
   const input=d.getElementById('court-search');input.dispatchEvent(new g.KeyboardEvent('keydown',{key:'c',bubbles:true}));
   check(g.eval('selected[0].holdFire'),'Typing C in search does not toggle');
   g.dispatchEvent(new g.KeyboardEvent('keydown',{key:'c',bubbles:true}));
   check(g.eval('!selected[0].holdFire'),'C releases stance');
   check(d.documentElement.scrollWidth<=width,'No horizontal overflow');
   const rect=button('Hold fire').getBoundingClientRect();check(rect.width>0&&rect.left>=0&&rect.right<=width+1,'Action fits viewport '+JSON.stringify({width,left:rect.left,right:rect.right,buttonWidth:rect.width,cls:button('Hold fire').className,parentWidth:button('Hold fire').parentElement.getBoundingClientRect().width,grid:g.getComputedStyle(button('Hold fire').parentElement).gridTemplateColumns,style:d.querySelector('link[rel=stylesheet]').href,lastRule:d.styleSheets[0].cssRules[d.styleSheets[0].cssRules.length-1].cssText}));
   g.eval('draw()');lines.push('PASS '+width+'×'+height+': shared rules, touch buttons, C, copy/search guards, status, layout and battlefield draw.');
  }
  document.getElementById('result').textContent=lines.join('\n')+'\nPASS '+count+' browser checks';
 }catch(e){document.getElementById('result').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
