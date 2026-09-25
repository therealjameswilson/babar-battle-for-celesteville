'use strict';
// Rendering only: the central stock node and the capture rules stay in the engine.
const depotSheet = new Image();
depotSheet.src = 'assets/book/depot.png';
const DEPOT_CROP = [116, 290, 1056, 718];
function isDepotStock(n) {
  return (n.kind || 'supplies') === 'supplies' &&
    Math.abs(n.x - depot.x) <= 35 && Math.abs(n.y - depot.y) <= 30;
}
function depotCard(d, income) {
  const owner = d.team === 0 ? 'ELEPHANT DEPOT' : d.team === 1 ? 'RHINO DEPOT' : 'CENTRAL DEPOT';
  const benefit = d.team === 0 ? (income ? '+2 S/s · +0.5 MU/s' : '+2 S/s · MU stopped') :
    d.team === 1 ? '+2 S/s to Rhino command' : 'Hold combat troops for 8s';
  // Progress can persist while empty or contested. Never present it as a countdown.
  const progress = Math.min(1, Math.abs(d.progress) / 8);
  return {x:d.x - 224, y:d.y - 18, width:164, height:44, owner, benefit, progress,
    captureTeam:d.progress > 0 ? 0 : 1};
}
function drawDepotYard(c) {
  c.save();
  const color = depot.team === 0 ? '#386d59' : depot.team === 1 ? '#a94b3d' : '#82724e';
  c.strokeStyle = color + '70'; c.lineWidth = 1; c.setLineDash([4, 6]);
  c.beginPath(); c.arc(depot.x, depot.y, 90, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
  if (depotSheet.complete && depotSheet.naturalWidth) {
    crispSprite(c, depotSheet, ...DEPOT_CROP, depot.x - 56, depot.y - 57, 112, 76);
  } else {
    // An open awning is still readable while the local image loads.
    c.fillStyle = '#ede1b9'; c.fillRect(depot.x - 46, depot.y - 47, 92, 24);
    c.strokeStyle = '#655740'; c.strokeRect(depot.x - 46, depot.y - 47, 92, 24);
    c.fillStyle = '#99794e';
    for (const x of [-43, 40]) c.fillRect(depot.x + x, depot.y - 23, 3, 39);
    c.fillRect(depot.x + 7, depot.y - 8, 26, 22);
  }
  c.strokeStyle = '#3d4737'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(depot.x - 52, depot.y + 10); c.lineTo(depot.x - 52, depot.y - 60); c.stroke();
  c.fillStyle = color; c.fillRect(depot.x - 51, depot.y - 60, 19, 12);
  c.restore();
}
function drawDepotStatus(c) {
  const card = depotCard(depot, munitionsIncome());
  c.save(); c.fillStyle = '#f3e9cff5'; c.fillRect(card.x, card.y, card.width, card.height);
  c.strokeStyle = depot.team === 0 ? '#386d59' : depot.team === 1 ? '#a94b3d' : '#82724e';
  c.lineWidth = 1; c.strokeRect(card.x, card.y, card.width, card.height);
  c.textAlign = 'left'; c.fillStyle = '#263b2d'; c.font = 'bold 12px sans-serif';
  c.fillText(card.owner, card.x + 7, card.y + 15);
  c.font = '11px sans-serif'; c.fillText(card.benefit, card.x + 7, card.y + 30);
  if (card.progress) {
    c.fillStyle = '#c6b995'; c.fillRect(card.x + 7, card.y + 36, card.width - 14, 3);
    c.fillStyle = card.captureTeam === 0 ? '#386d59' : '#a94b3d';
    c.fillRect(card.x + 7, card.y + 36, (card.width - 14) * card.progress, 3);
  }
  c.restore();
}
