'use client';

import { proxy, Remote, wrap } from 'comlink';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PortDeviceType, usbDeviceFilters } from '@/consts/ports';
import { useGetPortSettings } from '@/hooks/useGetPortSettings';
import useImportPlainText from '@/hooks/useImportPlainText';
import useInteractionsStore from '@/stores/interactionsStore';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { InactiveCommsDevice } from '@/tools/comms/DeviceAPIs/InactiveCommsDevice';
import {
  CommsDeviceMeta,
  PortsWorkerRemote,
  PortsContextValue,
  PortsWorkerClient,
} from '@/types/ports';
import { portsContext } from './index';

export function PortsContext({ children }: PropsWithChildren) {
  const [portsWorkerRemote, setPortsWorkerRemote] = useState<PortsWorkerRemote | null>(null);
  const [webSerialEnabled, setWebSerialEnabled] = useState<boolean>(false);
  const [webUSBEnabled, setWebUSBEnabled] = useState<boolean>(false);
  const [connectedDevices, setConnectedDevices] = useState<CommsDeviceMeta[]>([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const [unknownDeviceResponse, setUnknownDeviceResponse] = useState<Uint8Array | null>(null);
  const [packetCaptureResponse, setPacketCaptureResponse] = useState<string>('');
  const packetCaptureTimeout = useRef(0);

  const importPlainText = useImportPlainText();
  const { querySettings } = useGetPortSettings();
  const { setError } = useInteractionsStore();

  useEffect(() => {
    const worker = new Worker(new URL('@/workers/portsContextWorker', import.meta.url), { type: 'module' });
    const handle = window.setTimeout(() => {
      const newPortsWorkerRemote = wrap<PortsWorkerRemote>(worker);

      const portsWorkerClient: PortsWorkerClient = {
        async addDeviceApi(device: Remote<BaseCommsDevice>) {
          const id = await device.id;
          const portType = await device.portType;
          const portDeviceType = await device.portDeviceType;

          switch (portDeviceType) {
            case PortDeviceType.PACKET_CAPTURE: {
              // Setup for capture device // ToDo: move to it's setup routine somewhere...
              await (device as Remote<CaptureCommsDevice>).setup(proxy({
                receiving: () => { setIsReceiving(true); },
                data: (data: string) => { setPacketCaptureResponse(data); },
              }));
              break;
            }

            case PortDeviceType.INACTIVE: {
              const banner: Uint8Array = await (device as Remote<InactiveCommsDevice>).getBanner();
              if (banner.byteLength) {
                setUnknownDeviceResponse(banner);
              }
              break;
            }
          }

          const commsDeviceMeta: CommsDeviceMeta = await {
            id,
            portType,
            portDeviceType,
            description: await device.description,
            device: device,
          };

          setConnectedDevices((current) => ([
            ...current,
            commsDeviceMeta,
          ]));
        },
        async setStatus(usbEnabled: boolean, serialEnabled: boolean) {
          setWebSerialEnabled(serialEnabled);
          setWebUSBEnabled(usbEnabled);
        },
        async removeDeviceApi(deviceId: string) {
          setConnectedDevices((current) => (
            current.filter(({ id }) => deviceId !== id)
          ));
        },
        settingsCallback() {
          return querySettings();
        },
      };

      newPortsWorkerRemote.registerClient(proxy(portsWorkerClient));

      setPortsWorkerRemote(() => newPortsWorkerRemote);
    }, 1);

    return () => {
      worker.terminate();
      window.clearTimeout(handle);
      setPortsWorkerRemote(null);
    };
  }, [querySettings, setError]);

  const hasInactiveDevices = useMemo(() => {
    const portDeviceTypes: PortDeviceType[] = connectedDevices.map(item => item.portDeviceType);
    return portDeviceTypes.includes(PortDeviceType.INACTIVE);
  }, [connectedDevices]);

  const openWebSerial = useCallback(async () => {
    if (webSerialEnabled && portsWorkerRemote) {
      try {
        const device = await navigator.serial.requestPort();

        if (device.readable) {
          setError(new Error('device already opened'));
          return;
        }

        portsWorkerRemote.openSerial();
      } catch {
        /* no device was selected by user */
      }
    }
  }, [portsWorkerRemote, setError, webSerialEnabled]);

  const openWebUSB = useCallback(async () => {
    if (webUSBEnabled && portsWorkerRemote) {
      try {
        const device = await navigator.usb.requestDevice({ filters: usbDeviceFilters });
        if (device.opened) {
          setError(new Error('device already opened'));
          return;
        }

        portsWorkerRemote.openUSB();
      } catch {
        /* no device was selected by user */
      }
    }
  }, [portsWorkerRemote, setError, webUSBEnabled]);

  useEffect(() => {
    if (!packetCaptureResponse) { return; }
    window.clearTimeout(packetCaptureTimeout.current);

    packetCaptureTimeout.current = window.setTimeout(() => {
      if (packetCaptureResponse.length) {
        const importData = packetCaptureResponse;
        setPacketCaptureResponse('');
        setIsReceiving(false);
        importPlainText(importData);
      }
    }, 250);

    return () => {
      window.clearTimeout(packetCaptureTimeout.current);
    };
  }, [packetCaptureResponse, importPlainText]);

  const value = useMemo((): PortsContextValue => ({
    connectedDevices,
    hasInactiveDevices,
    isReceiving,
    openWebSerial,
    openWebUSB,
    unknownDeviceResponse,
    webSerialEnabled,
    webUSBEnabled,
  }), [
    connectedDevices,
    hasInactiveDevices,
    isReceiving,
    openWebSerial,
    openWebUSB,
    unknownDeviceResponse,
    webSerialEnabled,
    webUSBEnabled,
  ]);

  return <portsContext.Provider value={value}>{ children }</portsContext.Provider>;
}
