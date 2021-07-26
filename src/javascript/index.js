import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';
import initLog from './tools/initLog';

document.addEventListener('DOMContentLoaded', () => {

  // set the theme class as quick as possible
  const theme = localStorage.getItem('gbp-web-theme');
  if (theme) {
    document.querySelector('html').classList.add(theme);
  }

  if (isTouchDevice()) {
    document.querySelector('body').classList.add('is-touch');
  } else {
    document.querySelector('body').classList.add('no-touch');
  }

  initLog('Loading environment information');

  loadEnv()
    .then(() => {

      initLog('Loading main app file');

      return import(/* webpackChunkName: "iap" */'./app/initApp')
        .then(({ default: initApp }) => {
          initLog('Starting app');
          initApp();
        });
    })
    .catch((error) => {
      document.getElementById('app')
        .innerHTML = `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${error.stack}</small></p>`;
    });
});
