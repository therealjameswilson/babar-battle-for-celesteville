'use strict';
const gallery = document.getElementById('gallery');
for (const member of COURT) {
  const card = document.createElement('article');
  card.dataset.character = member.id;
  const heading = document.createElement('div');
  heading.className = 'card-heading';
  const portrait = document.createElement('span');
  portrait.className = 'portrait';
  portrait.innerHTML = characterArtMarkup(member.id, true);
  const title = document.createElement('h2');
  title.textContent = member.name;
  heading.append(portrait, title);
  const sprite = document.createElement('div');
  sprite.className = 'sprite';
  sprite.setAttribute('role', 'img');
  sprite.setAttribute('aria-label', member.name + ' full-body sprite');
  sprite.innerHTML = characterArtMarkup(member.id);
  const relation = document.createElement('p');
  relation.textContent = member.relation;
  const origin = document.createElement('p');
  origin.className = 'origin';
  origin.textContent = member.book || 'Television / film crossover';
  const download = document.createElement('a');
  download.href = CHARACTER_ART[member.id].sheet;
  download.download = '';
  download.textContent = 'Download source sprite sheet';
  card.append(heading, sprite, relation, origin, download);
  gallery.append(card);
}
const search = document.getElementById('search');
function filterCharacters() {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const card of gallery.children) {
    card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
    if (!card.hidden) visible++;
  }
  document.getElementById('count').textContent = visible + ' of ' + COURT.length + ' characters';
}
search.addEventListener('input', filterCharacters);
filterCharacters();
