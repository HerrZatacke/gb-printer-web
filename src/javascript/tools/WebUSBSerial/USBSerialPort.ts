/*!
  Port function taken from here
  https://github.com/webusb/arduino/blob/gh-pages/demos/serial.js
 */

import EventEmitter from 'events';

class USBSerialPortEE extends EventEmitter {
  private device: USBDevice;
  private manufacturerName: string;
  private productName: string;
  private serialNumber: string;
  private interfaceNumber: number;
  private endpointIn: number;
  private endpointOut: number;
  private textDecoder: TextDecoder;

  constructor(device: USBDevice) {
    super();
    this.device = device;
    this.manufacturerName = device.manufacturerName || '';
    this.productName = device.productName || '';
    this.serialNumber = device.serialNumber || '';

    this.interfaceNumber = 2; // original interface number of WebUSB Arduino demo
    this.endpointIn = 5; // original in endpoint ID of WebUSB Arduino demo
    this.endpointOut = 4; // original out endpoint ID of WebUSB Arduino demo

    this.textDecoder = new TextDecoder();
  }

  connect() {
    const readLoop = () => {
      this.device.transferIn(this.endpointIn, 64)
        .then((result) => {
          this.emit('data', this.textDecoder.decode(result.data));
          readLoop();
        })
        .catch((error) => {
          this.emit('error', error);
        });
    };

    return this.device.open()
      .then(() => (
        this.device?.selectConfiguration?.(1)
      ))
      .then(() => {
        const configurationInterfaces = this.device.configuration?.interfaces;
        if (!configurationInterfaces) {
          return;
        }

        configurationInterfaces.forEach((element) => {
          element.alternates.forEach((elementalt) => {
            if (elementalt.interfaceClass === 0xff) {
              this.interfaceNumber = element.interfaceNumber;
              elementalt.endpoints.forEach((elementendpoint) => {
                if (elementendpoint.direction === 'out') {
                  this.endpointOut = elementendpoint.endpointNumber;
                }

                if (elementendpoint.direction === 'in') {
                  this.endpointIn = elementendpoint.endpointNumber;
                }
              });
            }
          });
        });
      })
      .then(() => this.device.claimInterface(this.interfaceNumber))
      .then(() => this.device.selectAlternateInterface(this.interfaceNumber, 0))
      // The vendor-specific interface provided by a device using this
      // Arduino library is a copy of the normal Arduino USB CDC-ACM
      // interface implementation and so reuses some requests defined by
      // that specification. This request sets the DTR (data terminal
      // ready) signal high to indicate to the device that the host is
      // ready to send and receive data.
      .then(() => this.device.controlTransferOut({ requestType: 'class',
        recipient: 'interface',
        request: 0x22,
        value: 0x01,
        index: this.interfaceNumber }))
      .then(() => {
        readLoop();
      });
  }

  disconnect() {
    // This request sets the DTR (data terminal ready) signal low to
    // indicate to the device that the host has disconnected.
    return this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber,
    })
      .then(() => this.device.close());
  }

  send(data: BufferSource) {
    return this.device.transferOut(this.endpointOut, data);
  }
}

export default USBSerialPortEE;
