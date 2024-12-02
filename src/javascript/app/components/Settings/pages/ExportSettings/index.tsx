import React from 'react';
import { useImportExportSettings } from '../../../../../hooks/useImportExportSettings';
import useStoragePersist from './useStoragePersist';
import useHashCleanup from '../../../../../tools/hashCleanup';
import { ExportTypes } from '../../../../../consts/exportTypes';
import { useImageGroups } from '../../../../../hooks/useImageGroups';

function ExportSettings() {
  const { hashCleanup, cleanupBusy } = useHashCleanup();
  const { downloadSettings } = useImportExportSettings();

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
