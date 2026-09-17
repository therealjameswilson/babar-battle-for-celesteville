function batteryChecks(check){
 easy=false;reset();running=true;nextWave=enemySpawn=9999;units=units.filter(u=>u.type==='core');rebuildNav();
 const gun=add('walker',0,650,750),enemy=add('trooper',1,950,750);sightAt=-1;
 check(batteryReport([gun]).mobile===1,'Mobile gun is distinguished from a deployed battery');
 gun.deployed=true;gun.order={kind:'hold'};
 check(batteryReport([gun]).unspotted===1,'A hidden enemy cannot appear as a battery target');
 const scout=add('scout',0,820,750);sightAt=-1;
 check(batteryReport([gun]).ready===1,'Forward observation makes an in-range target report ready');
 gun.cool=1;check(batteryReport([gun]).reloading===1,'Battery readiness reflects the actual weapon cooldown');
 const ally=add('trooper',0,910,770);sightAt=-1;
 check(batteryReport([gun]).splash===1&&batterySummary([gun]).includes('FRIENDLY FIRE RISK'),'Allies near a likely shell impact produce a friendly-fire warning');
 const snapshot=JSON.stringify({cool:gun.cool,hp:enemy.hp,order:gun.order,ally:ally.hp});batteryReport([gun]);
 check(snapshot===JSON.stringify({cool:gun.cool,hp:enemy.hp,order:gun.order,ally:ally.hp}),'Battery reports do not fire, change orders or mutate health');
 ally.hp=0;enemy.x=700;sightAt=-1;
 check(batteryReport([gun]).close===1&&batteryReport([gun]).unspotted===1,'Visible enemies inside the blind spot warn without becoming valid shell targets');
 enemy.hp=0;sightAt=-1;check(batteryReport([gun]).close===0,'Dead threats do not remain in the live report');
 setArtilleryMode(gun,false);check(batteryReport([gun]).transitioning===1,'Packing guns report their mode transition');
 const second=add('walker',0,620,780);selected=[gun,second];updateUI(true);
 check($('selected-name').textContent==='Artillery battery'&&$('selected-info').textContent.includes('changing mode'),'Selected gun groups expose their combined battery state');
 gun.artilleryTransition=null;gun.deployed=true;selected=[gun];updateUI(true);
 check($('selected-info').textContent.includes('no visible target in range')&&$('tactical-status').textContent.includes('90–390m'),'Single-gun status retains actionable siege guidance rather than generic role text');
 scout.hp=0;second.hp=0;enemy.hp=10;enemy.x=950;sightAt=-1;
 check(batteryReport([gun]).unspotted===1&&batteryReport([gun]).ready===0,'Losing the observer removes hidden targets from the report');
}
