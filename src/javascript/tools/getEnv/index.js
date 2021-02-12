import localforage from 'localforage';

localforage.config({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web',
});

let envData = null;

const loadEnv = () => {
  if (envData) {
    return Promise.resolve(envData);
  }

  return localforage.ready()
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
            localforage: localforage.driver(), // localStorageWrapper or asyncStorage or webSQLStorage
          };
        })
    ));
};

const getEnv = () => envData;

export {
  loadEnv,
  getEnv,
};
