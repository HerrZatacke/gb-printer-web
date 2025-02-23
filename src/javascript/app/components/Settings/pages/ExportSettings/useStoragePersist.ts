import { useEffect, useState } from 'react';

export enum PersistState {
  PERSISTED = 'persisted',
  NOT_PERSISTED = 'not-persisted',
  FAILED = 'failed',
  NO_API = 'no_api',
}

interface UseStoragePersist {
  persistAPIAvailable: boolean,
  persisted: PersistState,
  requestPersist: () => void,
}

const persistAPIAvailable = !!(navigator.storage && navigator.storage.persist);

const getPersistState = async (set: (state: PersistState) => void) => {
  if (persistAPIAvailable) {
    const success = await navigator.storage.persisted();
    set(success ? PersistState.PERSISTED : PersistState.NOT_PERSISTED);
  } else {
    set(PersistState.NO_API);
  }
};

const setPersistState = async (set: (state: PersistState) => void) => {
  if (persistAPIAvailable) {
    const success = await navigator.storage.persist();
    set(success ? PersistState.PERSISTED : PersistState.FAILED);
  } else {
    set(PersistState.NO_API);
  }
};

const useStoragePersist = (): UseStoragePersist => {
  const [persisted, setPersisted] = useState(PersistState.NOT_PERSISTED);

  useEffect(() => {
    getPersistState(setPersisted);
  }, []);

  const requestPersist = async () => {
    setPersistState(setPersisted);
  };

  return {
    persistAPIAvailable,
    persisted,
    requestPersist,
  };
};

export default useStoragePersist;
