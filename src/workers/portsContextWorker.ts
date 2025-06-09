import { PortDeviceType, PortsWorkerMessageType, PortType, WorkerCommand } from '@/consts/ports';
import SerialPorts from '@/tools/WebSerial/SerialPorts';
import USBPorts from '@/tools/WebUSBSerial/USBPorts';
import {
  PortsWorkerChangeMessage,
  PortsWorkerCommand,
  PortsWorkerDataMessage,
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
    readResult,
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

self.onmessage = (messageEvent: MessageEvent<PortsWorkerCommand>) => {
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
      const { deviceId, message } = messageEvent.data;

      const allDevices = [...SerialPorts.getActivePorts(), ...USBPorts.getActivePorts()];
      const device = allDevices.find((findDevice) => findDevice.getId() === deviceId);
      if (!device) {
        throw new Error('device not found');
      }

      device.send(message);
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
