import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ConnectPrinter from '../ConnectPrinter';
import PrinterReport from '../PrinterReport';
import { useImport } from './useImport';
import { ExportTypes } from '../../../consts/exportTypes';

function Import() {
  const [text, setText] = useState('');

  const {
    importPlainText,
    importFiles,
    printerUrl,
    exportJson,
  } = useImport();

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

      <Button
        component="label"
        variant="contained"
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
        >
          Export images
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.SELECTED_IMAGES)}
        >
          Export selected images
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.PALETTES)}
        >
          Export palettes
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

export default Import;
