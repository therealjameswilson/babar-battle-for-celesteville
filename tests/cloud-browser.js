(async()=>{let count=0;const check=(v,s)=>{if(!v)throw Error(s);count++;},lines=[];
try{for(const [w,h] of [[390,844],[844,390],[1280,900]]){
const f=document.createElement('iframe');f.width=w;f.height=h;const loaded=new Promise(r=>f.onload=r);f.src='../dist/index.html?clouds=493';document.querySelector('#games').append(f);await loaded;
const g=f.contentWindow,d=f.contentDocument;d.querySelector('#opening-skip').click();await g.eval('mushroomCloudSheet.decode()');
for(const kind of ['atomic','hydrogen']){
 const effect=g.mushroomCloudEffect({kind,x:230,y:435});check(effect.life===(kind==='atomic'?8:12),'type lifetime');effect.life-=4;
 const pose=g.mushroomCloudPose(effect,true);check(pose.growth===1,'reduced motion stable growth');
 const c=document.createElement('canvas');c.width=460;c.height=500;const context=c.getContext('2d');g.drawMushroomCloud(context,effect,false);
 const pixels=context.getImageData(0,0,460,500).data;let opaque=0,edge=0;for(let y=0;y<500;y++)for(let x=0;x<460;x++){const a=pixels[(y*460+x)*4+3];if(a>32){opaque++;if(x===0||y===0||x===459||y===499)edge++;}}
 check(opaque>5000,'cloud painted');check(edge===0,'cloud not clipped');check(context.globalAlpha===1,'renderer restores alpha');
 if(w===390){const card=document.createElement('div');card.textContent=kind==='atomic'?'ATOMIC · compact dusty cap':'H-BOMB · broader, taller cloud';card.append(c);document.querySelector('#samples').append(card);}
}
check(g.eval('CLOUD_PROFILES.hydrogen.width>CLOUD_PROFILES.atomic.width'),'distinct scale');
g.eval("reset();running=true;paused=false;units=units.filter(u=>u.type==='core');this.site=add('factory',0,900,1000);linked.add(site.id);site.atomicReady=true;site.atomicKind='hydrogen';launchAtomic(site,{x:950,y:1000});t=28;updateAtomic(0);paused=true;draw()");
check(g.eval("fx.filter(f=>f.nuclearCloud).length===1&&fx.find(f=>f.nuclearCloud).kind==='hydrogen'"),'impact selects H cloud');
check(d.documentElement.scrollWidth<=w,'viewport no overflow');lines.push('PASS '+w+'×'+h);f.remove();
}document.querySelector('#result').textContent=lines.join('\n')+'\nPASS '+count+' checks';}catch(e){document.querySelector('#result').textContent='FAIL '+e.stack;}})();
