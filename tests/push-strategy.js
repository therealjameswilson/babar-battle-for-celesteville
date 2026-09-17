// Same paid economic opening for both policies; change only front-line commands.
let pushCommitSize=18;
let pushCommitted=false,pushStage=0,pushCommitAt=null,pushStages=[],pushDeploySeconds=0,pushScouted=false;
const PUSH_LINE=[{x:510,y:850},{x:710,y:850},{x:930,y:830},{x:1130,y:700},{x:1290,y:520},{x:1370,y:440}];
function pushSetup(size=18){pushCommitSize=size;easy=false;reset();running=true;pushCommitted=false;pushStage=0;pushCommitAt=null;pushStages=[];pushDeploySeconds=0;pushScouted=false;}
function pushStep(policy,reserveSupplies=0,detachedIds=[]){
 defenseStep(detachedIds,false,false,reserveSupplies,false);
 const own=alive(0),guns=own.filter(u=>u.type==='walker'),army=own.filter(u=>!detachedIds.includes(u.id)&&defs[u.type].speed&&defs[u.type].damage&&u.order?.kind!=='retreat');
 if(!pushCommitted&&t>=120&&army.length>=pushCommitSize&&guns.length>=3){pushCommitted=true;pushCommitAt??=Math.round(t);pushStage=1;pushStages.push({at:Math.round(t),stage:1});}
 if(pushCommitted&&(army.length<8||guns.length<2)){pushCommitted=false;pushStage=0;}
 if(Math.floor(t)%3!==0)return;
 const visibleEnemies=alive(1).filter(u=>sees(0,u));
 const hero=army.find(u=>u.type==='hero');if(hero&&visibleEnemies.some(e=>dist(e,hero)<260))commanderAbility(hero);
 for(const u of army.filter(u=>u.hp<u.max*.4))orderRetreat(u);
 const ready=army.filter(u=>u.order?.kind!=='retreat');
 if(pushCommitted&&policy==='march'){
  selected=ready;mode='attack';command(depot.team===0?{x:1400,y:360}:{x:950,y:830});return;
 }
 const position=PUSH_LINE[pushStage],next=PUSH_LINE[Math.min(pushStage+1,PUSH_LINE.length-1)];
 const distance=Math.max(1,dist(position,next)),dx=(next.x-position.x)/distance,dy=(next.y-position.y)/distance;
 const infantry=ready.filter(u=>u.type!=='walker'&&u.type!=='scout');
 selected=infantry;mode='attack';command({x:position.x+dx*70,y:position.y+dy*70});
 for(const scout of ready.filter(u=>u.type==='scout')){
  const danger=visibleEnemies.some(e=>defs[e.type].damage&&dist(e,scout)<weaponRange(e)+e.r+65);
  selected=[scout];mode='move';command({x:position.x+dx*(danger?20:170),y:position.y+dy*(danger?20:170)});
  pushScouted ||= visibleEnemies.some(e=>dist(e,scout)<vision(scout));
 }
 let firing=false,arrived=0;
 for(const gun of ready.filter(u=>u.type==='walker')){
  const targets=visibleEnemies.filter(e=>dist(e,gun)>=SIEGE.minimum&&dist(e,gun)<=SIEGE.range+e.r);
  const close=visibleEnemies.some(e=>defs[e.type].damage&&dist(e,gun)<140);
  const spot={x:position.x-dx*65+(gun.id%3-1)*36,y:position.y-dy*65+(gun.id%2)*34};
  if(dist(gun,spot)<110)arrived++;
  if(targets.length&&!close){firing=true;if(!gun.deployed&&!gun.artilleryTransition){selected=[gun];toggleArtillery();}}
  else if(dist(gun,spot)>35){selected=[gun];mode='move';command(spot);}
  else if(!gun.deployed&&!gun.artilleryTransition){selected=[gun];toggleArtillery();}
 }
 if(pushCommitted&&!firing&&pushStage<PUSH_LINE.length-1&&arrived>=Math.max(2,Math.ceil(guns.length*.6))&&infantry.filter(u=>dist(u,position)<200).length>=Math.max(3,infantry.length*.5)){
  pushStage++;pushStages.push({at:Math.round(t),stage:pushStage});
 }
}
function pushObserve(dt){pushDeploySeconds+=alive(0).filter(u=>u.type==='walker'&&u.deployed).length*dt;}
function pushResult(){return {commitSize:pushCommitSize,seconds:Math.round(t),ended,win:ended&&alive(0).some(u=>u.type==='core'),palace:Math.round(alive(0).find(u=>u.type==='core')?.hp||0),supplies:Math.round(ore),materials:Math.round(materials),army:supply(),kills,commitAt:pushCommitAt,stages:pushStages,deployedGunSeconds:Math.round(pushDeploySeconds),scouted:pushScouted};}
