import { createContext, useContext } from 'react';
import type { Context } from 'react';
import { PortsContextValue } from '@/types/ports';

export const portsContext: Context<PortsContextValue> = createContext<PortsContextValue>({
  connectedDevices: [],
  isReceiving: false,
  webSerialEnabled: false,
  openWebSerial: () => { throw new Error('PortsContext is missing'); },
  webUSBEnabled: false,
  openWebUSB: () => { throw new Error('PortsContext is missing'); },
  unknownDeviceResponse: null,
  hasInactiveDevices: false,
});

export const usePortsContext = (): PortsContextValue => useContext<PortsContextValue>(portsContext);
