import { Remote } from 'comlink';
import { PortDeviceType, PortType } from '@/consts/ports';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';

export interface PortsContextValue {
  connectedDevices: CommsDeviceMeta[],
  isReceiving: boolean,
  webSerialEnabled: boolean,
  openWebSerial: () => void
  webUSBEnabled: boolean,
  openWebUSB: () => void,
  hasInactiveDevices: boolean,
  unknownDeviceResponse: Uint8Array | null,
}

export interface PortSettings {
  baudRate: number,
}

export type StatusCallback = (webUSBEnabled: boolean, webSerialEnabled: boolean) => Promise<void>;
export type DeviceAddCallback = (device: Remote<BaseCommsDevice>) => Promise<void>;
export type DeviceRemoveCallback = (deviceId: string) => Promise<void>;
export type SettingsCallback = () => Promise<PortSettings | null>;

export interface PortsWorkerClient {
  setStatus: StatusCallback,
  settingsCallback: SettingsCallback,
  addDeviceApi: DeviceAddCallback,
  removeDeviceApi: DeviceRemoveCallback,
}

export interface PortsWorkerRemote {
  openSerial: () => Promise<void>,
  openUSB: () => Promise<void>,
  registerClient: (client: PortsWorkerClient) => Promise<void>,
}

export interface CommsDeviceMeta {
  id: string,
  portType: PortType;
  portDeviceType: PortDeviceType;
  description: string,
  device: Remote<BaseCommsDevice>;
}

export type ReadParams =
  { timeout: number; length?: never; texts?: never } |
  { timeout?: number; length?: never; texts: string[] } |
  { timeout?: number; length: number; texts?: never };

export type StartProgressCallback = (label: string) => Promise<string>;
export type SetProgressCallback = (id: string, value: number) => void;
export type StopProgressCallback = (id: string) => void;
export type SetErrorCallback = (error: string) => void;


