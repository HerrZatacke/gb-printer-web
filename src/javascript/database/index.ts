/* eslint-disable @typescript-eslint/ban-ts-comment,no-console */
import './index.scss';
import { dbGetAllFromStore, dbSetAll } from './dbGetSet';
import type { KV } from './dbGetSet';
import { localStorageGetAll, localStorageSet } from './lsGetSet';

const DB_NAME = 'GB Printer Web';

interface TransferMessage {
  type: 'DBDATA',
  images: KV<string>[],
  frames: KV<string>[],
  localStorageData: KV<string>[],
}

export const initDbTransfer = async (opener: Window | null) => {
  const dbRoot = document.querySelector('#db') as HTMLDivElement;
  const urlField = dbRoot.querySelector('#db-url') as HTMLInputElement;
  const urlLoadButton = dbRoot.querySelector('#db-url-load') as HTMLButtonElement;
  const copyButton = dbRoot.querySelector('#db-copy') as HTMLButtonElement;
  const dbReport = dbRoot.querySelector('#db-report') as HTMLPreElement;

  const databases = await indexedDB.databases();
  const version = databases.find(({ name }) => name === DB_NAME)?.version || 1;

  const request = indexedDB.open(DB_NAME, version);

  let transferred: TransferMessage;

  urlLoadButton.addEventListener('click', () => {
    window.open(urlField.value, 'db-child', 'width=480,height=400') as Window;

  });

  copyButton.addEventListener('click', async () => {
    await localStorageSet(transferred.localStorageData);
    console.log('localStorage done');
    await dbSetAll(request, 'gb-printer-web-images', transferred.images);
    console.log('images done');
    await dbSetAll(request, 'gb-printer-web-frames', transferred.frames);
    console.log('frames done');
  });

  window.addEventListener('message', (event: MessageEvent<TransferMessage>) => {
    if (event.data.type === 'DBDATA') {
      transferred = event.data;
      dbReport.innerText = `${transferred.images.length} images\n${transferred.frames.length} frames\n${transferred.localStorageData.length} localStorage entries`;
      copyButton.disabled = false;
    }
  });

  if (opener) {
    dbRoot.classList.add('is-child');

    request.onsuccess = async () => {
      const images = await dbGetAllFromStore(request, 'gb-printer-web-images');
      const frames = await dbGetAllFromStore(request, 'gb-printer-web-frames');
      const localStorageData = await localStorageGetAll();


      window.setTimeout(() => {
        const transferMessage: TransferMessage = {
          type: 'DBDATA',
          images,
          frames,
          localStorageData,
        };

        opener.postMessage(transferMessage, '*');
      }, 500);
    };
  }
};
