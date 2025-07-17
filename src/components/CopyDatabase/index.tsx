'use client';

import './styles.scss';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { dbClearAndSetAll, dbGetAllFromStore, type KV } from '@/tools/database/dbGetSet';
import { localStorageClear, localStorageGetAll, localStorageSet } from '@/tools/database/lsGetSet';
import { localforageReady } from '@/tools/localforageInstance';

const DB_NAME = 'GB Printer Web';
const TRANSFER_MESSAGE_TYPE = 'DBDATA';

interface TransferMessage {
  type: 'DBDATA';
  images: KV<string>[];
  frames: KV<string>[]
  localStorageData: KV<string>[],
}

export default function CopyDatabase() {
  const t = useTranslations('CopyDatabase');
  const [url, setUrl] = useState('https://herrzatacke.github.io/gb-printer-web/db.html');
  const [remoteWindow, setRemoteWindow] = useState<Window | undefined>();
  const [transferred, setTransferred] = useState<TransferMessage | undefined>();
  const [dbRequest, setDbRequest] = useState<IDBOpenDBRequest | undefined>();
  const [isChlid, setIsChild] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string[]>([]);

  const { replace } = useRouter();

  const addReportText = useCallback((text: string) => {
    setReportText((texts) => [...texts, text]);
  }, []);

  useEffect(() => {
    (async () => {
      await localforageReady();
      const databases = await indexedDB.databases();
      const version = databases.find(({ name }) => name === DB_NAME)?.version || 1;
      const request = indexedDB.open(DB_NAME, version);

      setDbRequest(request);

      const opener: Window | null = window.opener || null;

      window.addEventListener('message', (event: MessageEvent<TransferMessage>) => {
        if (event.data.type === TRANSFER_MESSAGE_TYPE) {
          setTransferred(event.data);
        }
      });

      if (opener) {
        setIsChild(true);

        request.onsuccess = async () => {
          const images = await dbGetAllFromStore(request, 'gb-printer-web-images');
          const frames = await dbGetAllFromStore(request, 'gb-printer-web-frames');
          const localStorageData = await localStorageGetAll();


          window.setTimeout(() => {
            const transferMessage: TransferMessage = {
              type: TRANSFER_MESSAGE_TYPE,
              images,
              frames,
              localStorageData,
            };

            opener.postMessage(transferMessage, '*');
          }, 500);
        };
      }

    })();
  }, []);

  useEffect(() => {
    if (!transferred) {
      setReportText([]);
    } else {
      setReportText([
        t('reportImages', { count: transferred.images.length }),
        t('reportFrames', { count: transferred.frames.length }),
        t('reportLocalStorage', { count: transferred.localStorageData.length }),
      ]);
    }
  }, [t, transferred]);

  const loadRemote = useCallback(() => {
    setRemoteWindow(window.open(url, 'db-child', 'width=480,height=400') as Window);
  }, [url]);

  const copyData = useCallback(async () => {
    if (!transferred || !dbRequest) {
      return;
    }

    await localStorageClear();
    addReportText(t('reportLocalStorageCleared'));
    await localStorageSet(transferred.localStorageData);
    addReportText(t('reportLocalStorageCopied'));
    await dbClearAndSetAll(dbRequest, 'gb-printer-web-images', transferred.images);
    addReportText(t('reportImagesCopied'));
    await dbClearAndSetAll(dbRequest, 'gb-printer-web-frames', transferred.frames);
    addReportText(t('reportFramesCopied'));

    window.setTimeout(() => {
      remoteWindow?.close();
      replace('/');
    }, 800);
  }, [addReportText, dbRequest, remoteWindow, replace, t, transferred]);

  return (
    <div className={`database-page ${isChlid ? 'is-child' : ''}`}>
      <div className="url-load">
        <label>
        <span>
          {t('sourceUrl')}
        </span>
          <input
            id="db-url"
            type="text"
            value={url}
            onChange={(ev) => setUrl(ev.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={loadRemote}
        >
          {t('loadButton')}
        </button>
      </div>

      <pre>{ reportText.join('\n') }</pre>

      <button
        type="button"
        disabled={!Boolean(transferred)}
        onClick={copyData}
      >
        {t('copyButton')}
      </button>
    </div>
  );
}
