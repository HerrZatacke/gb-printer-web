import EventEmitter from 'events';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { SettingsCallbackFn } from '@/types/ports';
import CommonSerialPort from './SerialPort';

class WebSerialEE extends EventEmitter {
  public enabled: boolean;
  // private activePorts: CommonSerialPort[];
  private settingsCallbackFn: SettingsCallbackFn | null = null;

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.serial &&
      !!TextDecoderStream;
    // this.activePorts = [];
  }

  // getActivePorts(): CommonSerialPort[] {
  //   return this.activePorts;
  // }

  // getWorkerPorts(): WorkerPort[] {
  //   const ports = this.getActivePorts();
  //   return ports.map((commonSerialPort): WorkerPort => ({
  //     id: commonSerialPort.getId(),
  //     description: `${commonSerialPort.getBaudRate()} baud`,
  //     portDeviceType: commonSerialPort.getPortDeviceType(),
  //   }));
  // }

  private async initDevice(device: SerialPort): Promise<CaptureCommsDevice | null> {
    if (device.readable) { return null; } // opened devices have a ReadableStream as device.readable

    if (!this.settingsCallbackFn) { return null; } // Must be able to query for baudrate

    const port = new CommonSerialPort(device, this.settingsCallbackFn);

    const newApi = await port.connect();

    if (!newApi) {
      return null;
    }

    // port.addListener('errormessage', (errorMessage: string) => {
    //   this.emit('errormessage', errorMessage);
    // });

    // port.addListener('data', (readResult: ReadResult) => {
    //   this.emit('data', readResult);
    // });
    //
    // port.addListener('receiving', () => {
    //   this.emit('receiving', port.getPortDeviceType());
    // });

    return newApi;
  }

  public async initPorts(
    addApi: (device: CaptureCommsDevice) => void,
    removePort: (device: SerialPort) => void,
    settingsCallbackFn: SettingsCallbackFn,
  ): Promise<void> {
    if (!this.enabled) { return; }

    this.settingsCallbackFn = settingsCallbackFn;

    const ports = await navigator.serial.getPorts();

    for (const port of ports) {
      const api = await this.initDevice(port);
      if (api) {
        addApi(api);
      }
    }

    // Add listener to setup future devices
    navigator.serial.addEventListener('connect', async (event: Event) => {
      const newApi = await this.initDevice(event.target as SerialPort);
      if (newApi) {
        addApi(newApi);
      }
    });

    navigator.serial.addEventListener('disconnect', (event) => {
      const oldPort = event.target as SerialPort;
      removePort(oldPort);
    });
  }
}

const instance = new WebSerialEE();
export default instance;
