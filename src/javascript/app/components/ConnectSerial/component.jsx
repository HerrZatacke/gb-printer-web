import React, { useState } from 'react';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../Lightbox';
import SVG from '../SVG';

const ConnectSerial = () => {
  const title = 'WebUSB Serial devices';

  const [lightBoxOpen, setLightBoxOpen] = useState(false);

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

  const showOverlay = lightBoxOpen || usbSerialIsReceiving || webSerialIsReceiving;

  return (
    <>
      <button
        title={title}
        type="button"
        className="connect-usb-serial navigation__link"
        disabled={!webUSBEnabled && !webSerialEnabled}
        onClick={() => setLightBoxOpen(true)}
      >
        <SVG name="usb" />
        <span className="connect-usb-serial__title">
          {title}
        </span>
      </button>
      {!showOverlay ? null : (
        <Lightbox
          header="WebUSB / Serial devices"
          confirm={() => setLightBoxOpen(false)}
          canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
          className="connect-usb-serial-overlay"
        >
          <button
            type="button"
            className={classnames('connect-usb-serial-overlay__button button', {
              'connect-usb-serial--is-receiving': usbSerialIsReceiving,
              'connect-usb-serial--disabled': !webUSBEnabled,
            })}
            title={title}
            onClick={openWebUSBSerial}
            disabled={!webUSBEnabled}
          >
            Open WebUSB device
          </button>
          <div
            className="connect-usb-serial-overlay__info connect-usb-serial-overlay__info--spaced"
          >
            {`${usbSerialActivePorts.length} devices connected`}
          </div>
          <button
            type="button"
            className={classnames('connect-usb-serial-overlay__button button', {
              'connect-usb-serial-overlay__button--is-receiving': webSerialIsReceiving,
              'connect-usb-serial-overlay__button--disabled': !webSerialEnabled,
            })}
            title={title}
            onClick={openWebSerial}
            disabled={!webSerialEnabled}
          >
            Open Web Serial device
          </button>
          <div
            className="connect-usb-serial-overlay__info"
          >
            {`${webSerialActivePorts.length} devices connected`}
          </div>
        </Lightbox>
      )}
    </>
  );
};

export default ConnectSerial;
