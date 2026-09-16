// Earned-resource defensive opening. Uses only player orders and visible threats.
let defenseCommitted=false;
function defenseStep() {
  if(t<1)defenseCommitted=false;
  if(ended)return;
  const base=alive(0).find(u=>u.type==='core');if(!base)return;
  const own=alive(0),workers=own.filter(u=>u.type==='worker');
  function construct(type,p) {if(ore>=buildingCost(type)&&materials>=materialCost(type)&&validBuild(p,type)){selected=[base];build(type);command(p);}}
  if(t>150&&!own.some(u=>u.type==='turret')){for(const p of [{x:550,y:730},{x:540,y:960},{x:580,y:920}])if(validBuild(p,'turret')){construct('turret',p);break;}}
  const quarry=own.find(u=>u.type==='quarry'),metal=nodes.find(n=>n.kind==='materials'&&n.x===275);
  if(!quarry)construct('quarry',metal);
  if(workers.length+base.queue.length<11 && ore>=50){selected=[base];train('worker');}
  if(quarry&&!quarry.construction){
    let miners=workers.filter(w=>w.order?.node===metal).length;
    for(const w of workers.filter(w=>!w.carrying&&w.order?.kind==='gather'&&w.order.node!==metal)){
      if(miners>=2)break;issueOrder(w,{kind:'gather',node:metal});miners++;
    }
  }
  const factory=own.find(u=>u.type==='factory');
  if(!factory)construct('factory',{x:480,y:1080});
  if(supply()>cap()-5 && cap()<70){for(const p of [{x:570,y:1070},{x:620,y:970},{x:625,y:1130},{x:675,y:1060},{x:680,y:920},{x:540,y:1170}])if(validBuild(p,'relay')){construct('relay',p);break;}}
  const school=own.find(u=>u.type==='forge');
  if(school&&!school.construction&&!own.some(u=>u.type==='scout')&&!school.queue.includes('scout')&&ore>=55){selected=[school];train('scout');}
  const guns=own.filter(u=>u.type==='walker');
  const infantry=own.filter(u=>u.type==='trooper');
  if(factory&&!factory.construction&&factory.queue.length<2&&guns.length<10){selected=[factory];train('walker');}
  if(school&&!school.construction&&school.queue.length<2&&infantry.length<24&&ore>(!factory&&materials>=50?300:factory&&!factory.construction&&guns.length<3?220:60)){selected=[school];train('trooper');}
  if(!benefits.has('celeste')&&ore>200)usePower('celeste');
  if(!benefits.has('pompadour')&&ore>250)usePower('pompadour');
  const hero=own.find(u=>u.type==='hero');
  const threats=alive(1).filter(u=>sees(0,u)&&defs[u.type].damage&&dist(u,base)<650);
  if(hero&&threats.length)commanderAbility(hero);
  const army=own.filter(u=>defs[u.type].damage&&defs[u.type].speed&&u.order?.kind!=='retreat');
  if(army.length>=28&&guns.length>=5)defenseCommitted=true;
  if(army.length<12||guns.length<2)defenseCommitted=false;
  const advance=defenseCommitted;
  if(Math.floor(t)%5===0){
    if(advance){selected=army;mode='attack';command(depot.team===0?{x:1400,y:360}:{x:950,y:830});}
    else {
      const defenders=army.filter(u=>u.type!=='walker');
      selected=defenders;mode='attack';command({x:510,y:850});
      for(const gun of guns){
        if(dist(gun,{x:480,y:860})>100&&!gun.deployed){selected=[gun];mode='move';command({x:480+(gun.id%3)*35,y:870+(gun.id%2)*40});}
        else if(!gun.deployed&&!gun.artilleryTransition){selected=[gun];toggleArtillery();}
      }
    }
    const damaged=own.find(u=>!defs[u.type].speed&&!u.construction&&u.hp<u.max*.7);
    if(damaged && !workers.some(w=>w.order?.kind==='repair')){
      const repairer=workers.find(w=>!w.carrying&&w.order?.kind==='gather');
      if(repairer){selected=[repairer];setMode('repair');command(damaged);}
    }
  }
}
