import EventEmitter from 'events';
import { proxy, Remote } from 'comlink';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { PortsWorkerClient } from '@/types/ports';
import CommonUSBPort from './USBPort';


class USBPorts extends EventEmitter {
  public enabled: boolean;
  private connectedDevices: Map<string, USBDevice> = new Map();
  private portsWorkerClient: PortsWorkerClient | null = null;

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.usb &&
      !!navigator.usb.getDevices;;
  }

  public registerClient(client: PortsWorkerClient) {
    this.portsWorkerClient = client;
  }

  private async initDevice(usbDevice: USBDevice) {
    if (usbDevice.opened) { return; }

    if (!this.portsWorkerClient) { return; } // Must be able to query for baudrate

    const port = new CommonUSBPort(usbDevice);

    const newApi = await port.connect();

    if (newApi) {
      this.connectedDevices.set(newApi.id, usbDevice);
      await this.portsWorkerClient.addDeviceApi(proxy(newApi as unknown as Remote<BaseCommsDevice>));}
  }

  // Setup initially known devices and add connection listener
  public async initPorts() {
    if (!this.enabled || !this.portsWorkerClient) { return; }

    const devices = await navigator.usb.getDevices();
    devices.forEach((device) => this.initDevice(device));

    // Add listener to setup future devices
    navigator.usb.addEventListener('connect', (event) => {
      this.initDevice(event.device);
    });

    navigator.usb.addEventListener('disconnect', (event) => {
      if (!this.portsWorkerClient) { return; }

      const [disconnectId] = this.connectedDevices.entries().find(([, usbDevice]) => (
        usbDevice === event.device
      )) || [''];

      if (disconnectId) {
        this.connectedDevices.delete(disconnectId);
        this.portsWorkerClient.removeDeviceApi(disconnectId);
      }
    });
  }
}

const instance = new USBPorts();
export default instance;
