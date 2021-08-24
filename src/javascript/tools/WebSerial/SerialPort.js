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

  disconnect() {
    return this.device.close();
  }

  send(data) {
    console.warn('not implemented yet', data);
  }
}

export default SerialPort;
