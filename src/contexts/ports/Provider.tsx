'use client';

import { proxy, wrap } from 'comlink';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PortDeviceType, PortType, usbDeviceFilters } from '@/consts/ports';
import { useGetPortSettings } from '@/hooks/useGetPortSettings';
import useImportPlainText from '@/hooks/useImportPlainText';
import useInteractionsStore from '@/stores/interactionsStore';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import {
  DevicesApi,
  InitCallbackFn,
  PortsChangeCallbackFn,
  PortsContextValue,
  ReadParams,
  ReadResult,
  SettingsCallbackFn,
  WorkerPort,
} from '@/types/ports';
import { portsContext } from './index';

export function PortsContext({ children }: PropsWithChildren) {
  const [devicesApi, setDevicesApi] = useState<DevicesApi | null>(null);
  const [webSerialEnabled, setWebSerialEnabled] = useState<boolean>(false);
  const [webUSBEnabled, setWebUSBEnabled] = useState<boolean>(false);
  const [webUSBActivePorts, setWebUSBActivePorts] = useState<WorkerPort[]>([]);
  const [webUSBIsReceiving, setWebUSBIsReceiving] = useState(false);
  const [webSerialActivePorts, setWebSerialActivePorts] = useState<WorkerPort[]>([]);
  const [webSerialIsReceiving, setWebSerialIsReceiving] = useState(false);
  const [unknownDeviceResponse, setUnknownDeviceResponse] = useState<ReadResult | null>(null);
  const [packetCaptureResponse, setPacketCaptureResponse] = useState<string>('');
  const packetCaptureTimeout = useRef(0);

  const importPlainText = useImportPlainText();
  const { querySettings } = useGetPortSettings();
  const { setError } = useInteractionsStore();

  const settingsCallbackFn = useRef<SettingsCallbackFn>(proxy<SettingsCallbackFn>(querySettings));

  useEffect(() => {
    const worker = new Worker(new URL('@/workers/portsContextWorker', import.meta.url), { type: 'module' });
    const handle = window.setTimeout(() => {
      const newDevicesApi = wrap<DevicesApi>(worker);

      const initCallback = proxy<InitCallbackFn>((usbEnabled: boolean, serialEnabled: boolean) => {
        setWebSerialEnabled(serialEnabled);
        setWebUSBEnabled(usbEnabled);
      });

      const portsChangeCallback = proxy<PortsChangeCallbackFn>(async (apis: CaptureCommsDevice[]) => {
        for (const api of apis) {
          const apiInfo = await api.getInfo();
          newDevicesApi.proxyCallFn(apiInfo.id, 'setup');
        }
      });

      newDevicesApi.init(initCallback, settingsCallbackFn.current, portsChangeCallback)
        .then(() => {
          setDevicesApi(() => (newDevicesApi));
        })
        .catch((error) => {
          setError(error);
          worker.terminate();
          setWebSerialEnabled(false);
          setWebUSBEnabled(false);
          setWebSerialActivePorts([]);
          setWebUSBActivePorts([]);
        });

    }, 1);

    // worker.addEventListener('message', async (event: MessageEvent<PortsWorkerMessage>) => {
    //   const message = event.data;
    //
    //   switch (message.type) {
    //     case PortsWorkerMessageType.ERROR: {
    //       setError(new Error(message.errorMessage));
    //       break;
    //     }
    //
    //     case PortsWorkerMessageType.DATA: {
    //       switch (message.readResults[0].portDeviceType) {
    //         case PortDeviceType.PACKET_CAPTURE: {
    //           setPacketCaptureResponse((current) => (
    //             mergeReadResults([current, ...message.readResults])
    //           ));
    //           setUnknownDeviceResponse(null);
    //           break;
    //         }
    //
    //         case PortDeviceType.SUPER_PRINTER_INTERFACE: {
    //           setUnknownDeviceResponse(null);
    //           break;
    //         }
    //
    //         case PortDeviceType.INACTIVE:
    //         case PortDeviceType.UNKNOWN:
    //         default: {
    //           // Concatenate all received data
    //           setUnknownDeviceResponse((current) => (
    //             mergeReadResults([current, ...message.readResults])
    //           ));
    //           break;
    //         }
    //       }
    //
    //       break;
    //     }
    //
    //     case PortsWorkerMessageType.RECEIVING: {
    //       if (message.portDeviceType === PortDeviceType.PACKET_CAPTURE) {
    //         switch (message.portType) {
    //           case PortType.SERIAL:
    //             setWebSerialIsReceiving(true);
    //             break;
    //           case PortType.USB:
    //             setWebUSBIsReceiving(true);
    //             break;
    //         }
    //       }
    //
    //       break;
    //     }
    //
    //     default:
    //       break;
    //   }
    // });
    //
    // worker.addEventListener('error', (event) => {
    //   setError(new Error(event.message));
    // });
    //
    // setWorker(worker);

    return () => {
      worker.terminate();
      window.clearTimeout(handle);
      setDevicesApi(null);
    };
  }, [querySettings, setError]);

  const hasInactiveDevices = useMemo<boolean>(() => {
    const allPorts = [
      ...webUSBActivePorts,
      ...webSerialActivePorts,
    ];

    return Boolean(allPorts.find((port) => (
      port.portDeviceType === PortDeviceType.INACTIVE
    )));
  }, [webSerialActivePorts, webUSBActivePorts]);

  const openWebSerial = useCallback(async () => {
    if (webSerialEnabled && devicesApi) {
      try {
        const device = await navigator.serial.requestPort();

        if (device.readable) {
          setError(new Error('device already opened'));
        }

        devicesApi.openSerial(settingsCallbackFn.current);
      } catch {
        /* no device was selected by user */
      }
    }
  }, [devicesApi, setError, webSerialEnabled]);

  const openWebUSB = useCallback(async () => {
    if (webUSBEnabled && devicesApi) {
      try {
        const device = await navigator.usb.requestDevice({ filters: usbDeviceFilters });
        if (device.opened) {
          setError(new Error('device already opened'));
        }

        devicesApi.openUSB();
      } catch {
        /* no device was selected by user */
      }
    }
  }, [devicesApi, setError, webUSBEnabled]);

  const sendDeviceMessage = useCallback((message: Uint8Array, deviceId: string, readParamss: ReadParams[], flush: boolean): Promise<ReadResult[]> => {
    console.log({ message, deviceId, readParamss, flush });
    // if (!worker) { throw new Error('no worker'); }
    //
    // const messageId = randomId();
    //
    // const messageCommand: PortsWorkerSendDataCommand = {
    //   type: WorkerCommand.SEND_DATA,
    //   deviceId,
    //   message,
    //   messageId,
    //   readParamss,
    //   flush,
    // };
    //
    // return new Promise<ReadResult[]>((resolve) => {
    //   const responseHandler = (event: MessageEvent<PortsWorkerMessage>) => {
    //     const messageResponse = event.data;
    //     if (messageResponse.type === PortsWorkerMessageType.DATA) {
    //       if (messageResponse.replyToMessageId === messageId) {
    //         worker.removeEventListener('message', responseHandler);
    //         resolve(messageResponse.readResults);
    //       }
    //     }
    //   };
    //
    //   worker.addEventListener('message', responseHandler);
    //   worker.postMessage(messageCommand);
    // })
    return Promise.resolve([]);
  }, []);

  useEffect(() => {
    if (!packetCaptureResponse) { return; }
    window.clearTimeout(packetCaptureTimeout.current);

    packetCaptureTimeout.current = window.setTimeout(() => {
      if (packetCaptureResponse.length) {
        const importData = packetCaptureResponse;
        setPacketCaptureResponse('');
        setWebSerialIsReceiving(false);
        setWebUSBIsReceiving(false);
        importPlainText(importData);
      }
    }, 250);

    return () => {
      window.clearTimeout(packetCaptureTimeout.current);
    };
  }, [packetCaptureResponse, importPlainText]);

  // useEffect(() => {
  //   if (!devicesApi) { return; }
  //   const testDevice = webSerialActivePorts.find(({ portDeviceType }) => portDeviceType === PortDeviceType.PACKET_CAPTURE);
  //   if (!testDevice) { return; }
  //
  //   const addCallbacks = async () => {
  //     const commsApi = await devicesApi.getApi(testDevice.id);
  //
  //     const portDeviceType: PortDeviceType = await commsApi.portDeviceType;
  //
  //     switch (portDeviceType) {
  //       case PortDeviceType.PACKET_CAPTURE:
  //         commsApi.setCallbacks(
  //           proxy(() => setWebSerialIsReceiving(true)),
  //           proxy(setPacketCaptureResponse),
  //         );
  //         break;
  //
  //       default:
  //         break;
  //     }
  //
  //
  //   };
  //
  //   addCallbacks();
  // }, [devicesApi, webSerialActivePorts]);

  const value = useMemo((): PortsContextValue => ({
    hasInactiveDevices,
    openWebSerial,
    openWebUSB,
    sendDeviceMessage,
    unknownDeviceResponse,
    webSerialActivePorts,
    webSerialEnabled,
    webSerialIsReceiving,
    webUSBActivePorts,
    webUSBEnabled,
    webUSBIsReceiving,
    worker: null,
  }), [
    hasInactiveDevices,
    openWebSerial,
    openWebUSB,
    sendDeviceMessage,
    unknownDeviceResponse,
    webSerialActivePorts,
    webSerialEnabled,
    webSerialIsReceiving,
    webUSBActivePorts,
    webUSBEnabled,
    webUSBIsReceiving,
  ]);

  return <portsContext.Provider value={value}>{ children }</portsContext.Provider>;
}
