'use strict';
(async()=>{
 const size=new URLSearchParams(location.search).get('size')||'desktop';
 const [width,height]=size==='phone'?[390,844]:size==='landscape'?[844,390]:[1280,800];
 let count=0;const check=(yes,label)=>{if(!yes)throw Error(label);count++};
 const mount=(path)=>new Promise((resolve,reject)=>{const f=document.createElement('iframe');f.width=width;f.height=height;f.onload=()=>resolve(f);f.onerror=reject;f.src=path;document.querySelector('#frames').append(f)});
 try{
  const f=await mount('../dist/characters.html?roster-qa=1'),g=f.contentWindow,d=f.contentDocument;
  const roster=g.eval('COURT.map(m=>({id:m.id,name:m.name,art:characterArtFor(m.id)}))');
  const images=new Map();
  for(const {art:a} of roster)if(!images.has(a.sheet)){
   const image=new Image();image.src='../dist/'+a.sheet;
   await new Promise((resolve,reject)=>{let n=0;const poll=setInterval(()=>{if(image.complete&&image.naturalWidth){clearInterval(poll);resolve()}else if(++n>150){clearInterval(poll);reject(Error(a.sheet+' did not load'))}},100)});
   check(image.naturalWidth===a.width&&image.naturalHeight===a.height,a.sheet+' decoded dimensions');images.set(a.sheet,image);
  }
  for(const {id,art:a} of roster){
   const card=d.querySelector('[data-character="'+id+'"]');check(!!card,id+' card');
   for(const [selector,crop] of [['.portrait',a.portrait],['.sprite',a.frame]]){
    const svg=card.querySelector(selector+' svg');check(svg.getAttribute('viewBox')===crop.join(' '),id+' actual '+selector+' crop');
    check(svg.querySelector('image').getAttribute('href')===a.sheet,id+' actual '+selector+' sheet');
   }
   check(card.querySelector('a[download]').getAttribute('href')===a.sheet,id+' matching download');
  }
  check(d.documentElement.scrollWidth<=width,'gallery no horizontal overflow');
  for(const [query,expected] of [['Cornelius',1],['not-a-character',0],['',33]]){
   d.querySelector('#search').value=query;d.querySelector('#search').dispatchEvent(new g.Event('input'));
   check(d.querySelectorAll('article:not([hidden])').length===expected,'search '+query);
  }
  for(const [name,field,cellW,cellH] of [['portraits','portrait',150,155],['figures','frame',180,265]]){
   const board=document.createElement('canvas');board.width=6*cellW;board.height=Math.ceil(roster.length/6)*cellH;const c=board.getContext('2d');
   c.fillStyle='#f3e8cd';c.fillRect(0,0,board.width,board.height);
   roster.forEach(({name:label,art:a},i)=>{
    const [sx,sy,sw,sh]=a[field],x=(i%6)*cellW,y=Math.floor(i/6)*cellH;
    const scale=Math.min((cellW-18)/sw,(cellH-35)/sh),dw=sw*scale,dh=sh*scale;
    c.drawImage(images.get(a.sheet),sx,sy,sw,sh,x+(cellW-dw)/2,y+6,dw,dh);
    c.font='12px Georgia';c.fillStyle='#293629';c.fillText(label,x+6,y+cellH-10,cellW-12);
   });
   document.getElementById(name).src=board.toDataURL('image/png');
  }
  const game=await mount('../dist/?roster-qa=1'),w=game.contentWindow,gd=game.contentDocument;
  w.openCourt();
  for(const team of [0,1,'books']){
   w.eval('courtTeam='+JSON.stringify(team)+';renderCourt()');
   const cards=[...gd.querySelectorAll('.court-card')];check(cards.length>0,'council tab '+team);
   for(const card of cards){
    const image=card.querySelector('.member-portrait image');check(image&&image.getAttribute('href').startsWith('assets/book/'),'council book art');
   }
   check(gd.querySelector('#court-dialog').scrollWidth<=gd.querySelector('#court-dialog').clientWidth+2,'council no overflow');
  }
  document.querySelector('#results').textContent='PASS '+count+' roster checks ('+size+'): all 33 portraits, figures and downloads; six sheet decodes; search; all council tabs and responsive bounds. Contact boards are Canvas exports, not page screenshots.';
 }catch(e){document.querySelector('#results').textContent='FAIL '+e.stack;}
})();
