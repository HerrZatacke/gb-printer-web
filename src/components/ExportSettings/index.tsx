'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';
import { ExportTypes } from '@/consts/exportTypes';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useStoragePersist, { PersistState } from '@/hooks/useStoragePersist';
import useHashCleanup from '@/tools/hashCleanup';

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
