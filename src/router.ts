export type Tab = 'sets' | 'search' | 'trade' | 'more';

export interface TabInfo {
  id: Tab;
  label: string;
  hash: string;
}

export const TABS: readonly TabInfo[] = [
  { id: 'sets', label: 'Sets', hash: '#/sets' },
  { id: 'search', label: 'Search', hash: '#/search' },
  { id: 'trade', label: 'Trade', hash: '#/trade' },
  { id: 'more', label: 'More', hash: '#/more' },
];

export interface Route {
  tab: Tab;
  path: string[];
}

const DEFAULT_TAB: Tab = 'sets';

export function hashFor(tab: Tab): string {
  return TABS.find((t) => t.id === tab)?.hash ?? '#/sets';
}

/** Turn a location hash into a tab plus its path segments. Anything unknown belongs to Sets. */
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const first = path[0];
  const tab = TABS.find((t) => t.id === first)?.id ?? DEFAULT_TAB;
  return { tab, path };
}

/** Call onChange with the current route now, and again on every hash change. */
export function startRouter(onChange: (route: Route) => void): void {
  const run = () => onChange(parseHash(location.hash));
  window.addEventListener('hashchange', run);
  run();
}
