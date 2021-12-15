import EventEmitter from 'events';

class SerialPort extends EventEmitter {
  constructor({ device, baudRate }) {
    super();
    this.device = device;
    this.baudRate = baudRate;
    const { usbProductId, usbVendorId } = device.getInfo();
    this.usbProductId = usbProductId;
    this.usbVendorId = usbVendorId;
    this.reader = null;

    this.dataBuffer = [];
    this.dataBufferTimeout = null;
  }

  connect() {

    return this.device.open({ baudRate: 1000000 })
    // return this.device.open({ baudRate: this.baudRate })
      .then(() => {
        // const textDecoder = new window.TextDecoderStream();
        // this.device.readable.pipeTo(textDecoder.writable);
        // this.reader = textDecoder.readable.getReader();
        this.reader = this.device.readable.getReader();
        this.readLoop();
      });

  }

  readLoop() {
    this.reader.read()
      .then(({ value }) => {
        this.dataBuffer.push(...value);

        window.clearTimeout(this.dataBufferTimeout);
        this.dataBufferTimeout = window.setTimeout(() => {
          try {
            // eslint-disable-next-line no-alert
            alert([...this.dataBuffer].join(','));
            // console.log([...value].map(String.fromCharCode).join(''));
          } catch (error) { /**/ }

          this.dataBuffer = [];
          // this.emit('data', value);
        }, 10);

        this.readLoop();
      })
      .catch((error) => {
        this.emit('error', error);
      });
  }

  // HOW !?!?!?
  // disconnect() {
  //   this.isClosing = true;
  //
  //   this.reader.cancel();
  //
  //   return this.reader.closed.then(() => {
  //     window.requestAnimationFrame(() => {
  //       this.reader.releaseLock();
  //       window.requestAnimationFrame(() => {
  //         this.device.readable.cancel();
  //         window.requestAnimationFrame(() => {
  //           this.device.close();
  //           this.emit('closed');
  //         });
  //       });
  //     });
  //
  //   });
  // }

  send(data) {
    const writer = this.device.writable.getWriter();

    const bytes = new Uint8Array([...data].map((char) => (
      char.charCodeAt(0)
    )));

    return writer.write(bytes)
      .then(() => {
        writer.releaseLock();
      });
  }
}

export default SerialPort;
