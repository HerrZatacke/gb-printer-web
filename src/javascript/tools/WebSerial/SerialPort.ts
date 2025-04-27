import EventEmitter from 'events';

interface Options {
  device: SerialPort,
  baudRate: number,
}

class SerialPortEE extends EventEmitter {
  private device: SerialPort;
  private baudRate: number;
  private usbProductId: number | undefined;
  private usbVendorId: number | undefined;
  private reader: ReadableStreamDefaultReader | null;

  private dataBuffer: string[];
  private dataBufferTimeout: number | undefined;

  constructor({ device, baudRate }: Options) {
    super();
    this.device = device;
    this.baudRate = baudRate;
    const { usbProductId, usbVendorId } = device.getInfo();
    this.usbProductId = usbProductId;
    this.usbVendorId = usbVendorId;
    this.reader = null;
    this.dataBuffer = [];
    this.dataBufferTimeout = undefined;
  }

  connect() {

    return this.device.open({ baudRate: this.baudRate })
      .then(() => {
        // const textDecoder = new window.TextDecoderStream();
        // this.device.readable.pipeTo(textDecoder.writable);
        // this.reader = textDecoder.readable.getReader();
        this.reader = this.device.readable.getReader();
        this.readLoop();
      });

  }

  // readLoop() {
  //   this.reader?.read()
  //     .then(({ value }) => {
  //       this.emit('data', value);
  //       this.readLoop();
  //     })
  //     .catch((error) => {
  //       this.emit('error', error);
  //     });
  // }

  readLoop() {
    if (!this.reader) {
      throw new Error('no reader!');
    }

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


  send(data: string) {
    const writer = this.device.writable.getWriter();

    const bytes = new Uint8Array([...data].map((char) => (
      char.charCodeAt(0)
    )));

    return writer.write(bytes)
      .then(() => {
        writer.releaseLock();
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
  //
  // send(data) {
  //   console.warn('not implemented yet', data);
  // }
}

export default SerialPortEE;
