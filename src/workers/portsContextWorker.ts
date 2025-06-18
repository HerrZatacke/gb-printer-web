import { PortDeviceType, PortsWorkerMessageType, PortType, WorkerCommand } from '@/consts/ports';
import CommonSerialPort from '@/tools/WebSerial/SerialPort';
import SerialPorts from '@/tools/WebSerial/SerialPorts';
import USBPorts from '@/tools/WebUSBSerial/USBPorts';
import {
  PortsWorkerChangeMessage,
  PortsWorkerCommand,
  PortsWorkerDataMessage,
  PortsWorkerErrorMessage,
  PortsWorkerReceivingMessage,
  PortsWorkerStateMessage,
  ReadResult,
} from '@/types/ports';

const initMessage = () => {
  const stateMessage: PortsWorkerStateMessage = {
    type: PortsWorkerMessageType.ENABLED_STATE,
    webSerialEnabled: SerialPorts.enabled,
    webUSBEnabled: USBPorts.enabled,
  };

  self.postMessage(stateMessage);
};

const portChangeListener = (portType: PortType)=> () => {
  const activePorts = portType === PortType.SERIAL ?
    SerialPorts.getWorkerPorts() :
    USBPorts.getWorkerPorts();

  const portsMessage: PortsWorkerChangeMessage = {
    type: PortsWorkerMessageType.PORTS_CHANGE,
    activePorts,
    portType,
  };

  self.postMessage(portsMessage);
};

SerialPorts.addListener('activePortsChange', portChangeListener(PortType.SERIAL));
USBPorts.addListener('activePortsChange', portChangeListener(PortType.USB));


const dataListener = (portType: PortType) => (readResult: ReadResult)=> {
  const resultsMessage: PortsWorkerDataMessage = {
    type: PortsWorkerMessageType.DATA,
    readResults: [readResult],
    portType,
  };

  self.postMessage(resultsMessage);
};

SerialPorts.addListener('data', dataListener(PortType.SERIAL));
USBPorts.addListener('data', dataListener(PortType.USB));

const receivingListener = (portType: PortType) => (portDeviceType: PortDeviceType) => {
  const receivingMessage: PortsWorkerReceivingMessage = {
    type: PortsWorkerMessageType.RECEIVING,
    portDeviceType,
    portType,
  };

  self.postMessage(receivingMessage);
};

SerialPorts.addListener('receiving', receivingListener(PortType.SERIAL));
USBPorts.addListener('receiving', receivingListener(PortType.USB));

const errorListener = (portType: PortType) => (errorMessage: string) => {
  const receivingMessage: PortsWorkerErrorMessage = {
    type: PortsWorkerMessageType.ERROR,
    portType,
    errorMessage,
  };

  self.postMessage(receivingMessage);
};

SerialPorts.addListener('errormessage', errorListener(PortType.SERIAL));
USBPorts.addListener('errormessage', errorListener(PortType.USB));

self.onmessage = async (messageEvent: MessageEvent<PortsWorkerCommand>) => {
  const textDecoder = new TextDecoder();

  switch (messageEvent.data.type) {
    case WorkerCommand.OPEN: {
      switch (messageEvent.data.portType) {
        case PortType.SERIAL: {
          SerialPorts.initPorts();
          break;
        }

        case PortType.USB: {
          USBPorts.initPorts();
          break;
        }

        default:
          break;
      }

      break;
    }

    case WorkerCommand.SEND_DATA: {
      const { deviceId, message, readParamss, flush, messageId } = messageEvent.data;

      const allDevices = [...SerialPorts.getActivePorts(), ...USBPorts.getActivePorts()];
      const device = allDevices.find((findDevice) => findDevice.getId() === deviceId);
      if (!device) {
        throw new Error('device not found');
      }

      const portType: PortType = device instanceof CommonSerialPort ? PortType.SERIAL : PortType.USB;

      const bytess = await device.send(message, readParamss, flush);

      const readResults: ReadResult[] = bytess.map((bytes) => ({
        string: textDecoder.decode(bytes),
        bytes: bytes,
        deviceId: device.getId(),
        portDeviceType: device.getPortDeviceType(),
      }));

      const resultsMessage: PortsWorkerDataMessage = {
        type: PortsWorkerMessageType.DATA,
        readResults,
        portType,
        replyToMessageId: messageId,
      };

      self.postMessage(resultsMessage);

      break;
    }

    case WorkerCommand.ANSWER: {
      // listener is elsewhere, can be ignored here
      break;
    }

    default: {
      console.log(messageEvent);
    }
  }
};

initMessage();
