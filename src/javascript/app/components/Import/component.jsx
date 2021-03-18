import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConnectPrinter from './ConnectPrinter';
import Input from '../Input';

const Import = ({
  importPlainText,
  importFile,
  printerUrl,
  printerConnected,
  exportJson,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        setText(dummyContent.join('\n'));
      });
  }, []);

  return (
    <div className="import">

      {printerUrl && (
        <ConnectPrinter
          printerUrl={printerUrl}
          printerConnected={printerConnected}
        />
      )}

      <Input
        id="import-file"
        labelText="Select file for import"
        type="file"
        onChange={(files) => {
          if (files && files.length === 1) {
            importFile({ files });
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
      <div className="inputgroup buttongroup">
        <button
          type="button"
          className="button"
          onClick={() => exportJson('images')}
        >
          Export images
        </button>
        <button
          type="button"
          className="button"
          onClick={() => exportJson('selected_images')}
        >
          Export selected images
        </button>
        <button
          type="button"
          className="button"
          onClick={() => exportJson('frames')}
        >
          Export frames
        </button>
        <button
          type="button"
          className="button"
          onClick={() => exportJson('palettes')}
        >
          Export palettes
        </button>
      </div>
    </div>
  );
};

Import.propTypes = {
  printerUrl: PropTypes.string,
  printerConnected: PropTypes.bool.isRequired,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
};

Import.defaultProps = {
  printerUrl: null,
};

export default Import;
