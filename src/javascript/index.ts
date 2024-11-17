import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';
import initLog from './tools/initLog';
import { migrateItems } from './app/stores/migrations/history/0/migrateItems';

document.addEventListener('DOMContentLoaded', async () => {

  // set the theme class as quick as possible
  const theme = localStorage.getItem('gbp-web-theme');
  if (theme) {
    document.querySelector('html')?.classList.add(theme);
  }

  if (isTouchDevice()) {
    document.querySelector('body')?.classList.add('is-touch');
  } else {
    document.querySelector('body')?.classList.add('no-touch');
  }

  initLog('Loading environment information');

  // eslint-disable-next-line no-console
  console.log('copying state...');
  // ToDo: change this to produce a version:0 and move migration to itemsStore
  // after these are resolved:
  // https://github.com/pmndrs/zustand/discussions/2827
  // https://github.com/pmndrs/zustand/pull/2833
  const oldState = localStorage.getItem('gbp-web-state');
  if (oldState) {
    const v1State = await migrateItems(JSON.parse(oldState));
    localStorage.setItem('gbp-z-web-items', `{"version":-1,"state":${JSON.stringify(v1State)}}`);
  }

  try {
    await loadEnv();
    initLog('Loading main app file');
    const { default: initApp } = await import(/* webpackChunkName: "iap" */'./app/initApp');
    initLog('Starting app');
    await initApp();
  } catch (error) {
    const appNode = document.getElementById('app');

    if (appNode) {
      appNode.innerHTML =
        `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${(error as Error).stack}</small></p>`;
    }
  }
});
