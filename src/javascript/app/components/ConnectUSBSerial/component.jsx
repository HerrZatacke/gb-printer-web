import React from 'react';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import SVG from '../SVG';

const ConnectUSBSerial = () => {
  const title = 'WebUSB Serial devices';

  const {
    isReceiving,
    webUSBEnabled,
    openWebUSBSerial,
  } = useWebUSBSerial();

  return (
    <button
      type="button"
      className={classnames('connect-usb-serial navigation__link', {
        'connect-usb-serial--is-receiving': isReceiving,
        'connect-usb-serial--disabled': !webUSBEnabled,
      })}
      title={title}
      onClick={openWebUSBSerial}
      disabled={!webUSBEnabled}
    >
      <SVG name="usb" />
      <span className="connect-usb-serial__title">
        {title}
      </span>
    </button>
  );
};

export default ConnectUSBSerial;
