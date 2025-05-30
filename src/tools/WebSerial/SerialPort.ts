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

  constructor({ device, baudRate }: Options) {
    super();
    this.device = device;
    this.baudRate = baudRate;
    const { usbProductId, usbVendorId } = device.getInfo();
    this.usbProductId = usbProductId;
    this.usbVendorId = usbVendorId;
    this.reader = null;
  }

  connect() {
    const readLoop = () => {
      this.reader?.read()
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
