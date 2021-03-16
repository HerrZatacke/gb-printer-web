import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';

document.addEventListener('DOMContentLoaded', () => {

  if (window.location.hash === '#simple') {
    const targetWindow = window.opener || window.parent;

    if (targetWindow) {
      const button = document.createElement('button');
      button.innerText = 'Pronter';
      button.classList.add('button');
      button.addEventListener('click', () => {

        import(/* webpackChunkName: "dmy" */ './app/components/Import/dummy')
          .then(({ default: lines }) => {
            targetWindow.postMessage({ remotePrinter: {
              lines,
            } }, '*');
          });

      });

      window.setInterval(() => {
        targetWindow.postMessage({ remotePrinter: { heartbeat: true } }, '*');
      }, 500);

      document.body.appendChild(button);
    }

    return;
  }

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
