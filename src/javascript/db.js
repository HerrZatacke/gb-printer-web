import '../scss/index.scss';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import isTouchDevice from './tools/isTouchDevice';
import { loadEnv } from './tools/getEnv';
import { localforageImages, localforageFrames, localforageReady } from './tools/localforageInstance';
import { dateFormat } from './app/defaults';

const rootNode = document.querySelector('.app__content');

const logLine = (text) => {
  const row = document.createElement('div');
  row.innerText = text;
  rootNode.appendChild(row);
  return row;
};

const logData = async (keys, storage) => {
  const keyData = await Promise.all(keys.map((hash) => (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => (
        storage.getItem(hash)
          .then((binary) => {
            const inflated = pako.inflate(binary, { to: 'string' });
            return {
              hash,
              lines: inflated.split('\n'),
              binary,
            };
          })
          .catch(() => ({
            hash,
            lines: null,
          }))
      ))
  )));

  keyData.forEach((data) => {
    try {
      logLine(`${data.hash} - ${data.lines.length} lines`);
    } catch (error) {
      const row = logLine(`${data?.hash || '?'} - ${error.message}`);
      row.style = 'color: red';
    }
  });

  return keyData;
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
      const imageData = await logData(imageKeys, localforageImages);

      logLine('Frames').style = 'font-size:18px;margin:20px 0 10px;';
      const frameKeys = await localforageFrames.keys();
      await logData(frameKeys, localforageFrames);
      // const frameData = await logData(frameKeys, localforageFrames);

      const jsonBackup = { state: {} };
      const backupImages = imageData.map((image) => {
        try {
          jsonBackup[image.hash] = image.binary;
          return {
            hash: image.hash,
            created: dayjs().format(dateFormat),
            title: `Backup export ${image.hash}`,
            lines: image.lines.length,
            tags: ['backup'],
            palette: 'bw',
            frame: '',
          };
        } catch (error) {
          return null;
        }
      }).filter(Boolean);

      jsonBackup.state.images = backupImages;

      const exportButton = logLine('Save Backup');
      exportButton.style = 'cursor:pointer;font-size:20px;margin:20px 0 10px;background:red;padding:20px;display:inline-block;';
      exportButton.addEventListener('click', () => {
        saveAs(new Blob([...JSON.stringify(jsonBackup, null, 2)]), 'backup.json');
      });
    })
    .catch((error) => {
      document.getElementById('app')
        .innerHTML = `<p class="init-error">This browser is not supported.<br/>This App is being optimized for chromium-based browsers.<small>${error.stack}</small></p>`;
    });
});
