import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';
import initLog from './tools/initLog';
import { initLightbox } from './tools/initLightbox';

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

  try {
    await loadEnv();
    initLog('Loading main app file');
    const { default: initApp } = await import(/* webpackChunkName: "iap" */'./app/initApp');
    initLog('Starting app');
    await initApp();
    initLightbox();
  } catch (error) {
    const appNode = document.getElementById('app');

    if (appNode) {
      appNode.innerHTML =
        `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${(error as Error).stack}</small></p>`;
    }
  }
});
