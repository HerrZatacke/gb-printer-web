import { expose } from 'comlink';
import SerialPorts from '@/tools/comms/WebSerial/SerialPorts';
import USBPorts from '@/tools/comms/WebUSBSerial/USBPorts';
import {
  PortsWorkerRemote,
  PortsWorkerClient,
} from '@/types/ports';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const portsWorkerRemote: PortsWorkerRemote = {
  async openSerial(): Promise<void> {
    console.log('open serial');
    await SerialPorts.initPorts();
  },

  async openUSB(): Promise<void> {
    await USBPorts.initPorts();
  },

  async registerClient(portsWorkerClient: PortsWorkerClient) {
    if (SerialPorts.enabled) {
      await SerialPorts.registerClient(portsWorkerClient);
      await SerialPorts.initPorts();
    }

    if (USBPorts.enabled) {
      await USBPorts.registerClient(portsWorkerClient);
      await USBPorts.initPorts();
    }

    portsWorkerClient.setStatus(USBPorts.enabled, SerialPorts.enabled);
  },
};

expose(portsWorkerRemote);
