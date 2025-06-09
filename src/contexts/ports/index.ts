import { createContext, useContext } from 'react';
import type { Context } from 'react';
import { PortsContextValue } from '@/types/ports';

export const portsContext: Context<PortsContextValue> = createContext<PortsContextValue>({
  webSerialActivePorts: [],
  webSerialIsReceiving: false,
  webSerialEnabled: false,
  openWebSerial: () => { throw new Error('PortsContext is missing'); },
  webUSBActivePorts: [],
  webUSBIsReceiving: false,
  webUSBEnabled: false,
  openWebUSB: () => { throw new Error('PortsContext is missing'); },
  unknownDeviceResponse: '',
  hasInactiveDevices: false,
  sendDeviceMessage: () => { throw new Error('PortsContext is missing'); },
  worker: null,
});

export const usePortsContext = (): PortsContextValue => useContext<PortsContextValue>(portsContext);
