'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import ConnectPrinter from '@/components/ConnectPrinter';
import PrinterReport from '@/components/PrinterReport';
import { ExportTypes } from '@/consts/exportTypes';
import { useGBXCart } from '@/hooks/useGBXCart';
import { useImport } from './useImport';

function Import() {
  const [text, setText] = useState('');

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
          title="Select file(s) to import"
        >
          Select file(s) to import
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
              title="Import memory (RAM) from Cartridge Reader"
              disabled={busy}
            >
              Import memory from Cartridge Reader
            </Button>
            <Button
              onClick={readPhotoRom}
              disabled={!canReadPhotoRom || busy}
              title="Import Album Rolls from Photo! (ROM + Flash)"
            >
              Import Album Rolls from Photo!(ROM + Flash)
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
          label="Enter data received through your serial monitor"
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
            Import
          </Button>
        </Stack>
      </Stack>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.IMAGES)}
          title="Export images"
        >
          Export images
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.SELECTED_IMAGES)}
          title="Export selected images"
        >
          Export selected images
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.PALETTES)}
          title="Export palettes"
        >
          Export palettes
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

export default Import;
