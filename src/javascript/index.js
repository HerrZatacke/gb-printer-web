import 'babel-polyfill/dist/polyfill';
import '../scss/index.scss';
// import initApp from './app/initApp';

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  // console.log(JSON.stringify(CONFIG, null, 2));
  // initApp();

  const log = document.getElementById('log');

  window.setInterval(() => {
    fetch('/api/serial')
      .then((res) => res.json())
      .catch((error) => [error.message])
      .then((lines) => {
        if (lines.length) {
          lines.forEach((line) => {
            log.innerText += `${line}\n`;
          });

          log.scrollTo(0, log.scrollHeight);
        }
      });
  }, 100);

  log.click();
});
