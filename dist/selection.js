
'use strict';
// Retain a mixed selection while the commander issues orders to one unit type.
let selectionPool = [], selectionSnapshot = [], selectionType = null, selectionKey = '';
function resetSubgroups() {
  selectionPool = []; selectionSnapshot = []; selectionType = null; selectionKey = '';
}
function syncSubgroups() {
  const liveSnapshot = selectionSnapshot.filter(u => u.hp > 0);
  const current = selected.filter(u => u.hp > 0);
  if (current.length !== liveSnapshot.length || current.some((u,i) => u !== liveSnapshot[i])) {
    selectionPool = current.slice(); selectionType = null;
  }
  selectionPool = selectionPool.filter(u => u.hp > 0 && u.team === 0);
  selected = current;
  if (selectionType && !selectionPool.some(u => u.type === selectionType)) {
    selectionType = null; selected = selectionPool.slice();
  }
  selectionSnapshot = selected.slice();
}
function chooseSubgroup(type) {
  syncSubgroups();
  if (type !== null && !selectionPool.some(u => u.type === type)) return;
  selectionType = type;
  selected = selectionPool.filter(u => type === null || u.type === type);
  selectionSnapshot = selected.slice();
  mode = null; placing = null;
  updateUI(true);
}
function cycleSubgroup(reverse = false) {
  if (!running || ended || $('help-dialog').open || $('court-dialog').open || $('groups-dialog').open) return;
  syncSubgroups();
  const types = [null, ...new Set(selectionPool.map(u => u.type))];
  if (types.length < 3) return;
  chooseSubgroup(types[(types.indexOf(selectionType) + (reverse ? types.length - 1 : 1)) % types.length]);
}
function renderSubgroups() {
  syncSubgroups();
  const holder = $('selection-groups');
  const types = [...new Set(selectionPool.map(u => u.type))];
  holder.hidden = types.length < 2;
  const key = selectionPool.map(u => u.id).join(',') + ':' + selectionType;
  if (key === selectionKey) return;
  selectionKey = key; holder.replaceChildren();
  if (types.length < 2) return;
  for (const type of [null, ...types]) {
    const count = selectionPool.filter(u => type === null || u.type === type).length;
    const button = document.createElement('button');
    button.textContent = (type === null ? 'All' : defs[type].name) + ' · ' + count;
    button.setAttribute('aria-pressed', String(selectionType === type));
    button.onclick = () => chooseSubgroup(type);
    holder.appendChild(button);
  }
}
