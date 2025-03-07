import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
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
    <ButtonGroup
      variant="contained"
      fullWidth
      className="settings__export"
    >
      <Button
        disabled={persisted !== PersistState.NOT_PERSISTED}
        onClick={requestPersist}
      >
        { persistMessage(persisted) }
      </Button>
      <Button
        onClick={resetGroups}
      >
        Reset image groups
      </Button>
      <Button
        onClick={() => exportJson(ExportTypes.ALL)}
      >
        Export Everything
      </Button>
      <Button
        onClick={() => exportJson(ExportTypes.PLUGINS)}
      >
        Export Plugins
      </Button>
      <Button
        disabled={cleanupBusy}
        onClick={hashCleanup}
      >
        Hash Cleanup
      </Button>
    </ButtonGroup>
  );
}

export default ExportSettings;
