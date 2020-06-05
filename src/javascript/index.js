import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';

import initApp from './app/initApp';

document.addEventListener('DOMContentLoaded', () => {
  if (isTouchDevice()) {
    document.querySelector('body').classList.add('is-touch');
  } else {
    document.querySelector('body').classList.add('no-touch');
  }

  initApp();
});
