import localforage from 'localforage';

const DUMMY = `dummy${(new Date()).getTime()}`;

const createWrappedInstance = (options) => {
  let instance = localforage.createInstance(options);

  const createDummys = (data) => {
    instance.setItem(DUMMY, DUMMY)
      .then(() => (
        instance.removeItem(DUMMY)
      ))
      .then(() => data);
  };

  const handleInstanceError = (error) => {
    console.error(error);
    instance = localforage.createInstance(options);
    throw error;
  };

  return {
    ready: () => instance.ready().then(createDummys).catch(handleInstanceError),
    keys: () => instance.keys().catch(handleInstanceError),
    driver: () => instance.driver(),
    setItem: (key, value) => instance.setItem(key, value).catch(handleInstanceError),
    getItem: (key) => instance.getItem(key).catch(handleInstanceError),
    removeItem: (key) => instance.removeItem(key).catch(handleInstanceError),
  };
};

export default createWrappedInstance;
