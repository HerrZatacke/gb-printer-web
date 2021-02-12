import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PrinterReport from '../PrinterReport';
import { getEnv } from '../../../tools/getEnv';

const Import = ({
  importPlainText,
  importFile,
  checkPrinter,
  dumpCount,
  downloadPrinter,
  clearPrinter,
  exportJson,
}) => {
  const [text, setText] = useState('');
  const [env, setEnv] = useState('');

  useEffect(() => {
    setEnv(getEnv());

    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        setText(dummyContent.join('\n'));
      });
  }, []);

  return (
    <div className="import">
      {(env && env.env !== 'esp8266') ? null : (
        <div className="import__inputgroup buttongroup">
          <button
            type="button"
            className="button"
            onClick={checkPrinter}
          >
            Check Printer
          </button>
          <button
            type="button"
            className="button"
            disabled={dumpCount === 0}
            onClick={downloadPrinter}
          >
            {`Download ${dumpCount || ''} Dumps`}
          </button>
          <button
            type="button"
            className="button"
            disabled={dumpCount === 0}
            onClick={clearPrinter}
          >
            Clear Printer
          </button>
        </div>
      )}
      <PrinterReport />
      <div className="import__inputgroup">
        <label htmlFor="import-file" className="import__label">
          Select file for import
        </label>
        <input
          id="import-file"
          className="import__input"
          type="file"
          onChange={({ target }) => {
            if (target.files && target.files.length === 1) {
              importFile(target);
            }
          }}
        />
        <label
          htmlFor="import-file"
          className="import__button import__button--label"
        >
          Select
        </label>
      </div>
      <div className="import__inputgroup import__inputgroup--column">
        <label htmlFor="import-plaintext" className="import__label">
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
          className="import__button"
          type="button"
          onClick={() => {
            importPlainText(text);
          }}
        >
          Import
        </button>
      </div>
      <div className="import__inputgroup buttongroup">
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
          onClick={() => exportJson('frames')}
        >
          Export frames
        </button>
      </div>
    </div>
  );
};

Import.propTypes = {
  dumpCount: PropTypes.number.isRequired,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  checkPrinter: PropTypes.func.isRequired,
  downloadPrinter: PropTypes.func.isRequired,
  clearPrinter: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
};

Import.defaultProps = {};

export default Import;
