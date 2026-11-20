export function tradeScreen(): HTMLElement {
  const el = document.createElement('section');
  const h = document.createElement('h1');
  h.textContent = 'Trade';
  el.append(h);
  return el;
}
