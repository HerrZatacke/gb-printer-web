import EventEmitter from 'events';
import SerialPort from './SerialPort';

class WebSerial extends EventEmitter {
  constructor() {
    super();
    this.enabled = !!navigator.serial && !!window.TextDecoderStream;
    this.activePorts = [];
    this.baudRate = 115200;

    // instantly connect to known existing ports
    this.watchPorts();
  }

  // lists existing/known ports
  getPorts() {
    return navigator.serial.getPorts()
      .then((devices) => (
        devices
          .filter(({ readable }) => !readable) // opened devices have a ReadableStream as device.readable
          .map((device) => (
            new SerialPort({
              device,
              baudRate: this.baudRate,
            })
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
    navigator.serial.requestPort()
      .then((device) => {
        if (device.readable) { // opened devices have a ReadableStream as device.readable
          throw new Error('device already opened');
        }

        return new SerialPort({
          device,
          baudRate: this.baudRate,
        });
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

export const baudRates = [2400, 4800, 9600, 19200, 28800, 38400, 57600, 76800, 115200, 230400, 460800, 576000, 921600];

export default new WebSerial();
