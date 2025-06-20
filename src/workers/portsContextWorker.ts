import { expose, proxy } from 'comlink';
import { PortDeviceType, PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import SerialPorts from '@/tools/comms/WebSerial/SerialPorts';
import USBPorts from '@/tools/comms/WebUSBSerial/USBPorts';
import {
  CommsApi,
  DevicesApi,
  InitCallbackFn,
  PortsChangeCallbackFn,
  SettingsCallbackFn,
} from '@/types/ports';

// const dataListener = (portType: PortType) => (readResult: ReadResult)=> {
//   const resultsMessage: PortsWorkerDataMessage = {
//     type: PortsWorkerMessageType.DATA,
//     readResults: [readResult],
//     portType,
//   };
//
//   self.postMessage(resultsMessage);
// };
//
// SerialPorts.addListener('data', dataListener(PortType.SERIAL));
// USBPorts.addListener('data', dataListener(PortType.USB));


// const receivingListener = (portType: PortType) => (portDeviceType: PortDeviceType) => {
//   const receivingMessage: PortsWorkerReceivingMessage = {
//     type: PortsWorkerMessageType.RECEIVING,
//     portDeviceType,
//     portType,
//   };
//
//   self.postMessage(receivingMessage);
// };
//
// SerialPorts.addListener('receiving', receivingListener(PortType.SERIAL));
// USBPorts.addListener('receiving', receivingListener(PortType.USB));


// const errorListener = (portType: PortType) => (errorMessage: string) => {
//   const receivingMessage: PortsWorkerErrorMessage = {
//     type: PortsWorkerMessageType.ERROR,
//     portType,
//     errorMessage,
//   };
//
//   self.postMessage(receivingMessage);
// };
//
// SerialPorts.addListener('errormessage', errorListener(PortType.SERIAL));
// USBPorts.addListener('errormessage', errorListener(PortType.USB));


// self.onmessage = async (messageEvent: MessageEvent<PortsWorkerCommand>) => {
//   const textDecoder = new TextDecoder();
//
//   switch (messageEvent.data.type) {
//     case WorkerCommand.SEND_DATA: {
//       const { deviceId, message, readParamss, flush, messageId } = messageEvent.data;
//
//       const allDevices = [...SerialPorts.getActivePorts(), ...USBPorts.getActivePorts()];
//       const device = allDevices.find((findDevice) => findDevice.getId() === deviceId);
//       if (!device) {
//         throw new Error('device not found');
//       }
//
//       const portType: PortType = device instanceof CommonSerialPort ? PortType.SERIAL : PortType.USB;
//
//       const bytess = await device.send(message, readParamss, flush);
//
//       const readResults: ReadResult[] = bytess.map((bytes) => ({
//         string: textDecoder.decode(bytes),
//         bytes: bytes,
//         deviceId: device.getId(),
//         portDeviceType: device.getPortDeviceType(),
//       }));
//
//       const resultsMessage: PortsWorkerDataMessage = {
//         type: PortsWorkerMessageType.DATA,
//         readResults,
//         portType,
//         replyToMessageId: messageId,
//       };
//
//       self.postMessage(resultsMessage);
//
//       break;
//     }
//
//     case WorkerCommand.ANSWER: {
//       // listener is elsewhere, can be ignored here
//       break;
//     }
//
//     default: {
//       console.log(messageEvent);
//     }
//   }
// };

const devicesApi: DevicesApi = {
  async openSerial(settingsCallbackFn: SettingsCallbackFn): Promise<void> {
    await SerialPorts.initPorts(settingsCallbackFn);
  },

  async openUSB(): Promise<void> {
    await USBPorts.initPorts();
  },

  async init(
    initCallback: InitCallbackFn,
    portsChangeCallback: PortsChangeCallbackFn,
    settingsCallbackFn: SettingsCallbackFn,
  ) {
    initCallback(SerialPorts.enabled, USBPorts.enabled);

    SerialPorts.addListener('activePortsChange', () => {
      portsChangeCallback(PortType.SERIAL, SerialPorts.getWorkerPorts());
    });

    USBPorts.addListener('activePortsChange', () => {
      portsChangeCallback(PortType.USB, USBPorts.getWorkerPorts());
    });

    await Promise.all([
      SerialPorts.initPorts(settingsCallbackFn),
      USBPorts.initPorts(),
    ]);
  },

  async getApi(deviceId: string): Promise<CommsApi> {
    const allPorts: CommonPort[] = [
      ...SerialPorts.getActivePorts(),
      ...USBPorts.getActivePorts(),
    ];

    const device: CommonPort | undefined = allPorts.find((port) => port.getId() === deviceId);
    if (!device) { throw new Error('device with id not found'); }

    const api = device.getApi();

    if (api.portDeviceType !== PortDeviceType.PACKET_CAPTURE) {
      throw new Error('jaja');
    }

    return proxy<CommsApi>(api);

    // return {
    //   portDeviceType: api.portDeviceType,
    //   setCallbacks: proxy(api.setCallbacks),
    // };
  },
};

expose(devicesApi);
