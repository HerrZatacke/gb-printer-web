'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ExportTypes } from '@/consts/exportTypes';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useStoragePersist, { PersistState } from '@/hooks/useStoragePersist';
import useHashCleanup from '@/tools/hashCleanup';

const persistMessage = (persistState: PersistState): string => {
  switch (persistState) {
    case PersistState.PERSISTED:
      return 'persistState.isPersistent';
    case PersistState.NOT_PERSISTED:
      return 'persistState.requestPersistence';
    case PersistState.NO_API:
      return 'persistState.apiUnavailable';
    case PersistState.FAILED:
    default:
      return 'persistState.failed';
  }
};

function ExportSettings() {
  const { hashCleanup, cleanupBusy } = useHashCleanup();
  const { downloadSettings } = useImportExportSettings();
  const t = useTranslations('ExportSettings');

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
        title={t(persistMessage(persisted))}
        disabled={persisted !== PersistState.NOT_PERSISTED}
        onClick={requestPersist}
      >
        {t(persistMessage(persisted))}
      </Button>
      <Button
        title={t('resetGroups')}
        onClick={resetGroups}
      >
        {t('resetGroups')}
      </Button>
      <Button
        title={t('exportAll')}
        onClick={() => exportJson(ExportTypes.ALL)}
      >
        {t('exportAll')}
      </Button>
      <Button
        title={t('exportPlugins')}
        onClick={() => exportJson(ExportTypes.PLUGINS)}
      >
        {t('exportPlugins')}
      </Button>
      <Button
        title={t('hashCleanup')}
        disabled={cleanupBusy}
        onClick={hashCleanup}
      >
        {t('hashCleanup')}
      </Button>
    </ButtonGroup>
  );
}

export default ExportSettings;
