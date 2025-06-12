import { PortDeviceType, PortsWorkerMessageType, PortType, WorkerCommand } from '@/consts/ports';

export interface ReadResult {
  bytes: Uint8Array,
  deviceId: string,
  string: string,
  portDeviceType: PortDeviceType,
}

interface WorkerPort {
  id: string,
  portDeviceType: PortDeviceType;
  description: string,
}

export interface PortsContextValue {
  worker: Worker | null,
  webSerialActivePorts: WorkerPort[],
  webSerialIsReceiving: boolean,
  webSerialEnabled: boolean,
  openWebSerial: () => void
  webUSBActivePorts: WorkerPort[],
  webUSBIsReceiving: boolean,
  webUSBEnabled: boolean,
  openWebUSB: () => void,
  hasInactiveDevices: boolean,
  unknownDeviceResponse: ReadResult | null,
  sendDeviceMessage: (message: Uint8Array, id: string) => void,
}

export interface PortSettings {
  baudRate: number,
}

////// Messages from Worker //////
interface PortsWorkerBaseMessage {
  type: PortsWorkerMessageType,
}

export interface PortsWorkerStateMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.ENABLED_STATE,
  webUSBEnabled: boolean,
  webSerialEnabled: boolean,
}

export interface PortsWorkerErrorMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.ERROR,
  errorMessage: string,
}

export interface PortsWorkerChangeMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.PORTS_CHANGE,
  activePorts: WorkerPort[],
  portType: PortType,
}

export interface PortsWorkerDataMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.DATA,
  readResult: ReadResult,
  portType: PortType,
}

export interface PortsWorkerReceivingMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.RECEIVING,
  portDeviceType: PortDeviceType,
  portType: PortType,
}

export interface PortsWorkerQuestionMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.QUESTION,
  // currently there's only one type of question - subtypes can be added if needed
  questionId: string,
}

export type PortsWorkerMessage =
  | PortsWorkerStateMessage
  | PortsWorkerErrorMessage
  | PortsWorkerChangeMessage
  | PortsWorkerDataMessage
  | PortsWorkerReceivingMessage
  | PortsWorkerQuestionMessage;


////// Commands to Worker //////
interface PortsWorkerBaseCommand {
  type: WorkerCommand,
}

export interface PortsWorkerOpenCommand extends PortsWorkerBaseCommand {
  type: WorkerCommand.OPEN,
  portType: PortType,
}

export interface PortsWorkerSendDataCommand extends PortsWorkerBaseCommand {
  type: WorkerCommand.SEND_DATA,
  deviceId: string,
  message: Uint8Array,
}

export interface PortsWorkerAnswerCommand extends PortsWorkerBaseCommand {
  type: WorkerCommand.ANSWER,
  portType: PortType,
  questionId: string,
  response: PortSettings | null,
}

export type PortsWorkerCommand =
  | PortsWorkerOpenCommand
  | PortsWorkerSendDataCommand
  | PortsWorkerAnswerCommand;
