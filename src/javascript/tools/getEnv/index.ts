import { localforageReady, localforageImages } from '../localforageInstance';
import transferLocalStorage from '../transferLocalStorage';

interface EnvData {
  version: string,
  maximages: number,
  localforage: string,
  env: string,
  fstype: string,
  bootmode: string,
  oled: boolean,
}

let envData: EnvData | null = null;

const loadEnv = async (): Promise<EnvData> => {
  if (envData) {
    return Promise.resolve(envData);
  }

  await localforageReady();
  await transferLocalStorage();


  let env: EnvData;
  try {
    const res = await fetch('./env.json');
    env = await res.json();
  } catch {
    env = {
      version: '0.0.0',
      maximages: 0,
      localforage: 'error',
      env: 'error',
      fstype: '-',
      bootmode: '-',
      oled: false,
    };
  }

  envData = {
    ...env,
    localforage: await localforageImages.driver(), // localStorageWrapper or asyncStorage or webSQLStorage
  };

  if (!env || !Object.keys(env).length) {
    console.error('Environment data is missing from "/env.json"!');
  }

  return envData;
};

const getEnv = () => envData;

export {
  loadEnv,
  getEnv,
};
