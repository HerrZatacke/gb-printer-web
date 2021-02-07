import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';

document.addEventListener('DOMContentLoaded', () => {
  try {
    loadEnv()
      .then(() => {
        if (isTouchDevice()) {
          document.querySelector('body').classList.add('is-touch');
        } else {
          document.querySelector('body').classList.add('no-touch');
        }

        import(/* webpackChunkName: "iap" */'./app/initApp')
          .then(({ default: initApp }) => {
            initApp();
          });
      });
  } catch (error) {
    // eslint-disable-next-line no-alert
    document.getElementById('app')
      .innerHTML = '<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromnium-based browsers.</p>';
  }
});
