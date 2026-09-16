'use strict';
let attackReports=[], attackCursor=0, attackToneAt=-100;
function activeAttacks() {return attackReports.filter(a=>t-a.at<15).sort((a,b)=>b.at-a.at);}
function recordAttack(attacker,victim) {
  if(victim.team!==0 || attacker.team===0)return;
  attackReports=activeAttacks();
  let report=attackReports.find(a=>dist(a,victim)<200);
  const isBase=!defs[victim.type].speed;
  if(!report){report={x:victim.x,y:victim.y,at:t,priority:isBase?1:0,label:isBase?defs[victim.type].name:'Army',toneAt:-100};attackReports.push(report);}
  report.at=t;
  if(isBase||!report.priority){report.x=victim.x;report.y=victim.y;report.label=isBase?defs[victim.type].name:'Army';report.priority=isBase?1:0;}
  if(t-report.toneAt>=8 && t-attackToneAt>=3){report.toneAt=attackToneAt=t;attackSound();}
  attackReports=attackReports.sort((a,b)=>b.at-a.at).slice(0,5);
  updateAttackAlert();
}
function updateAttackAlert() {
  const reports=activeAttacks(), button=$('attack-alert');
  const hidden=!reports.length||ended||!running;
  if(button.hidden!==hidden)button.hidden=hidden;
  const label=reports.length>1?'Under attack · '+reports.length+' fronts · F3':reports.length?reports[0].label+' under attack · F3':'';
  if(button.textContent!==label)button.textContent=label;
}
function jumpToAttack() {
  if(!running||ended||$('court-dialog').open||$('groups-dialog').open||$('help-dialog').open)return;
  const reports=activeAttacks();if(!reports.length)return;
  const report=reports[attackCursor%reports.length];attackCursor=(attackCursor+1)%reports.length;
  cam.x=report.x;cam.y=report.y;
  say('Attack report: '+report.label+'. Selection and orders retained.');
}
$('attack-alert').onclick=jumpToAttack;
