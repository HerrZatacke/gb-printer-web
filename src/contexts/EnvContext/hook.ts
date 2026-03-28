
import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/stores';
import { localforageImages, localforageReady } from '@/tools/localforageInstance';

export interface EnvData {
  version: string,
  maximages: number,
  localforage: string,
  env: string,
  fstype: string,
  bootmode: string,
  oled: boolean,
}

const ENV_ENDPOINT = [
  process.env.NEXT_PUBLIC_BASE_PATH,
  process.env.NEXT_PUBLIC_ENV_ENDPOINT,
]
  .filter(Boolean)
  .join('/');

const NO_ENV_DATA: EnvData = {
  version: '0.0.0',
  maximages: 0,
  localforage: 'error',
  env: 'error',
  fstype: '-',
  bootmode: '-',
  oled: false,
};

export const useContextHook = (): EnvData => {
  const [envData, setEnvData] = useState<EnvData>(NO_ENV_DATA);
  const { setPrinterUrl } = useSettingsStore();

  useEffect(() => {
    if (ENV_ENDPOINT) {
      const handle = window.setTimeout(async () => {
        try {
          await localforageReady();
          const res = await fetch(ENV_ENDPOINT);
          const env: Omit<EnvData, 'localforage'> = await res.json();

          const receivedEnvData: EnvData = {
            ...env,
            localforage: await localforageImages.driver(), // localStorageWrapper or asyncStorage or webSQLStorage
          };

          if (receivedEnvData.env === 'esp8266') {
            setPrinterUrl('/');
          }

          setEnvData(receivedEnvData);
        } catch { /**/ }
      }, 1);

      return () => window.clearTimeout(handle);
    }
  }, [setPrinterUrl]);

  return envData;
};
