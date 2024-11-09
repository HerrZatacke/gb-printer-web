import React from 'react';
import { useStore } from 'react-redux';
import { importExportSettings } from '../../../../../tools/importExportSettings';
import useStoragePersist from './useStoragePersist';
import useHashCleanup from '../../../../../tools/hashCleanup';
import { ExportTypes } from '../../../../../consts/exportTypes';
import type { TypedStore } from '../../../../store/State';
import { useImageGroups } from '../../../../../hooks/useImageGroups';

function ExportSettings() {
  const { hashCleanup, cleanupBusy } = useHashCleanup();
  const store: TypedStore = useStore();
  const { downloadSettings } = importExportSettings(store);

  const { resetGroups } = useImageGroups();
  const exportJson = (what: ExportTypes) => downloadSettings(what);

  const {
    persistAPIAvailable,
    persisted,
    requestPersist,
  } = useStoragePersist();

  return (
    <div className="inputgroup buttongroup settings__export">
      { persistAPIAvailable ? (
        <button
          type="button"
          className="button"
          disabled={persisted}
          onClick={requestPersist}
        >
          { persisted ? 'Storage is persistent' : 'Request storage persistence' }
        </button>
      ) : null }
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
        onClick={() => exportJson(ExportTypes.DEBUG)}
      >
        Export debug settings
      </button>
      <button
        type="button"
        className="button"
        onClick={() => exportJson(ExportTypes.SETTINGS)}
      >
        Export settings
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
