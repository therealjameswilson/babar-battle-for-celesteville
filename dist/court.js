'use strict';
let courtTeam = 0,
  courtWasPaused = false;
function powerReady(member) {
  return member.cooldown
    ? Math.max(0, (usedPowers[member.id] ?? -1000) + member.cooldown - t)
    : benefits.has(member.id)
      ? Infinity
      : 0;
}
function usePower(id) {
  const member = COURT.find((c) => c.id === id);
  if (!member || member.team !== 0 || member.storyOnly || !running || ended) return false;
  if (powerReady(member) > 0) return false;
  if (ore < member.cost) {
    say('You need more supplies for ' + member.name + '’s help.');
    return false;
  }
  const leader = alive(0).find((u) => u.type === 'hero');
  if (id === 'babar' && !leader) {
    say('Babar is resting. He will be back soon.');
    return false;
  }
  ore -= member.cost;
  usedPowers[id] = t;
  if (!member.cooldown) benefits.add(id);
  sightAt = -1;
  if (id === 'babar')
    for (const u of alive(0).filter((u) => defs[u.type].speed && dist(u, leader) < 210)) {
      u.hp = Math.min(u.max, u.hp + 80);
      u.morale = Math.min(100, u.morale + 35);
    }
  // Civilian book allies never create combat units or revive historical characters.
  const restore = (filter, hp, morale = 0) => {
    for (const u of alive(0).filter(filter)) {
      u.hp = Math.min(u.max, u.hp + hp);
      if (defs[u.type].speed) u.morale = Math.min(100, u.morale + morale);
    }
  };
  if (id === 'grifaton') restore(u => !defs[u.type].speed && !u.construction, 120);
  if (id === 'colin') nodes.push({ x: 470, y: 1080, r: 20, amount: 800 });
  if (id === 'nadine') revealUntil = Math.max(revealUntil, t + 18);
  if (id === 'princess-isabelle') restore(u => defs[u.type].speed, 0, 30);
  if (id === 'eleonore') restore(u => u.type === 'worker', 80);
  if (id === 'crustadele') restore(u => u.type === 'relay' && !u.construction, 200);
  if (id === 'father-christmas') ore += 200;
  if (id === 'duck') restore(u => u.type === 'scout', 60, 20);
  if (id === 'alexander') nextWave += 25;
  if (id === 'zephir') {
    revealUntil = Math.max(revealUntil, t + 25);
    sightAt = -1;
  }
  if (id === 'truffles')
    for (const u of alive(0).filter((u) => defs[u.type].speed)) u.hp = Math.min(u.max, u.hp + 100);
  if (id === 'isabelle' || id === 'babar-mother' || id === 'old-tusk') {
    const gain = id === 'isabelle' ? 20 : id === 'babar-mother' ? 30 : 60;
    for (const u of alive(0).filter((u) =>
      id === 'isabelle'
        ? defs[u.type].speed
        : u.type === (id === 'babar-mother' ? 'worker' : 'walker')
    )) {
      u.max += gain;
      u.hp += gain;
    }
  }
  if (id === 'badou') nodes.push({ x: 550, y: 1100, r: 20, amount: 2200 });
  if (id === 'periwinkle')
    for (const r of heroRecovery.filter((r) => r.team === 0)) r.at = Math.min(r.at, t + 25);
  if (id === 'babar' && leader) fx.push({ x: leader.x, y: leader.y, life: 1, max: 1, ring: true });
  say(member.name + ': ' + member.title + '!');
  updateUI(true);
  renderCourt();
  return true;
}
function renderCourt() {
  $('court-funds').textContent =
    'Supplies available: ' + Math.floor(ore) + (running ? '' : ' · Begin a mission to use powers');
  $('tab-elephants').setAttribute('aria-pressed', String(courtTeam === 0));
  $('tab-rhinos').setAttribute('aria-pressed', String(courtTeam === 1));
  $('tab-books').setAttribute('aria-pressed', String(courtTeam === 'books'));
  const holder = $('court-roster');
  holder.replaceChildren();
  const query = ($('court-search').value || '').trim().toLocaleLowerCase();
  let group = '';
  let count = 0;
  for (const member of COURT.filter((c) => courtTeam === 'books' ? c.book : c.team === courtTeam)) {
    if (query && ![member.name, member.relation, member.book || ''].join(' ').toLocaleLowerCase().includes(query)) continue;
    count++;
    if (member.group !== group) {
      group = member.group;
      const h = document.createElement('h3');
      h.textContent = group;
      holder.appendChild(h);
    }
    const card = document.createElement('article');
    card.className = 'court-card' + (member.team ? ' rhino' : '');
    const ready = powerReady(member),
      active = benefits.has(member.id);
    let label = active
      ? 'Helping the kingdom'
      : ready > 0
        ? 'Ready in ' + Math.ceil(ready) + 's'
        : member.cost
          ? 'Invite · ' + member.cost + ' supplies'
          : 'Use · ' + member.title;
    if (member.id === 'babar' && !alive(0).some((u) => u.type === 'hero')) {
      const r = heroRecovery.find((r) => r.team === 0);
      label = r
        ? (r.at<=t&&populationBlocked()?'Awaiting population room · build a home':'Recovering · ' + Math.max(0, Math.ceil(r.at - t)) + 's') + ' · 100 supplies'
        : 'Not deployed';
    }
    if (member.team) {
      const onset = { rataxes: 2, lady: 1, basil: 2, victor: 3, rhudi: 4 }[member.id];
      label =
        member.id === 'basil' && !alive(1).some((u) => u.type === 'forge')
          ? 'Barracks destroyed'
          : wave >= onset
            ? 'In effect'
            : 'From wave ' + onset;
    }
    card.innerHTML =
      '<div class="member-top"><span class="member-monogram member-portrait">' +
      characterArtMarkup(member.id, true) +
      '</span><div><h4>' +
      member.name +
      '</h4><p>' +
      member.relation +
      '</p></div></div><small class="book-origin">' +
      (member.book ? 'Book: ' + member.book : 'Television / film crossover') +
      '</small><strong>' +
      member.title +
      '</strong><p>' +
      member.text +
      '</p><small class="power-meta">' +
      (member.storyOnly
        ? 'Story archive · No cost or combat effect'
        : member.team
        ? 'Enemy doctrine'
        : member.cost +
          ' supplies · ' +
          (member.cooldown ? member.cooldown + 's cooldown' : 'Once per mission')) +
      '</small>';
    const button = document.createElement('button');
    button.textContent = member.storyOnly ? 'Archive · Read above' : label;
    button.disabled =
      !!member.team || !!member.storyOnly || !running || ended || active || ready > 0 || ore < member.cost;
    button.onclick = () => usePower(member.id);
    card.appendChild(button);
    if(member.id==='madame') {
      const attack=document.createElement('button');
      const wait=Math.max(0,(usedPowers['madame-attack']??-1000)+IRON_PARASOL.cooldown-t);
      attack.textContent=wait>0?'Iron Parasol · '+Math.ceil(wait)+'s':'Iron Parasol · 90 supplies';
      attack.disabled=!running || ended || wait>0 || ore<IRON_PARASOL.cost;
      attack.onclick=madameAttack;
      card.appendChild(attack);
    }
    holder.appendChild(card);
  }
  if (!count) { const empty = document.createElement('p'); empty.textContent = 'No matching characters in this section. Try another name or tab.'; holder.appendChild(empty); }
}
function openCourt() {
  courtWasPaused = paused;
  if (running && !paused) togglePause();
  renderCourt();
  $('court-dialog').showModal();
}
function closeCourt() {
  $('court-dialog').close();
}
$('court-open').onclick = openCourt;
$('court-close').onclick = closeCourt;
$('court-dialog').addEventListener('close', () => {
  if (running && !courtWasPaused && paused) togglePause();
});
$('tab-elephants').onclick = () => {
  courtTeam = 0;
  renderCourt();
};
$('tab-rhinos').onclick = () => {
  courtTeam = 1;
  renderCourt();
};

$('tab-books').onclick = () => { courtTeam = 'books'; renderCourt(); };

$('court-search').oninput = renderCourt;
