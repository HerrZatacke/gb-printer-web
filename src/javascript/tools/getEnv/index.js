import { localforageReady, localforageImages } from '../localforageInstance';
import transferLocalStorage from '../transferLocalStorage';

let envData = null;

const loadEnv = () => {
  if (envData) {
    return Promise.resolve(envData);
  }

  return localforageReady()
    .then(() => (
      transferLocalStorage()
        .then(() => (
          fetch('./env.json')
            .then((res) => res.json())
            .catch(() => ({
              version: '0.0.0',
              maximages: 0,
              localforage: 'error',
              env: 'error',
              fstype: '-',
              bootmode: '-',
              oled: false,
            }))
            .then((env) => {
              envData = {
                ...env,
                localforage: localforageImages.driver(), // localStorageWrapper or asyncStorage or webSQLStorage
              };

              if (!env || !Object.keys(env).length) {
                console.error('Environment data is missing from "/env.json"!');
              }

              return envData;
            })
        ))
    ));
};

const getEnv = () => envData;

export {
  loadEnv,
  getEnv,
};
