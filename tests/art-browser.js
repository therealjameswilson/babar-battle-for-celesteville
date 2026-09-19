'use strict';
(async () => {
  const lines=[];let checks=0;
  const check=(yes,label)=>{if(!yes)throw Error(label);checks++;};
  const frame=async(path,width)=>{const f=document.createElement('iframe');f.width=width;f.src=path;const ready=new Promise((resolve,reject)=>{f.onload=()=>resolve(f);f.onerror=reject;});document.getElementById('frames').append(f);return ready;};
  try {
    const images=new Map();
    for(const a of Object.values(CHARACTER_ART))if(!images.has(a.sheet)) {
      const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error(a.sheet+' failed'));img.src='../dist/'+a.sheet;});
      check(img.naturalWidth===1536&&img.naturalHeight===1024,a.sheet+' decode');images.set(a.sheet,img);
    }
    for(const [id,a] of Object.entries(CHARACTER_ART)) {
      const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;
      const c=canvas.getContext('2d');c.drawImage(images.get(a.sheet),...a.frame,0,0,160,160);
      const pixels=c.getImageData(0,0,160,160).data;
      check(pixels.some((v,i)=>i%4===3&&v>100),id+' visible decoded pixels');
      check(pixels.some((v,i)=>i%4===3&&v===0),id+' real transparent pixels');
    }
    lines.push('PASS: 6 image decodes and all 33 sprite canvas draws with real alpha.');
    for(const width of [390,844,1280]) {
      const f=await frame('../dist/characters.html',width),w=f.contentWindow,d=f.contentDocument;
      check(d.querySelectorAll('.sprite svg').length===33,'33 full-body SVGs');
      check(d.querySelectorAll('.portrait svg').length===33,'33 portraits');
      check(d.documentElement.scrollWidth<=width,'gallery width '+width);
      const search=d.getElementById('search');search.value='Cornelius';search.dispatchEvent(new Event('input'));
      check(d.querySelectorAll('article:not([hidden])').length===1,'search exact');
      search.value='not-a-character';search.dispatchEvent(new Event('input'));check(d.querySelectorAll('article:not([hidden])').length===0,'empty search');
      search.value='';search.dispatchEvent(new Event('input'));check(d.querySelectorAll('article:not([hidden])').length===33,'clear search');
      lines.push('PASS: gallery '+width+'px, portraits, sprites, search, no horizontal overflow.');
      const game=await frame('../dist/index.html',width),g=game.contentWindow,gd=game.contentDocument;
      g.openCourt();
      for(const team of [0,1,'books']) {
        g.eval('courtTeam='+JSON.stringify(team)+';renderCourt()');
        const cards=[...gd.querySelectorAll('.court-card')];
        check(cards.length>0,'council tab');check(cards.every(c=>c.querySelector('.member-portrait svg')),'council portrait per card');
        check(gd.getElementById('court-dialog').scrollWidth<=gd.getElementById('court-dialog').clientWidth+2,'council overflow '+width);
      }
      lines.push('PASS: three council tabs with portraits at '+width+'px.');
    }
    document.getElementById('results').textContent=lines.join('\n')+'\nPASS '+checks+' browser art checks';
  }catch(e){document.getElementById('results').textContent=lines.join('\n')+'\nFAIL '+e.stack;}
})();
