import { useState } from 'react';

interface UseStoragePersist {
  persistAPIAvailable: boolean,
  persisted: boolean,
  requestPersist: () => void,
}

const useStoragePersist = (): UseStoragePersist => {
  const [persisted, setPersisted] = useState(false);
  const persistAPIAvailable = !!(navigator.storage && navigator.storage.persist);

  if (persistAPIAvailable) {
    navigator.storage.persisted().then(setPersisted);
  }

  const requestPersist = () => {
    setPersisted(false);
    if (persistAPIAvailable) {
      navigator.storage.persist().then(setPersisted);
    }
  };

  return {
    persistAPIAvailable,
    persisted,
    requestPersist,
  };
};

export default useStoragePersist;
