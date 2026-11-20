export function moreScreen(): HTMLElement {
  const el = document.createElement('section');

  const h = document.createElement('h1');
  h.textContent = 'More';

  const about = document.createElement('div');
  about.className = 'card';
  const h2 = document.createElement('h2');
  h2.textContent = 'About';
  h2.style.marginTop = '0';

  const disclaimer = document.createElement('p');
  disclaimer.append(
    'Pokémon names and images are trademarks and copyright of Nintendo, Creatures, GAME FREAK ' +
      'and The Pokémon Company. Pocket Binder is an unofficial fan app, not affiliated with or ' +
      'endorsed by them. Card data and prices from ',
  );
  const link = document.createElement('a');
  link.href = 'https://tcgdex.dev';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'TCGdex';
  disclaimer.append(link, '.');

  const version = document.createElement('p');
  version.className = 'muted';
  version.textContent = 'Version ' + __APP_VERSION__;

  about.append(h2, disclaimer, version);
  el.append(h, about);
  return el;
}
