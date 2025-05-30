import type { KV } from './dbGetSet';

export const localStorageGetAll = async (): Promise<KV<string>[]> => {
  const keys = Object.keys(localStorage)
    .filter((key) => key.startsWith('gbp'));

  const dbData: KV<string>[] = [];

  for (const key of keys) {
    dbData.push({
      key,
      value: localStorage.getItem(key) as string,
    });
  }

  return dbData;
};

export const localStorageClear = () => {
  for (const key of Object.keys(localStorage)) {
    localStorage.removeItem(key);
  }
};

export const localStorageSet = (data: KV<string>[]) => {
  for (const { key, value } of data) {
    localStorage.setItem(key, value);
  }
};
