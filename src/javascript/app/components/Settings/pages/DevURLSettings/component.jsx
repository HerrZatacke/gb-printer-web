import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SocketStateIndicator from '../../../SocketStateIndicator';
import { getEnv } from '../../../../../tools/getEnv';
import cleanUrl from '../../../../../tools/cleanUrl';
import Input from '../../../Input';

const DevURLSettings = (props) => {
  if (getEnv().env !== 'webpack-dev') {
    return null;
  }

  const [socketUrl, setSocketUrl] = useState(props.socketUrl);
  const [printerUrl, setPrinterUrl] = useState(props.printerUrl);

  return (
    <>
      <Input
        id="settings-socket-url"
        labelText="Remote Socket URL"
        type="text"
        value={socketUrl}
        onChange={(value) => {
          setSocketUrl(value);
        }}
        onBlur={() => {
          setSocketUrl(cleanUrl(socketUrl, 'ws'));
        }}
        onKeyUp={(key) => {
          switch (key) {
            case 'Enter':
              setSocketUrl(cleanUrl(socketUrl, 'ws'));
              break;
            case 'Escape':
              setSocketUrl(props.socketUrl);
              break;
            default:
          }
        }}
        buttonLabel="Connect"
        buttonOnClick={() => {
          props.updateSocketUrl(cleanUrl(socketUrl, 'ws'));
        }}
      >
        <SocketStateIndicator />
      </Input>

      <Input
        id="settings-socket-url"
        labelText="Printer URL"
        type="text"
        value={printerUrl}
        onChange={(value) => {
          setPrinterUrl(value);
        }}
        onBlur={() => {
          setPrinterUrl(cleanUrl(printerUrl, 'http'));
          props.updatePrinterUrl(printerUrl);
        }}
        onKeyUp={(key) => {
          switch (key) {
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
