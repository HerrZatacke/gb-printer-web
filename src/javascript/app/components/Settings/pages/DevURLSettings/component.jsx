import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SocketStateIndicator from '../../../SocketStateIndicator';
import { getEnv } from '../../../../../tools/getEnv';
import cleanUrl from '../../../../../tools/cleanUrl';

const DevURLSettings = (props) => {
  if (getEnv().env !== 'webpack-dev') {
    return null;
  }

  const [socketUrl, setSocketUrl] = useState(props.socketUrl);
  const [printerUrl, setPrinterUrl] = useState(props.printerUrl);

  return (
    <>
      <div className="inputgroup">
        <label htmlFor="settings-socket-url" className="inputgroup__label">
          Remote Socket URL
          <SocketStateIndicator />
        </label>
        <input
          id="settings-socket-url"
          className="settings__input"
          value={socketUrl}
          onChange={({ target }) => {
            setSocketUrl(target.value);
          }}
          onBlur={() => {
            setSocketUrl(cleanUrl(socketUrl, 'ws'));
          }}
          onKeyUp={(ev) => {
            switch (ev.key) {
              case 'Enter':
                setSocketUrl(cleanUrl(socketUrl, 'ws'));
                break;
              case 'Escape':
                setSocketUrl(props.socketUrl);
                break;
              default:
            }
          }}
        />
        <button
          type="button"
          className="button"
          onClick={() => {
            props.updateSocketUrl(cleanUrl(socketUrl, 'ws'));
          }}
        >
          Connect
        </button>
      </div>
      <div className="inputgroup">
        <label htmlFor="settings-printer-url" className="inputgroup__label">
          Printer URL
        </label>
        <input
          id="settings-printer-url"
          className="settings__input"
          value={printerUrl}
          onChange={({ target }) => {
            setPrinterUrl(target.value);
          }}
          onBlur={() => {
            setPrinterUrl(cleanUrl(printerUrl, 'http'));
            props.updatePrinterUrl(printerUrl);
          }}
          onKeyUp={(ev) => {
            switch (ev.key) {
              case 'Enter':
                setPrinterUrl(cleanUrl(printerUrl, 'http'));
                props.updatePrinterUrl(printerUrl);
                break;
              case 'Escape':
                setPrinterUrl(props.printerUrl);
                break;
              default:
            }
          }}
        />
      </div>
    </>
  );
};

DevURLSettings.propTypes = {
  printerUrl: PropTypes.string.isRequired,
  socketUrl: PropTypes.string.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
  updatePrinterUrl: PropTypes.func.isRequired,
};

DevURLSettings.defaultProps = {};

export default DevURLSettings;
