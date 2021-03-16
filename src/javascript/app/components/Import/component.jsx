import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PrinterReport from '../PrinterReport';
import { getEnv } from '../../../tools/getEnv';
import Input from '../Input';

const printerIsSameProtocol = (printerUrl) => {
  const { protocol: printerProtocol } = new URL(printerUrl);
  const { protocol: ownProtocol } = new URL(window.location.href);
  return ownProtocol === printerProtocol;
};

const Import = ({
  importPlainText,
  importFile,
  checkPrinter,
  dumpCount,
  printerUrl,
  downloadPrinter,
  clearPrinter,
  exportJson,
}) => {
  const [text, setText] = useState('');
  const { env } = getEnv();

  useEffect(() => {
    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        setText(dummyContent.join('\n'));
      });
  }, []);

  return (
    <div className="import">
      {/* eslint-disable-next-line no-nested-ternary */}
      {!printerUrl ? null : (
        printerIsSameProtocol(printerUrl) ? (
          <iframe
            title="Transfer window"
            src={printerUrl}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              window.open(printerUrl, 'remoteprinter', 'width=400,height=800');
            }}
          >
            Open printer page
          </button>
        )
      )}

      {(env !== 'esp8266') ? null : (
        <div className="inputgroup buttongroup">
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
  dumpCount: PropTypes.number.isRequired,
  printerUrl: PropTypes.string,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  checkPrinter: PropTypes.func.isRequired,
  downloadPrinter: PropTypes.func.isRequired,
  clearPrinter: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
};

Import.defaultProps = {
  printerUrl: null,
};

export default Import;
