import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../Input';
import SVG from '../SVG';

const iframeSupported = (printerUrl) => {
  if (printerUrl.startsWith('/')) {
    return true;
  }

  const { protocol: printerProtocol } = new URL(printerUrl);
  const { protocol: ownProtocol } = new URL(window.location.href);
  return ownProtocol === 'http:' || ownProtocol === printerProtocol;
};

const Import = ({
  importPlainText,
  importFile,
  printerUrl,
  printerConnected,
  exportJson,
  frameHeight,
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
      {/* eslint-disable-next-line no-nested-ternary */}
      {!printerUrl ? null : (
        iframeSupported(printerUrl) ? (
          <>
            <iframe
              style={{ height: `${frameHeight}px` }}
              scrolling="no"
              className={classnames('import__remote-printer-iframe', {
                'import__remote-printer-iframe--connected': printerConnected,
              })}
              title="Transfer window"
              src={printerUrl}
            />
            {
              printerConnected ? null : (
                <div
                  className="import__loader"
                />
              )
            }
          </>
        ) : (
          <div className="inputgroup buttongroup">
            <button
              type="button"
              className="button import__connection-button"
              onClick={() => {
                window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
              }}
            >
              <SVG
                name="plug"
                className={classnames('import__connection-icon', {
                  'import__connection-icon--connected': printerConnected,
                })}
              />
              <span
                className="import__connection-text"
              >
                {printerConnected ? 'Switch to printer page' : 'Open printer page'}
              </span>
            </button>
          </div>
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
  frameHeight: PropTypes.number.isRequired,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
};

Import.defaultProps = {
  printerUrl: null,
};

export default Import;
