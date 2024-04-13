import localforage from 'localforage';

export interface WrappedLocalForageInstance<T> {
  ready: () => Promise<void>,
  keys: () => Promise<string[]>,
  driver: () => Promise<string>,
  setItem: (key: string, value: T) => Promise<T>,
  getItem: (key: string) => Promise<T | null>,
  removeItem: (key: string) => Promise<void>,
}

const DUMMY = `dummy${(new Date()).getTime()}`;

const createWrappedInstance = <T>(options: LocalForageOptions): WrappedLocalForageInstance<T> => {
  let instance = localforage.createInstance(options);

  const createDummys = async () => {
    await instance.setItem(DUMMY, DUMMY);
    await instance.removeItem(DUMMY);
  };

  return {
    ready: async (): Promise<void> => {
      try {
        await instance.ready();
        return createDummys();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    keys: async (): Promise<string[]> => {
      try {
        return instance.keys();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    driver: async (): Promise<string> => {
      try {
        return await instance.driver();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    setItem: async (key: string, value: T): Promise<T> => {
      try {
        return await instance.setItem(key, value);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    getItem: async (key: string): Promise<T | null> => {
      try {
        return await instance.getItem<T>(key);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }

    },
    removeItem: async (key: string): Promise<void> => {
      try {
        return await instance.removeItem(key);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
  };
};

export default createWrappedInstance;
