import EventEmitter from 'events';
import USBSerialPort from './USBSerialPort';

class WebUSBSerial extends EventEmitter {
  constructor() {
    super();
    this.enabled = !!navigator.usb && !!navigator.usb.getDevices;
    this.activePorts = [];

    // instantly connect to known existing ports
    this.watchPorts();
  }

  // lists existing/known ports
  getPorts() {
    if (!this.enabled) {
      return Promise.resolve([]);
    }

    return navigator.usb.getDevices()
      .then((devices) => (
        devices
          .filter(({ opened }) => !opened)
          .map((device) => (
            new USBSerialPort(device)
          ))
      ));
  }

  getActivePorts() {
    return this.activePorts;
  }

  watchPorts() {
    window.setInterval(() => {
      this.getPorts()
        .then((ports) => {
          ports
            .forEach((port) => {
              port.addListener('error', (error) => {
                console.warn(error);
                this.activePorts = this.activePorts
                  .filter((activePort) => (
                    activePort !== port
                  ));
                this.emit('activePortsChange', [...this.activePorts]);
              });

              port.addListener('data', (data) => {
                this.emit('data', data);
              });

              port.connect()
                .then(() => {
                  this.activePorts.push(port);
                  this.emit('activePortsChange', [...this.activePorts]);
                });
            });
        });
    }, 1000);
  }

  // returns a list of devices
  requestPort() {
    if (!this.enabled) {
      return;
    }

    const filters = [
      { vendorId: 0x2341, productId: 0x8036 }, // Arduino Leonardo
      { vendorId: 0x2341, productId: 0x8037 }, // Arduino Micro
      { vendorId: 0x2341, productId: 0x804d }, // Arduino/Genuino Zero
      { vendorId: 0x2341, productId: 0x804e }, // Arduino/Genuino MKR1000
      { vendorId: 0x2341, productId: 0x804f }, // Arduino MKRZERO
      { vendorId: 0x2341, productId: 0x8050 }, // Arduino MKR FOX 1200
      { vendorId: 0x2341, productId: 0x8052 }, // Arduino MKR GSM 1400
      { vendorId: 0x2341, productId: 0x8053 }, // Arduino MKR WAN 1300
      { vendorId: 0x2341, productId: 0x8054 }, // Arduino MKR WiFi 1010
      { vendorId: 0x2341, productId: 0x8055 }, // Arduino MKR NB 1500
      { vendorId: 0x2341, productId: 0x8056 }, // Arduino MKR Vidor 4000
      { vendorId: 0x2341, productId: 0x8057 }, // Arduino NANO 33 IoT
      { vendorId: 0x239A }, // Adafruit Boards!
    ];

    navigator.usb.requestDevice({ filters })
      .then((device) => {
        if (device.opened) {
          throw new Error('device already opened');
        }

        return new USBSerialPort(device);
      })
      .catch(() => null /* no device selected */)
      .then((port) => {
        if (port) {
          port.connect()
            .then(() => {
              this.activePorts.push(port);
              this.emit('activePortsChange', [...this.activePorts]);
            });
        }
      });
  }
}

export default new WebUSBSerial();
