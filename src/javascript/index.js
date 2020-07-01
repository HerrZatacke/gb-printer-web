import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';

import initApp from './app/initApp';
import { loadEnv } from './tools/getEnv';

document.addEventListener('DOMContentLoaded', () => {
  loadEnv()
    .then(() => {
      if (isTouchDevice()) {
        document.querySelector('body').classList.add('is-touch');
      } else {
        document.querySelector('body').classList.add('no-touch');
      }

      initApp();
    });
});
