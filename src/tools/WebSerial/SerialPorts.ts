import EventEmitter from 'events';
import { ReadResult, WorkerPort } from '@/types/ports';
import CommonSerialPort from './SerialPort';

class WebSerialEE extends EventEmitter {
  public enabled: boolean;
  private activePorts: CommonSerialPort[];

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.serial &&
      !!TextDecoderStream;
    this.activePorts = [];
    this.initPorts();
  }

  getActivePorts(): CommonSerialPort[] {
    return this.activePorts;
  }

  getWorkerPorts(): WorkerPort[] {
    const ports = this.getActivePorts();
    return ports.map((commonSerialPort) => ({
      id: commonSerialPort.getId(),
      description: `${commonSerialPort.getBaudRate()} baud`,
      portDeviceType: commonSerialPort.getPortDeviceType(),
    }));
  }

  private async initDevice(device: SerialPort): Promise<void> {
    if (device.readable) { return; } // opened devices have a ReadableStream as device.readable

    const port = new CommonSerialPort(device);

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

  async initPorts() {
    if (!this.enabled) { return; }

    const devices = await navigator.serial.getPorts();
    devices.forEach((device) => this.initDevice(device));

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
