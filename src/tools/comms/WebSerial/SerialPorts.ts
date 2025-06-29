import EventEmitter from 'events';
import { proxy, Remote } from 'comlink';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { InactiveCommsDevice } from '@/tools/comms/DeviceAPIs/InactiveCommsDevice';
import { PortsWorkerClient } from '@/types/ports';
import CommonSerialPort from './SerialPort';

class WebSerialEE extends EventEmitter {
  public enabled: boolean;
  private connectedPorts: Map<string, SerialPort> = new Map();
  private portsWorkerClient: PortsWorkerClient | null = null;

  constructor() {
    super();
    this.enabled =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.serial &&
      !!TextDecoderStream;
  }

  public registerClient(client: PortsWorkerClient) {
    this.portsWorkerClient = client;
  }

  private async initDevice(serialPort: SerialPort): Promise<void> {
    if (serialPort.readable) { return; } // opened devices have a ReadableStream as serialPort.readable

    if (!this.portsWorkerClient) { return; } // Must be able to query for baudrate

    const port = new CommonSerialPort(serialPort, this.portsWorkerClient.settingsCallback);

    const tempApi = new InactiveCommsDevice(port, new Uint8Array(), 'identifying device');

    this.connectedPorts.set(tempApi.id, serialPort);
    await this.portsWorkerClient.addDeviceApi(proxy(tempApi as unknown as Remote<BaseCommsDevice>));

    const newApi = await port.connect();

    if (newApi) {
      this.connectedPorts.delete(tempApi.id);
      await this.portsWorkerClient.removeDeviceApi(tempApi.id);
      this.connectedPorts.set(newApi.id, serialPort);
      await this.portsWorkerClient.addDeviceApi(proxy(newApi as unknown as Remote<BaseCommsDevice>));
    }
  }

  public async initPorts(): Promise<void> {
    if (!this.enabled || !this.portsWorkerClient) { throw new Error('could not init serial ports'); }

    console.log('initializing serial ports');

    const ports = await navigator.serial.getPorts();

    for (const port of ports) {
      await this.initDevice(port);
    }

    // Add listener to setup future devices
    navigator.serial.addEventListener('connect', async (event: Event) => {
      if (!this.portsWorkerClient) { throw new Error('could not init new serial port'); }
      this.initDevice(event.target as SerialPort);
    });

    navigator.serial.addEventListener('disconnect', (event) => {
      if (!this.portsWorkerClient) { return; }

      const [disconnectId] = this.connectedPorts.entries().find(([, serialPort]) => (
        serialPort === event.target as SerialPort
      )) || [''];

      if (disconnectId) {
        this.connectedPorts.delete(disconnectId);
        this.portsWorkerClient.removeDeviceApi(disconnectId);
      }
    });
  }
}

const instance = new WebSerialEE();
export default instance;
