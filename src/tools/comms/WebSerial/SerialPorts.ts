import EventEmitter from 'events';
import { ReadResult, SettingsCallbackFn, WorkerPort } from '@/types/ports';
import CommonSerialPort from './SerialPort';

class WebSerialEE extends EventEmitter {
  public enabled: boolean;
  private activePorts: CommonSerialPort[];
  private settingsCallbackFn: SettingsCallbackFn | null = null;

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.serial &&
      !!TextDecoderStream;
    this.activePorts = [];
  }

  getActivePorts(): CommonSerialPort[] {
    return this.activePorts;
  }

  getWorkerPorts(): WorkerPort[] {
    const ports = this.getActivePorts();
    return ports.map((commonSerialPort): WorkerPort => ({
      id: commonSerialPort.getId(),
      description: `${commonSerialPort.getBaudRate()} baud`,
      portDeviceType: commonSerialPort.getPortDeviceType(),
    }));
  }

  private async initDevice(device: SerialPort): Promise<void> {
    if (device.readable) { return; } // opened devices have a ReadableStream as device.readable

    if (!this.settingsCallbackFn) { return; } // Must be able to query for baudrate

    const port = new CommonSerialPort(device, this.settingsCallbackFn);

    port.addListener('error', (error) => {
      console.warn(error);
      this.activePorts = this.activePorts
        .filter((activePort: CommonSerialPort) => (
          activePort !== port
        ));

      this.emit('activePortsChange');
    });

    port.addListener('errormessage', (errorMessage: string) => {
      this.emit('errormessage', errorMessage);
    });

    port.addListener('data', (readResult: ReadResult) => {
      this.emit('data', readResult);
    });

    port.addListener('receiving', () => {
      this.emit('receiving', port.getPortDeviceType());
    });

    port.addListener('typechange', () => {
      this.emit('activePortsChange');
    });

    await port.connect();
    this.activePorts.push(port);
    this.emit('activePortsChange');
  }

  public async initPorts(settingsCallbackFn: SettingsCallbackFn) {
    if (!this.enabled) { return; }

    this.settingsCallbackFn = settingsCallbackFn;

    const devices = await navigator.serial.getPorts();

    for (const device of devices) {
      await this.initDevice(device);
    }

    // Add listener to setup future devices
    navigator.serial.addEventListener('connect', (event: Event) => {
      this.initDevice(event.target as SerialPort);
    });

    navigator.serial.addEventListener('disconnect', (event) => {
      this.activePorts = this.activePorts
        .filter((port: CommonSerialPort) => {
          if (port.getDevice() === event.target as SerialPort) {
            return false;
          }
        });

      this.emit('activePortsChange');
    });
  }
}

const instance = new WebSerialEE();
export default instance;
