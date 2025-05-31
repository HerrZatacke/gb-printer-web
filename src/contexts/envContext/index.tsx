'use client';

import React, { createContext, useContext, useEffect, useState,  PropsWithChildren } from 'react';
import useSettingsStore from '@/stores/settingsStore';
import { localforageImages, localforageReady } from '@/tools/localforageInstance';

// Define the shape of your data
interface EnvData {
  version: string,
  maximages: number,
  localforage: string,
  env: string,
  fstype: string,
  bootmode: string,
  oled: boolean,
}

const envContext = createContext<EnvData | null>(null);

export const useEnv = () => useContext(envContext);

export const EnvProvider = ({ children }: PropsWithChildren) => {
  const [envData, setEnvData] = useState<EnvData | null>(null);
  const { setPrinterUrl } = useSettingsStore();

  useEffect(() => {
    const endpoint = [
      process.env.NEXT_PUBLIC_BASE_PATH,
      process.env.NEXT_PUBLIC_ENV_ENDPOINT,
    ]
      .filter(Boolean)
      .join('/');

    if (endpoint) {
      (async () => {
        try {
          await localforageReady();
          const res = await fetch(endpoint);
          const env: Omit<EnvData, 'localforage'> = await res.json();

          const receivedEnvData: EnvData = {
          ...env,
            localforage: await localforageImages.driver(), // localStorageWrapper or asyncStorage or webSQLStorage
          };

          if (receivedEnvData.env === 'esp8266') {
            setPrinterUrl('/');
          }

          setEnvData(receivedEnvData);
        } catch {
          setEnvData({
            version: '0.0.0',
            maximages: 0,
            localforage: 'error',
            env: 'error',
            fstype: '-',
            bootmode: '-',
            oled: false,
          });
        }
      })();
    }
  }, [setPrinterUrl]);

  return <envContext.Provider value={envData}>{children}</envContext.Provider>;
};
