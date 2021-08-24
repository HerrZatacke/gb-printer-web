import EventEmitter from 'events';

class SerialPort extends EventEmitter {
  constructor({ device, baudRate }) {
    super();
    this.device = device;
    this.baudRate = baudRate;
    this.reader = null;
  }

  connect() {
    const readLoop = () => {
      this.reader.read()
        .then(({ value }) => {

          this.emit('data', value);
          readLoop();
        })
        .catch((error) => {
          this.emit('error', error);
        });
    };

    return this.device.open({ baudRate: this.baudRate })
      .then(() => {
        const textDecoder = new window.TextDecoderStream();
        this.device.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable.getReader();
        readLoop();
      });

  }
}

export const baudRates = [2400, 4800, 9600, 19200, 28800, 38400, 57600, 76800, 115200, 230400, 460800, 576000, 921600];

export default SerialPort;
