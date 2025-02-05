import type { KV } from './dbGet';

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
