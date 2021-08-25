import React from 'react';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../../Lightbox';
import useContainer from './hooks/useContainer';

const ConnectSerial = () => {
  const title = 'WebUSB Serial devices';

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

  const {
    lightBoxOpen,
    setHideSerials,
  } = useContainer();

  const showOverlay = lightBoxOpen || usbSerialIsReceiving || webSerialIsReceiving;

  return !showOverlay ? null : (
    <Lightbox
      header="WebUSB / Serial devices"
      confirm={() => setHideSerials()}
      canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
      className="connect-usb-serial-overlay"
    >
      <button
        type="button"
        className={classnames('connect-usb-serial-overlay__button button', {
          'connect-usb-serial-overlay__button--is-receiving': usbSerialIsReceiving,
          'connect-usb-serial-overlay__button--disabled': !webUSBEnabled,
        })}
        title={title}
        onClick={openWebUSBSerial}
        disabled={!webUSBEnabled || usbSerialIsReceiving}
      >
        Open WebUSB device
        {usbSerialIsReceiving ? ' (receiving)' : null}
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
        disabled={!webSerialEnabled || webSerialIsReceiving}
      >
        Open Web Serial device
        {webSerialIsReceiving ? ' (receiving)' : null}
      </button>
      <div
        className="connect-usb-serial-overlay__info"
      >
        {`${webSerialActivePorts.length} devices connected`}
      </div>
    </Lightbox>
  );
};

export default ConnectSerial;
