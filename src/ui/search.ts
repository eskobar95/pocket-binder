export function searchScreen(): HTMLElement {
  const el = document.createElement('section');
  const h = document.createElement('h1');
  h.textContent = 'Search';
  el.append(h);
  return el;
}
