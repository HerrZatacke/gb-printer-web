import EventEmitter from 'events';
import SerialPortEE from './SerialPort';

class WebSerialEE extends EventEmitter {
  private enabled: boolean;
  private activePorts: SerialPortEE[];
  private baudRate: number;

  constructor() {
    super();
    this.enabled = !!navigator.serial && !!window.TextDecoderStream;
    this.activePorts = [];
    this.baudRate = 115200;

    // instantly connect to known existing ports
    this.watchPorts();
  }

  // lists existing/known ports
  getPorts(): Promise<SerialPortEE[]> {
    if (!this.enabled) {
      return Promise.resolve([]);
    }

    return navigator.serial.getPorts()
      .then((devices) => (
        devices
          .filter(({ readable }) => !readable) // opened devices have a ReadableStream as device.readable
          .map((device) => (
            new SerialPortEE({
              device,
              baudRate: this.baudRate,
            })
          ))
      ));
  }

  getActivePorts(): SerialPortEE[] {
    return this.activePorts;
  }

  watchPorts() {
    window.setInterval(() => {
      this.getPorts()
        .then((ports) => {
          ports
            .forEach((port: SerialPortEE) => {
              port.addListener('error', (error) => {
                console.warn(error);
                this.activePorts = this.activePorts
                  .filter((activePort: SerialPortEE) => (
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
                })
                .catch(() => { /* silence! */ });
            });
        });
    }, 1000);
  }

  // returns a list of devices
  requestPort() {
    if (!this.enabled) {
      return;
    }

    navigator.serial.requestPort()
      .then((device: SerialPort) => {
        if (device.readable) { // opened devices have a ReadableStream as device.readable
          throw new Error('device already opened');
        }

        return new SerialPortEE({
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

export default new WebSerialEE();
