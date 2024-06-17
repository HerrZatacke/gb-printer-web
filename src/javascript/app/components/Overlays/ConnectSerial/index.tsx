import React from 'react';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../../Lightbox';
import useWithStore from './hooks/useWithStore';

import './index.scss';

interface Props {
  inline?: boolean,
  passive?: boolean,
}

const ConnectSerial = ({ inline, passive }: Props) => {
  const title = 'WebUSB Serial devices';

  const {
    activePorts: usbSerialActivePorts,
    isReceiving: usbSerialIsReceiving,
    webUSBEnabled,
    openWebUSBSerial,
  } = useWebUSBSerial(passive || false);

  const {
    activePorts: webSerialActivePorts,
    isReceiving: webSerialIsReceiving,
    webSerialEnabled,
    openWebSerial,
  } = useWebSerial(passive || false);

  const {
    lightBoxOpen,
    hideSerials,
  } = useWithStore();


  const content = (
    <div className="connect-usb-serial-overlay__content">
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
        <h4>
          {`Connected devices (${usbSerialActivePorts.length}):`}
        </h4>
        <ul>
          {usbSerialActivePorts.map(({ productName }, index) => <li key={index}>{productName}</li>)}
        </ul>
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
    </div>
  );

  if (inline) {
    return content;
  }

  const showOverlay = lightBoxOpen || usbSerialIsReceiving || webSerialIsReceiving;

  return !showOverlay ? null : (
    <Lightbox
      header="WebUSB / Serial devices"
      confirm={hideSerials}
      canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
      className="connect-usb-serial-overlay"
    >
      {content}
    </Lightbox>
  );
};

export default ConnectSerial;
