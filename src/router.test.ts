import { describe, expect, it } from 'vitest';
import { TABS, hashFor, parseHash } from './router';

describe('parseHash', () => {
  it.each([
    ['#/sets', 'sets'],
    ['#/search', 'search'],
    ['#/trade', 'trade'],
    ['#/more', 'more'],
  ])('%s opens the %s tab', (hash, tab) => {
    expect(parseHash(hash)).toEqual({ tab, path: [tab] });
  });

  it('keeps a nested path and files it under Sets', () => {
    expect(parseHash('#/set/sv01')).toEqual({ tab: 'sets', path: ['set', 'sv01'] });
  });

  it('keeps the rest of a nested path under its tab', () => {
    expect(parseHash('#/more/backup')).toEqual({ tab: 'more', path: ['more', 'backup'] });
  });

  it.each(['', '#', '#/'])('falls back to Sets for the empty hash %j', (hash) => {
    expect(parseHash(hash)).toEqual({ tab: 'sets', path: [] });
  });

  it('falls back to Sets for an unknown hash', () => {
    expect(parseHash('#/nope')).toEqual({ tab: 'sets', path: ['nope'] });
    expect(parseHash('#garbage')).toEqual({ tab: 'sets', path: ['garbage'] });
  });

  it('ignores a trailing slash', () => {
    expect(parseHash('#/search/')).toEqual({ tab: 'search', path: ['search'] });
  });
});

describe('hashFor', () => {
  it('round-trips every tab', () => {
    for (const t of TABS) expect(parseHash(hashFor(t.id)).tab).toBe(t.id);
  });
});
