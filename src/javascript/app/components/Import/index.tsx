import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ConnectPrinter from '../ConnectPrinter';
import Input, { InputType } from '../Input';
import { useImport } from './useImport';
import { ExportTypes } from '../../../consts/exportTypes';

import './index.scss';

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
    <div className="import">

      {printerUrl && (
        <ConnectPrinter />
      )}

      <Input
        id="import-file"
        labelText="Select file for import"
        type={InputType.FILE}
        onChangeFiles={(files) => {
          if (files && files.length) {
            importFiles(files);
          }
        }}
      />

      <div className="inputgroup inputgroup--column">
        <label htmlFor="import-plaintext" className="inputgroup__label">
          Paste your plaintext
        </label>
        <textarea
          id="import-plaintext"
          className="import__data"
          value={text}
          onChange={({ target }) => {
            setText(target.value);
          }}
        />
        <button
          className="button button--label"
          type="button"
          onClick={() => {
            importPlainText(text);
          }}
        >
          Import
        </button>
      </div>
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
    </div>
  );
}

export default Import;
