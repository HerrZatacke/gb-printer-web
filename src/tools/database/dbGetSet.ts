/* eslint-disable @typescript-eslint/ban-ts-comment */

export interface KV<T> {
  key: string,
  value: T,
}

export const dbGetByKey = async (store: IDBObjectStore, key: string): Promise<string> => new Promise((resolve) => {
  const request = store.get(key);
  request.onsuccess = (ev) => {
    // @ts-ignore
    resolve(ev.target?.result as string[]);
  };
});

export const dbGetAllFromStore = async (request: IDBOpenDBRequest, storeName: string): Promise<KV<string>[]> => (
  new Promise((resolve) => {
    const objectStore = request.result.transaction(storeName).objectStore(storeName);
    const reqest = objectStore.getAllKeys();
    reqest.onsuccess = async (ev) => {
      // @ts-ignore
      const keys = ev.target?.result as string[];

      const dbData: KV<string>[] = [];

      /* eslint-disable no-await-in-loop */
      for (const key of keys) {
        dbData.push({
          key,
          value: await dbGetByKey(objectStore, key),
        });
      }
      /* eslint-enable no-await-in-loop */

      resolve(dbData);
    };
  })
);

export const dbClearAndSetAll = async (
  request: IDBOpenDBRequest,
  storeName: string,
  data: KV<string>[],
): Promise<void> => {
  const objectStore = request.result.transaction(storeName, 'readwrite').objectStore(storeName);

  const clearRequest = objectStore.clear();

  clearRequest.onsuccess = async () => {
    for (const { key, value } of data) {
      objectStore.add(value, key);
    }
  };

};
