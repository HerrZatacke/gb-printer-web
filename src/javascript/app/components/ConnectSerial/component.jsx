import React, { useState } from 'react';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../Lightbox';
import SVG from '../SVG';

const ConnectSerial = () => {
  const title = 'WebUSB Serial devices';

  const [showOverlay, setShowOverlay] = useState(true);

  const {
    activePorts: usbSerialActivePorts,
    isReceiving: usbSerialIsReceiving,
    webUSBEnabled,
    openWebUSBSerial,
  } = useWebUSBSerial();

  const {
    activePorts: webSerialActivePorts,
    isReceiving: webSerialIsReceiving,
    webSerialEnabled,
    openWebSerial,
  } = useWebSerial();

  return (
    <>
      <button
        title={title}
        type="button"
        className={classnames('connect-usb-serial navigation__link', {
          'connect-usb-serial--is-receiving': usbSerialIsReceiving || webSerialIsReceiving,
          'connect-usb-serial--disabled': !webUSBEnabled && !webSerialEnabled,
        })}
        disabled={!webUSBEnabled && !webSerialEnabled}
        onClick={() => setShowOverlay(true)}
      >
        <SVG name="usb" />
        <span className="connect-usb-serial__title">
          {title}
        </span>
      </button>
      {!showOverlay ? null : (
        <Lightbox
          header="WebUSB / Serial devices"
          confirm={() => setShowOverlay(false)}
        >
          <button
            type="button"
            title={title}
            onClick={openWebUSBSerial}
            disabled={!webUSBEnabled}
          >
            Open WebUSB device
          </button>
          <ul>
            {usbSerialActivePorts.map((port, index) => (
              <li key={index}>
                {`${index + 1}. ${port}`}
              </li>
            ))}
          </ul>
          <hr />
          <button
            type="button"
            title={title}
            onClick={openWebSerial}
            disabled={!webSerialEnabled}
          >
            Open Web Serial device
          </button>
          <ul>
            {webSerialActivePorts.map((port, index) => (
              <li key={index}>
                {`${index + 1}. ${port}`}
              </li>
            ))}
          </ul>
        </Lightbox>
      )}
    </>
  );
};

export default ConnectSerial;
