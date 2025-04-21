import '../scss/index.scss';
import { loadEnv } from './tools/getEnv';
import initLog from './tools/initLog';
import { migrateTheme } from './app/stores/migrations/history/0/migrateTheme';

document.addEventListener('DOMContentLoaded', async () => {
  // set the theme class as quick as possible
  document.querySelector('html')?.classList.add(migrateTheme());

  if (window.location.hostname.includes('d3-dev')) {
    document.body.classList.add('debug');
  }

  initLog('Loading environment information');

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
        `<p class="init-error">There was an unexpected error or this browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${(error as Error).stack}</small></p>`;
    }
  }
});
