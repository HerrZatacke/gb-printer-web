type FetchByKeys<T> = (keys: string[]) => Promise<{ items: T[]; missing?: string[] }>;

export const createBatchedLoader = <T>(fetchByKeys: FetchByKeys<T>, getKey: (item: T) => string) => {
  type PendingEntry = { resolve: (item: T | null) => void; reject: (err: unknown) => void };

  let pending = new Map<string, PendingEntry>();
  let scheduled = false;
  const promises = new Map<string, Promise<T | null>>();

  const flush = async () => {
    const batch = pending;
    pending = new Map();
    scheduled = false;

    try {
      const { items } = await fetchByKeys([...batch.keys()]);
      const byKey = new Map(items.map((item) => [getKey(item), item]));

      for (const [key, { resolve }] of batch) {
        resolve(byKey.get(key) ?? null);
      }
    } catch (err) {
      for (const { reject } of batch.values()) {
        reject(err);
      }
    }
  };

  const loadByKey = (key: string): Promise<T | null> => {
    if (!promises.has(key)) {
      const promise = new Promise<T | null>((resolve, reject) => {
        pending.set(key, { resolve, reject });
      });
      promises.set(key, promise);
      promise.finally(() => {
        promises.delete(key);
      });
    }

    if (!scheduled) {
      scheduled = true;
      queueMicrotask(flush);
    }

    return promises.get(key)!;
  };

  return { loadByKey };
};
