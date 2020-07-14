import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';

import initApp from './app/initApp';
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

        initApp();
      });
  } catch (error) {
    // eslint-disable-next-line no-alert
    document.getElementById('app')
      .innerHTML = '<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromnium-based browsers.</p>';
  }
});
