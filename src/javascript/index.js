import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';

document.addEventListener('DOMContentLoaded', () => {
  loadEnv()
    .then(() => {
      if (isTouchDevice()) {
        document.querySelector('body').classList.add('is-touch');
      } else {
        document.querySelector('body').classList.add('no-touch');
      }

      return import(/* webpackChunkName: "iap" */'./app/initApp')
        .then(({ default: initApp }) => {
          initApp();
        });
    })
    .catch((error) => {
      document.getElementById('app')
        .innerHTML = `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromnium-based browsers.<small>${error.stack}</small></p>`;
    });
});
