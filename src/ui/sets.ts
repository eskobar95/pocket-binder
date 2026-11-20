export function setsScreen(): HTMLElement {
  const el = document.createElement('section');
  const h = document.createElement('h1');
  h.textContent = 'Sets';
  const p = document.createElement('p');
  p.className = 'muted';
  p.textContent = 'Pick your first set';
  const b = document.createElement('button');
  b.className = 'button';
  b.type = 'button';
  b.disabled = true;
  b.textContent = 'Add a set';
  el.append(h, p, b);
  return el;
}
