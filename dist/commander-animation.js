'use strict';
// Inspected per-frame crops and foot anchors; generated cells are not uniform.
const COMMANDER_FRAMES = [
  [
    [{"crop":[87,19,192,292],"anchor":[171,307]},{"crop":[380,30,181,279],"anchor":[470,305]},{"crop":[663,18,186,293],"anchor":[763,307]},{"crop":[1005,29,179,282],"anchor":[1094,307]}],
    [{"crop":[62,320,217,296],"anchor":[174,612]},{"crop":[389,328,173,287],"anchor":[470,611]},{"crop":[650,320,217,297],"anchor":[766,613]},{"crop":[998,328,194,288],"anchor":[1094,612]}],
    [{"crop":[64,627,214,295],"anchor":[172,918]},{"crop":[381,638,170,284],"anchor":[470,918]},{"crop":[665,628,220,294],"anchor":[770,918]},{"crop":[1013,638,176,283],"anchor":[1094,917]}],
    [{"crop":[66,931,245,295],"anchor":[164,1222]},{"crop":[390,943,158,282],"anchor":[470,1221]},{"crop":[619,934,251,290],"anchor":[774,1220]},{"crop":[1009,944,177,279],"anchor":[1094,1219]}]
  ],
  [
    [{"crop":[78,6,178,307],"anchor":[169,309]},{"crop":[365,4,197,310],"anchor":[466,310]},{"crop":[709,7,170,306],"anchor":[794,309]},{"crop":[994,7,190,305],"anchor":[1092,308]}],
    [{"crop":[59,320,223,302],"anchor":[172,618]},{"crop":[361,318,205,309],"anchor":[463,623]},{"crop":[686,318,214,302],"anchor":[798,616]},{"crop":[993,321,200,304],"anchor":[1093,621]}],
    [{"crop":[67,633,222,301],"anchor":[174,930]},{"crop":[373,631,197,307],"anchor":[470,934]},{"crop":[681,634,223,301],"anchor":[792,931]},{"crop":[995,632,199,302],"anchor":[1094,930]}],
    [{"crop":[34,947,309,294],"anchor":[158,1237]},{"crop":[394,943,192,301],"anchor":[477,1240]},{"crop":[622,948,310,295],"anchor":[800,1239]},{"crop":[988,943,214,292],"anchor":[1090,1231]}]
  ]
];
const COMMANDER_MUZZLES = [
  [[302,1044],[425,1048],[630,1045],[1171,1012]],
  [[335,1020],[444,1017],[630,1020],[1144,1006]],
];
const commanderSheets = ['babar','rataxes'].map(name => {
  const sheet = new Image(); sheet.src = 'assets/commanders/' + name + '.png'; return sheet;
});
function commanderPose(u, now, minimizeMotion = false) {
  const age = now - (u.firedAt ?? -Infinity);
  const firing = age >= 0 && age < .24;
  const angle = firing ? (u.firedAngle ?? u.angle) : u.angle;
  const direction = ((Math.floor((angle + Math.PI / 4) / (Math.PI / 2)) % 4) + 4) % 4;
  const row = firing ? 3 : !minimizeMotion && u.movingUntil > now ? 1 + Math.floor((u.walkDistance || 0) / 16) % 2 : 0;
  return { direction, row, flash: firing && age < .09 && !minimizeMotion };
}
function drawCommanderSprite(context, u, now, minimizeMotion = false) {
  if (u.type !== 'hero') return false;
  const sheet = commanderSheets[u.team];
  if (!sheet || !sheet.complete || !sheet.naturalWidth) return false;
  const pose = commanderPose(u, now, minimizeMotion);
  const {crop, anchor} = COMMANDER_FRAMES[u.team][pose.row][pose.direction];
  const [x,y,w,h] = crop, scale = 80 / 300;
  if(typeof crispSprite==='function')crispSprite(context,sheet,x,y,w,h,(x-anchor[0])*scale,15+(y-anchor[1])*scale,w*scale,h*scale);
  else context.drawImage(sheet,x,y,w,h,(x-anchor[0])*scale,15+(y-anchor[1])*scale,w*scale,h*scale);
  if (pose.flash) {
    const muzzle = COMMANDER_MUZZLES[u.team][pose.direction];
    context.fillStyle = '#ead195';context.beginPath();
    context.arc((muzzle[0]-anchor[0])*scale,15+(muzzle[1]-anchor[1])*scale,3,0,Math.PI*2);context.fill();
  }
  return true;
}
