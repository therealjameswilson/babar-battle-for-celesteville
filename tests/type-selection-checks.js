function typeSelectionChecks(check) {
  easy=true;reset();running=true;paused=false;nextWave=enemySpawn=9999;
  units=[];cam={x:900,y:630,zoom:1};
  const left=add('trooper',0,870,630),right=add('trooper',0,930,630);
  const other=add('scout',0,900,650),enemy=add('trooper',1,900,620);
  const dead=add('trooper',0,900,660,{hp:0});
  const outside=add('trooper',0,900+canvas.clientWidth,630);
  issueOrder(left,{kind:'hold'});const oldOrder=left.order,oldTime=t,oldCamera=JSON.stringify(cam);
  selected=[other];check(selectOnscreenType(left),'Matching-type command accepts a friendly unit');
  check(selected.length===2&&selected.includes(left)&&selected.includes(right),'Selects matching on-screen units only');
  check(!selected.includes(enemy)&&!selected.includes(dead)&&!selected.includes(outside),'Excludes enemy, dead and off-screen units');
  check(left.order===oldOrder&&t===oldTime&&JSON.stringify(cam)===oldCamera,'Selection changes neither orders, time nor camera');
  selected=[other,left];selectOnscreenType(right,true);
  check(selected.length===3&&selected.includes(other),'Append preserves other types without duplicating units');
  clickSelection(left,true);check(!selected.includes(left)&&selected.includes(right),'Shift-click removes just the clicked unit');
  clickSelection(left,true);check(selected.includes(left)&&selected.length===3,'Shift-click adds an absent unit once');
  clickSelection(other);check(selected.length===1&&selected[0]===other,'Ordinary click replaces selection');
  const before=selected.slice();paused=true;
  check(!selectOnscreenType(left)&&selected[0]===before[0],'Paused matching-type command cannot change selection');paused=false;
  $('help-dialog').showModal();check(!selectOnscreenType(left),'Modal blocks matching-type command');$('help-dialog').close();
  check(!selectOnscreenType(enemy)&&!selectOnscreenType(dead),'Invalid anchor units cannot select an army');
  units=[];const a=add('forge',0,870,630),b=add('forge',0,930,630);add('factory',0,900,680);
  selectOnscreenType(a);check(selected.length===2&&selected.includes(b),'Matching production buildings can be selected together');
  cam.x=0;selected=[other];check(!selectOnscreenType(a)&&selected[0]===other,'No on-screen matches preserves the previous selection');
}
