import React from 'react';
import { useImportExportSettings } from '../../../../../hooks/useImportExportSettings';
import useStoragePersist, { PersistState } from './useStoragePersist';
import useHashCleanup from '../../../../../tools/hashCleanup';
import { ExportTypes } from '../../../../../consts/exportTypes';
import { useImageGroups } from '../../../../../hooks/useImageGroups';

const persistMessage = (persistState: PersistState): string => {
  switch (persistState) {
    case PersistState.PERSISTED:
      return 'Storage is persistent';
    case PersistState.NOT_PERSISTED:
      return 'Request storage persistence';
    case PersistState.NO_API:
      return 'Persistance API not available';
    case PersistState.FAILED:
    default:
      return 'Failed to persist storage';
  }
};

function ExportSettings() {
  const { hashCleanup, cleanupBusy } = useHashCleanup();
  const { downloadSettings } = useImportExportSettings();

  const { resetGroups } = useImageGroups();
  const exportJson = (what: ExportTypes) => downloadSettings(what);

  const {
    persisted,
    requestPersist,
  } = useStoragePersist();

  return (
    <div className="inputgroup buttongroup settings__export">
      <button
        type="button"
        className="button"
        disabled={persisted !== PersistState.NOT_PERSISTED}
        onClick={requestPersist}
      >
        { persistMessage(persisted) }
      </button>
      <button
        type="button"
        className="button"
        onClick={resetGroups}
      >
        Reset image groups
      </button>
      <button
        type="button"
        className="button"
        onClick={() => exportJson(ExportTypes.ALL)}
      >
        Export Everything
      </button>
      <button
        type="button"
        className="button"
        onClick={() => exportJson(ExportTypes.PLUGINS)}
      >
        Export Plugins
      </button>
      <button
        disabled={cleanupBusy}
        type="button"
        className="button button--tiny"
        onClick={hashCleanup}
      >
        Hash Cleanup
      </button>
    </div>
  );
}

export default ExportSettings;
