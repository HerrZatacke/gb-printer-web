import '../scss/index.scss';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';
import { localforageImages, localforageFrames, localforageReady } from './tools/localforageInstance';

const rootNode = document.querySelector('.app__content');

const logLine = (text) => {
  const row = document.createElement('div');
  row.innerText = text;
  rootNode.appendChild(row);
  return row;
};

const logData = async (keys, storage) => {
  const imageData = await Promise.all(keys.map((hash) => (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => (
        storage.getItem(hash)
          .then((binary) => {
            const inflated = pako.inflate(binary, { to: 'string' });
            return {
              hash,
              lines: inflated.split('\n'),
            };
          })
          .catch(() => ({
            hash,
            lines: null,
          }))
      ))
  )));

  imageData.forEach((data) => {
    try {
      logLine(`${data.hash} - ${data.lines.length} lines`);
    } catch (error) {
      const row = logLine(`${data?.hash || '?'} - ${error.message}`);
      row.style = 'color: red';
    }
  });
};

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

  loadEnv()
    .then(async () => {
      rootNode.innerHTML = '';

      await localforageReady();

      logLine('Images').style = 'font-size:18px;margin:20px 0 10px;';
      const imageKeys = await localforageImages.keys();
      await logData(imageKeys, localforageImages);

      logLine('Frames').style = 'font-size:18px;margin:20px 0 10px;';
      const frameKeys = await localforageFrames.keys();
      await logData(frameKeys, localforageFrames);

      // localforageFrames,
    })
    .catch((error) => {
      document.getElementById('app')
        .innerHTML = `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${error.stack}</small></p>`;
    });
});
