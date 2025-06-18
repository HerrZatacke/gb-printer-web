import EventEmitter from 'events';
import { ReadResult, WorkerPort } from '@/types/ports';
import CommonUSBPort from './USBPort';


class USBPorts extends EventEmitter {
  public enabled: boolean;
  private activePorts: CommonUSBPort[];

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.usb &&
      !!navigator.usb.getDevices;
    this.activePorts = [];
    this.initPorts();
  }

  getActivePorts(): CommonUSBPort[] {
    return this.activePorts;
  }

  getWorkerPorts(): WorkerPort[] {
    const ports = this.getActivePorts();
    return ports.map((commonUSBPort) => ({
      id: commonUSBPort.getId(),
      description: commonUSBPort.getProductName(),
      portDeviceType: commonUSBPort.getPortDeviceType(),
    }));
  }

  private async initDevice(device: USBDevice) {
    if (device.opened) { return; }

    const port = new CommonUSBPort(device);

    port.addListener('error', (error: string) => {
      console.warn(error);
      this.activePorts = this.activePorts
        .filter((activePort) => (
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

    // First add port to activeports.
    this.activePorts.push(port);
    this.emit('activePortsChange');

    // if connect fails, it will be removed through the thrown error
    await port.connect();
  }

  // Setup initially known devices and add connection listener
  async initPorts() {
    if (!this.enabled) { return; }

    const devices = await navigator.usb.getDevices();
    devices.forEach((device) => this.initDevice(device));

    // Add listener to setup future devices
    navigator.usb.addEventListener('connect', (event) => {
      this.initDevice(event.device);
    });

    navigator.usb.addEventListener('disconnect', (event) => {
      this.activePorts = this.activePorts
        .filter((port: CommonUSBPort) => {
          if (port.getDevice() === event.device) {
            return false;
          }
        });

      this.emit('activePortsChange');
    });
  }
}

const instance = new USBPorts();
export default instance;
