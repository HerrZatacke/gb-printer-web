import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import useWebUSBSerial from './hooks/useWebUSBSerial';
import useWebSerial from './hooks/useWebSerial';
import Lightbox from '../../Lightbox';
import useContainer from './hooks/useContainer';

const ConnectSerial = ({ inline, passive }) => {
  const title = 'WebUSB Serial devices';

  const {
    activePorts: usbSerialActivePorts,
    isReceiving: usbSerialIsReceiving,
    webUSBEnabled,
    openWebUSBSerial,
  } = useWebUSBSerial(passive);

  const {
    activePorts: webSerialActivePorts,
    isReceiving: webSerialIsReceiving,
    webSerialEnabled,
    openWebSerial,
    setModeDMG,
    setModeGBA,
  } = useWebSerial(passive);

  const {
    lightBoxOpen,
    setHideSerials,
  } = useContainer();


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
      <button
        type="button"
        onClick={setModeGBA}
      >
        Mode: GBA
      </button>
      <button
        type="button"
        onClick={setModeDMG}
      >
        Mode: DMG
      </button>
    </div>
  );

  if (inline) {
    return content;
  }

  const showOverlay = lightBoxOpen || usbSerialIsReceiving || webSerialIsReceiving;

  return !showOverlay ? null : (
    <Lightbox
      header="WebUSB / Serial devices"
      confirm={() => setHideSerials()}
      canConfirm={!usbSerialIsReceiving && !webSerialIsReceiving}
      className="connect-usb-serial-overlay"
    >
      {content}
    </Lightbox>
  );
};

ConnectSerial.propTypes = {
  inline: PropTypes.bool,
  passive: PropTypes.bool,
};

ConnectSerial.defaultProps = {
  inline: false,
  passive: false,
};

export default ConnectSerial;
