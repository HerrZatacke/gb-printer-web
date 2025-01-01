import React from 'react';
import { Link } from 'react-router-dom';
import ConnectSerial from '../Overlays/ConnectSerial';
import EnableWebUSB from './EnableWebUSB';
import useSettingsStore from '../../stores/settingsStore';
import WebSerial from '../../../tools/WebSerial';
import WebUSBSerial from '../../../tools/WebUSBSerial';

import './index.scss';

function WebUSBGreeting() {
  const { useSerials } = useSettingsStore();

  return (
    <>
      <EnableWebUSB />
      {!useSerials ? null : (
        <>
          <ConnectSerial inline passive />
          <div className="usb-greeting">
            <p>
              {'After connecting a USB (or serial) device, you can continue to the '}
              <Link to="/gallery">Gallery Page</Link>
              {' or '}
              <Link to="/">Home Page</Link>
              {' now.'}
            </p>
            <p>
              {'An overlay will appear once you\'re receiving data.'}
            </p>
            <p>
              {'You can also access these options via the USB-Symbol in the navigation and the '}
              <Link to="/settings/generic">Settings Page</Link>
              {' .'}
            </p>
            <p>
              <strong>
                Note: WebUSB and Web Serial are similar but not the same:
              </strong>
            </p>
            <p>
              {'While Web Serial has access to a regular COM-port and does not require special devices, the feature is not available on mobile devices. '}
              <br />
              <span className={WebSerial.enabled ? 'usb-greeting--supported' : 'usb-greeting--not-supported'}>
                {WebSerial.enabled ? 'Your current device does support Web Serial' : 'Your current device does not support Web Serial'}
              </span>
            </p>
            <p>
              {'WebUSB requires certain microcontrollers where the processor has direct access to the USB interface (e.g. an Arduino Leonardo). '}
              <a href="https://github.com/webusb/arduino">See webusb for arduino on GitHub for more information</a>
              .
              <br />
              <span className={WebUSBSerial.enabled ? 'usb-greeting--supported' : 'usb-greeting--not-supported'}>
                {WebUSBSerial.enabled ? 'Your current device does support WebUSB' : 'Your current device does not support WebUSB'}
              </span>
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default WebUSBGreeting;
