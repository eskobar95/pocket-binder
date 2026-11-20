import { TABS, type Tab } from '../router';

export function renderTabBar(nav: HTMLElement, active: Tab): void {
  nav.replaceChildren(
    ...TABS.map((t) => {
      const a = document.createElement('a');
      a.href = t.hash;
      a.textContent = t.label;
      if (t.id === active) a.setAttribute('aria-current', 'page');
      return a;
    }),
  );
}
