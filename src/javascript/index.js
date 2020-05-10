import 'babel-polyfill/dist/polyfill';
import '../scss/index.scss';

import initApp from './app/initApp';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
