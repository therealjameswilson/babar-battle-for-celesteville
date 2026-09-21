function heroCombatChecks(check){
 function fresh(){reset();running=true;paused=false;units=units.filter(u=>u.type==='core');const hero=add('hero',0,500,1000,{name:'King Babar'}),enemy=add('trooper',1,560,1000,{hp:300,max:300});selected=[hero];sightAt=-1;return {hero,enemy};}
 let {hero,enemy}=fresh();check(royalStrike(hero),'strike activates');check(enemy.hp===240,'60 base damage');check(hero.commandEnergy===25,'energy charged');check(!royalStrike(hero)&&enemy.hp===240,'cannot spam');
 ({hero,enemy}=fresh());hero.commandEnergy=34;check(!royalStrike(hero)&&hero.commandEnergy===34,'energy guard');
 ({hero,enemy}=fresh());enemy.x=1000;sightAt=-1;check(!royalStrike(hero)&&hero.commandEnergy===60,'range/fog costs nothing');
 ({hero,enemy}=fresh());hero.holdFire=true;check(royalStrike(hero)&&hero.holdFire,'explicit strike preserves silent stance');check(heroFight(hero)&&!hero.holdFire&&mode==='attack','Fight arms attack command');
 ({hero,enemy}=fresh());hero.order={kind:'retreat',x:200,y:1000};check(!royalStrike(hero),'retreat guard');
 ({hero,enemy}=fresh());paused=true;check(!royalStrike(hero)&&!heroFight(hero),'pause guard');paused=false;ended=true;check(!royalStrike(hero),'end guard');
 ({hero,enemy}=fresh());hero.hp=0;check(!royalStrike(hero),'fallen hero guard');
 ({hero,enemy}=fresh());const other=add('trooper',1,575,1000,{hp:300,max:300});hero.order={kind:'attack',target:other};royalStrike(hero);check(other.hp===240&&enemy.hp===300,'focused target preferred');
 ({hero,enemy}=fresh());enemy.x=covers[0].x;enemy.y=covers[0].y;hero.x=enemy.x-40;hero.y=enemy.y;sightAt=-1;royalStrike(hero);check(Math.abs(enemy.hp-261)<.001,'cover reduces strike');
 ({hero,enemy}=fresh());check(shoot(hero,enemy)&&enemy.hp===276,'Babar basic attack');check(shoot(add('hero',1,550,1000),hero),'Rataxes basic attack');
 ({hero,enemy}=fresh());ore=500;const splash=add('trooper',1,580,1000,{hp:300,max:300});
 check(madameAttack(),'Madame attack activates');check(enemy.hp===140&&splash.hp===230,'vicious primary and splash');check(ore===410&&enemy.morale<=58,'supplies and suppression');check(!madameAttack(),'Madame cooldown');
 ({hero,enemy}=fresh());ore=500;enemy.x=900;sightAt=-1;check(!madameAttack()&&ore===500,'Madame range failure free');
 ({hero,enemy}=fresh());ore=89;check(!madameAttack(),'Madame supply guard');ore=500;paused=true;check(!madameAttack(),'Madame pause guard');paused=false;ended=true;check(!madameAttack(),'Madame end guard');
 ({hero,enemy}=fresh());ore=500;benefits.add('madame');check(madameAttack()&&benefits.has('madame'),'welcome and attack independent');
}
