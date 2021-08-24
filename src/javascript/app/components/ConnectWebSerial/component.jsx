import React from 'react';
import classnames from 'classnames';
import useWebSerial from './hooks/useWebSerial';
import SVG from '../SVG';

const ConnectWebSerial = () => {

  const {
    webSerialEnabled,
    openWebSerial,
    isReceiving,
  } = useWebSerial();

  const title = 'Web Serial devices';

  return (
    <button
      type="button"
      className={classnames('connect-usb-serial navigation__link', {
        'connect-usb-serial--is-receiving': isReceiving,
        'connect-usb-serial--disabled': !webSerialEnabled,
      })}
      title={title}
      onClick={openWebSerial}
      disabled={!webSerialEnabled}
    >
      <SVG name="usb" />
      <span className="connect-usb-serial__title">
        {title}
      </span>
    </button>
  );
};

export default ConnectWebSerial;
