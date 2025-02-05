/* eslint-disable @typescript-eslint/ban-ts-comment,no-console */
import './index.scss';
import { dbGetAllFromStore } from './dbGet';
import type { KV } from './dbGet';
import { localStorageGetAll } from './lsGet';


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

  const request = indexedDB.open('GB Printer Web', 4);

  let transferred: TransferMessage;

  urlLoadButton.addEventListener('click', () => {
    window.open(urlField.value, 'db-child', 'width=480,height=400') as Window;

  });

  copyButton.addEventListener('click', () => {
    console.log(transferred);
  });

  window.addEventListener('message', (event: MessageEvent<TransferMessage>) => {
    let childOrigin = '';

    try {
      childOrigin = (new URL(urlField.value)).origin;
    } catch { /**/ }

    if (event.origin !== childOrigin) {
      return;
    }

    if (event.data.type === 'DBDATA') {
      transferred = event.data;
      dbReport.innerText = `${transferred.images.length} images\n${transferred.frames.length} frames\n${transferred.localStorageData.length} localStorage entries`;
      copyButton.disabled = false;
      copyButton.innerText = 'Info';
    }
  });

  if (opener) {
    dbRoot.classList.add('is-child');

    request.onsuccess = async () => {
      const images = await dbGetAllFromStore(request, 'gb-printer-web-images');
      const frames = await dbGetAllFromStore(request, 'gb-printer-web-frames');
      const localStorageData = await localStorageGetAll();


      window.setTimeout(() => {
        console.log(images, frames);
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
