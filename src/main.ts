import './ui/styles.css';
import { startRouter, type Tab } from './router';
import { renderTabBar } from './ui/tabbar';
import { setsScreen } from './ui/sets';
import { searchScreen } from './ui/search';
import { tradeScreen } from './ui/trade';
import { moreScreen } from './ui/more';

const screens: Record<Tab, () => HTMLElement> = {
  sets: setsScreen,
  search: searchScreen,
  trade: tradeScreen,
  more: moreScreen,
};

const app = document.getElementById('app')!;
const nav = document.getElementById('tabbar')!;

startRouter(({ tab }) => {
  renderTabBar(nav, tab);
  app.replaceChildren(screens[tab]());
});
