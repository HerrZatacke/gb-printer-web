import { PortDeviceType, PortsWorkerMessageType, PortType, WorkerCommand } from '@/consts/ports';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';

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
  sendDeviceMessage: (message: Uint8Array, deviceId: string, readParamss: ReadParams[], flush: boolean) => Promise<ReadResult[]>,
}

export interface PortSettings {
  baudRate: number,
}

////// Messages from Worker //////
interface PortsWorkerBaseMessage {
  type: PortsWorkerMessageType,
}

export type InitCallbackFn = (webUSBEnabled: boolean, webSerialEnabled: boolean) => void;
export type PortsChangeCallbackFn = (exposed: CaptureCommsDevice[]) => void;
export type SettingsCallbackFn = () => Promise<PortSettings | null>;

export interface PortsWorkerErrorMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.ERROR,
  portType: PortType,
  errorMessage: string,
}

export interface PortsWorkerDataMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.DATA,
  readResults: ReadResult[],
  replyToMessageId?: string,
  portType: PortType,
}

export interface PortsWorkerReceivingMessage extends PortsWorkerBaseMessage {
  type :PortsWorkerMessageType.RECEIVING,
  portDeviceType: PortDeviceType,
  portType: PortType,
}

export type PortsWorkerMessage =
  | PortsWorkerErrorMessage
  | PortsWorkerDataMessage
  | PortsWorkerReceivingMessage;

export type ReadParams =
  { timeout: number; length?: never; texts?: never } |
  { timeout?: number; length?: never; texts: string[] } |
  { timeout?: number; length: number; texts?: never };


////// Commands to Worker //////
interface PortsWorkerBaseCommand {
  type: WorkerCommand,
}

export interface PortsWorkerSendDataCommand extends PortsWorkerBaseCommand {
  type: WorkerCommand.SEND_DATA,
  deviceId: string,
  message: Uint8Array,
  messageId: string,
  readParamss: ReadParams[],
  flush: boolean,
}

export interface PortsWorkerAnswerCommand extends PortsWorkerBaseCommand {
  type: WorkerCommand.ANSWER,
  portType: PortType,
  questionId: string,
  response: PortSettings | null,
}

export type PortsWorkerCommand =
  | PortsWorkerSendDataCommand
  | PortsWorkerAnswerCommand;


export interface DevicesApi {
  openSerial: (
    settingsCallbackFn: SettingsCallbackFn,
  ) => Promise<void>,
  openUSB: () => Promise<void>,
  init: (
    initCallback: InitCallbackFn,
    settingsCallbackFn: SettingsCallbackFn,
    portsChangeCallback: PortsChangeCallbackFn,
  ) => Promise<void>,

  proxyCallFn: (
    deviceId: string,
    functionName: string,
    ...rest: unknown[],
  ) => Promise<unknown>,
  // getApi: (deviceId: string) => Promise<CommsApi>,
}

export type ReceivingCallbackFn = () => void;
export type DataCallbackFn = (data: string) => void;


export interface CommsApiBase  {
  portDeviceType: PortDeviceType;
}

export interface CaptureDeviceCommsApi extends CommsApiBase {
  portDeviceType: PortDeviceType.PACKET_CAPTURE;
}

export interface CaptureSetupParams {
  receiving: ReceivingCallbackFn,
  data: DataCallbackFn,
}

export type CommsApi =
// CommsApiBase
  | CaptureDeviceCommsApi;

