import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PrinterReport from '../PrinterReport';
import Input from '../Input';

const iframeSupported = (printerUrl) => {
  if (printerUrl.startsWith('/')) {
    return true;
  }

  const { protocol: printerProtocol } = new URL(printerUrl);
  const { protocol: ownProtocol } = new URL(window.location.href);
  return ownProtocol === 'http:' || ownProtocol === printerProtocol;
};

const functionLabels = {
  testFile: 'Print test image',
  checkPrinter: 'Check Printer',
  fetchImages: 'Fetch Images', // ToDo: Make formattable
  clearPrinter: 'Clear Printer',
};

const Import = ({
  importPlainText,
  importFile,
  printerUrl,
  printerConnected,
  exportJson,
  printerFunctions,
  callRemoteFunction,
  printerBusy,
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

      {!printerConnected ? null : (
        <>
          <div className="inputgroup buttongroup">
            {printerFunctions.map((name) => (
              <button
                key={name}
                type="button"
                className="button"
                // ToDo: Disable based on state.printerData
                disabled={printerBusy}
                onClick={() => callRemoteFunction(name)}
              >
                {functionLabels[name]}
              </button>
            ))}
          </div>

          <PrinterReport />
        </>
      )}

      {/* eslint-disable-next-line no-nested-ternary */}
      {!printerUrl ? null : (
        iframeSupported(printerUrl) ? (
          <iframe
            className={classnames('import__remote-printer-iframe', {
              'import__remote-printer-iframe--connected': printerConnected,
            })}
            title="Transfer window"
            src={printerUrl}
          />
        ) : (
          <>
            {printerConnected ? null : (
              <div className="inputgroup buttongroup">
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
                  }}
                >
                  Open printer page
                </button>
              </div>
            )}
          </>
        )
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
  printerBusy: PropTypes.bool.isRequired,
  printerFunctions: PropTypes.array.isRequired,
  callRemoteFunction: PropTypes.func.isRequired,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
};

Import.defaultProps = {
  printerUrl: null,
};

export default Import;
