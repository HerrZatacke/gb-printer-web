import { localforageImages } from '../localforageInstance';
import transferLocalStorage from '../transferLocalStorage';

let envData = null;

const loadEnv = () => {
  if (envData) {
    return Promise.resolve(envData);
  }

  return localforageImages.ready()
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
