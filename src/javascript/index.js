import 'babel-polyfill/dist/polyfill';
import '../scss/index.scss';

import initApp from './app/initApp';

document.addEventListener('DOMContentLoaded', () => {

  initApp();
  const mock = document.querySelector('button.mock');

  mock.addEventListener('click', () => {
    fetch('/mock')
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  });

});
