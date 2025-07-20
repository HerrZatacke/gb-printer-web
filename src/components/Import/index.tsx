'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import ConnectPrinter from '@/components/ConnectPrinter';
import PrinterReport from '@/components/PrinterReport';
import { ExportTypes } from '@/consts/exportTypes';
import { useGBXCart } from '@/hooks/useGBXCart';
import { useImport } from './useImport';

function Import() {
  const [text, setText] = useState('');
  const t = useTranslations('Import');

  const {
    importPlainText,
    importFiles,
    printerUrl,
    exportJson,
  } = useImport();

  const {
    gbxCartAvailable,
    readRAMImage,
    readPhotoRom,
    canReadPhotoRom,
    busy,
  } = useGBXCart();

  useEffect(() => {
    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        setText(dummyContent.join('\n'));
      });
  }, []);

  return (
    <Stack direction="column" gap={6}>

      { printerUrl && <PrinterReport /> }
      { printerUrl && <ConnectPrinter /> }

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
            onChange={(ev) => {
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
          onChange={({ target }) => {
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
    </Stack>
  );
}

export default Import;
