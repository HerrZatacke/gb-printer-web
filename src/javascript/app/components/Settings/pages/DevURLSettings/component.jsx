import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SocketStateIndicator from '../../../SocketStateIndicator';
import { getEnv } from '../../../../../tools/getEnv';
import cleanUrl from '../../../../../tools/cleanUrl';
import Input from '../../../Input';

const DevURLSettings = (props) => {

  const [socketUrl, setSocketUrl] = useState(props.socketUrl);

  if (getEnv().env !== 'webpack-dev') {
    return null;
  }

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
    </>
  );
};

DevURLSettings.propTypes = {
  socketUrl: PropTypes.string.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
};

DevURLSettings.defaultProps = {};

export default DevURLSettings;
