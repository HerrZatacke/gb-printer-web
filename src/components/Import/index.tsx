'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ConnectPrinter from '@/components/ConnectPrinter';
import PicNRecImportDialog from '@/components/Import/PicNRecImportDialog';
import { ExportTypes } from '@/consts/exportTypes';
import { useGBXCart } from '@/hooks/useGBXCart';
import { usePicNRec } from '@/hooks/usePicNRec';
import { useImport } from './useImport';

function Import() {
  const [text, setText] = useState('');
  const t = useTranslations('Import');

  const {
    importPlainText,
    importFiles,
    exportJson,
  } = useImport();

  const {
    gbxCartAvailable,
    readRAMImage,
    readPhotoRom,
    canReadPhotoRom,
    busy,
  } = useGBXCart();

  const {
    picNRecAvailable,
    openImportDialog,
    closeImportDialog,
    importPicNRec,
    busy: picNRecBusy,
    dialogOpen,
    dialogLoading,
    deviceInfo,
    previewImageNumber,
    setPreviewImageNumber,
    previewTiles,
    previewStatus,
    previewLoading,
    startImageNumber,
    setStartImageNumber,
    endImageNumber,
    setEndImageNumber,
    rangeError,
    canImport,
    clearPicNRecLastImageLocation,
  } = usePicNRec();

  useEffect(() => {
    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        setText(dummyContent.join('\n'));
      });
  }, []);

  return (
    <Stack direction="column" gap={6}>
      <ConnectPrinter />

      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          component="label"
          variant="contained"
          title={t('selectFiles')}
        >
          {t('selectFiles')}
          <input
            type="file"
            tabIndex={-1}
            hidden
            multiple
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
              const { target } = ev;
              const { files } = target;

              if (files && files.length) {
                importFiles([...files]);
              }

              target.value = '';
            }}
          />
        </Button>

        {gbxCartAvailable && (
          <>
            <Button
              onClick={readRAMImage}
              title={t('importMemory')}
              disabled={busy}
            >
              {t('importMemory')}
            </Button>
            <Button
              onClick={readPhotoRom}
              disabled={!canReadPhotoRom || busy}
              title={t('importAlbumRolls')}
            >
              {t('importAlbumRolls')}
            </Button>
          </>
        )}
        {picNRecAvailable && (
          <Button
            onClick={openImportDialog}
            title={t('importPicNRec')}
            disabled={picNRecBusy || dialogLoading}
          >
            {t('importPicNRec')}
          </Button>
        )}
      </ButtonGroup>

      <Stack
        flexDirection="column"
        gap={1}
        justifyContent="flex-end"
        justifyItems="end"
      >
        <TextField
          id="import-plaintext"
          label={t('serialMonitorLabel')}
          multiline
          rows={20}
          value={text}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            setText(target.value);
          }}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => {
              importPlainText(text);
            }}
          >
            {t('import')}
          </Button>
        </Stack>
      </Stack>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.IMAGES)}
          title={t('exportImages')}
        >
          {t('exportImages')}
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.SELECTED_IMAGES)}
          title={t('exportSelectedImages')}
        >
          {t('exportSelectedImages')}
        </Button>
      </ButtonGroup>

      <PicNRecImportDialog
        open={dialogOpen}
        loading={dialogLoading}
        busy={picNRecBusy}
        canImport={canImport}
        closeDialog={closeImportDialog}
        confirmImport={importPicNRec}
        clearLastImageLocation={clearPicNRecLastImageLocation}
        deviceInfo={deviceInfo}
        startImageNumber={startImageNumber}
        setStartImageNumber={setStartImageNumber}
        endImageNumber={endImageNumber}
        setEndImageNumber={setEndImageNumber}
        previewImageNumber={previewImageNumber}
        setPreviewImageNumber={setPreviewImageNumber}
        previewTiles={previewTiles}
        previewStatus={previewStatus}
        previewLoading={previewLoading}
        rangeError={rangeError}
      />
    </Stack>
  );
}

export default Import;
