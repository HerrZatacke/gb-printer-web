import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const SocketStateIndicator = (props) => (
  <div className={
    classnames('socketstate-indicator', {
      'socketstate-indicator--closed': props.socketState === WebSocket.CLOSED,
      'socketstate-indicator--closing': props.socketState === WebSocket.CLOSING,
      'socketstate-indicator--open': props.socketState === WebSocket.OPEN,
      'socketstate-indicator--connecting': props.socketState === WebSocket.CONNECTING,
    })
  }
  />
);

SocketStateIndicator.propTypes = {
  socketState: PropTypes.number.isRequired,
};

SocketStateIndicator.defaultProps = {
};

export default SocketStateIndicator;
