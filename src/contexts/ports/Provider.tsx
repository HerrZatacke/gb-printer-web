'use client';

import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { PortDeviceType, PortsWorkerMessageType, PortType, usbDeviceFilters, WorkerCommand } from '@/consts/ports';
import { useGetPortSettings } from '@/hooks/useGetPortSettings';
import useImportPlainText from '@/hooks/useImportPlainText';
import useInteractionsStore from '@/stores/interactionsStore';
import { mergeReadResults } from '@/tools/mergeReadResults';
import {
  PortsContextValue,
  PortsWorkerAnswerCommand,
  PortsWorkerMessage,
  PortsWorkerOpenCommand,
  PortsWorkerSendDataCommand,
  ReadResult,
  WorkerPort,
} from '@/types/ports';
import { portsContext } from './index';

export function PortsContext({ children }: PropsWithChildren) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [webSerialEnabled, setWebSerialEnabled] = useState<boolean>(false);
  const [webUSBEnabled, setWebUSBEnabled] = useState<boolean>(false);
  const [webUSBActivePorts, setWebUSBActivePorts] = useState<WorkerPort[]>([]);
  const [webUSBIsReceiving, setWebUSBIsReceiving] = useState(false);
  const [webSerialActivePorts, setWebSerialActivePorts] = useState<WorkerPort[]>([]);
  const [webSerialIsReceiving, setWebSerialIsReceiving] = useState(false);
  const [unknownDeviceResponse, setUnknownDeviceResponse] = useState<ReadResult | null>(null);

  const importPlainText = useImportPlainText();
  const { querySettings } = useGetPortSettings();
  const { setError } = useInteractionsStore();

  useEffect(() => {
    const newWorker = new Worker(new URL('@/workers/portsContextWorker', import.meta.url));

    newWorker.addEventListener('message', async (event: MessageEvent<PortsWorkerMessage>) => {
      const message = event.data;

      switch (message.type) {
        case PortsWorkerMessageType.ENABLED_STATE: {
          setWebSerialEnabled(message.webSerialEnabled);
          setWebUSBEnabled(message.webUSBEnabled);
          break;
        }

        case PortsWorkerMessageType.ERROR: {
          setError(new Error(message.errorMessage));
          break;
        }

        case PortsWorkerMessageType.PORTS_CHANGE: {
          switch (message.portType) {
            case PortType.SERIAL:
              setWebSerialActivePorts(message.activePorts);
              break;
            case PortType.USB:
              setWebUSBActivePorts(message.activePorts);
              break;
          }
          break;
        }

        case PortsWorkerMessageType.DATA: {
          switch (message.readResult.portDeviceType) {
            case PortDeviceType.PACKET_CAPTURE: {
              importPlainText(message.readResult.string);
              setUnknownDeviceResponse(null);
              break;
            }

            case PortDeviceType.SUPER_PRINTER_INTERFACE: {
              setUnknownDeviceResponse(null);
              break;
            }

            case PortDeviceType.INACTIVE:
            case PortDeviceType.UNKNOWN:
            default: {
              // Concatenate all received data
              setUnknownDeviceResponse((current) => (
                current ? mergeReadResults(current, message.readResult) : message.readResult
              ));
              break;
            }
          }

          switch (message.portType) {
            case PortType.SERIAL:
              setWebSerialIsReceiving(false);
              break;
            case PortType.USB:
              setWebUSBIsReceiving(false);
              break;
          }

          break;
        }

        case PortsWorkerMessageType.RECEIVING: {
          if (message.portDeviceType === PortDeviceType.PACKET_CAPTURE) {
            switch (message.portType) {
              case PortType.SERIAL:
                setWebSerialIsReceiving(true);
                break;
              case PortType.USB:
                setWebUSBIsReceiving(true);
                break;
            }
          }

          break;
        }

        case PortsWorkerMessageType.QUESTION: {
          const questionId = message.questionId;
          const portSettings = await querySettings();

          const answer: PortsWorkerAnswerCommand = {
            portType: PortType.SERIAL,
            type: WorkerCommand.ANSWER,
            questionId,
            response: portSettings,
          };

          newWorker.postMessage(answer);
          break;
        }

        default:
          break;
      }
    });

    newWorker.addEventListener('error', (event) => {
      setError(new Error(event.message));
    });

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
      setWorker(null);
    };
  }, [importPlainText, querySettings, setError]);

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
    if (webSerialEnabled && worker) {
      try {
        const device = await navigator.serial.requestPort();

        if (device.readable) {
          setError(new Error('device already opened'));
        }

        const command: PortsWorkerOpenCommand = {
          type: WorkerCommand.OPEN,
          portType: PortType.SERIAL,
        };

        worker.postMessage(command);
      } catch {
        /* no device was selected by user */
      }
    }
  }, [setError, webSerialEnabled, worker]);

  const openWebUSB = useCallback(async () => {
    if (webUSBEnabled && worker) {
      try {
        const device = await navigator.usb.requestDevice({ filters: usbDeviceFilters });
        if (device.opened) {
          setError(new Error('device already opened'));
        }

        const command: PortsWorkerOpenCommand = {
          type: WorkerCommand.OPEN,
          portType: PortType.USB,
        };

        worker.postMessage(command);
      } catch {
        /* no device was selected by user */
      }
    }
  }, [setError, webUSBEnabled, worker]);

  const sendDeviceMessage = useCallback((message: Uint8Array, deviceId: string) => {
    if (!worker) { return; }

    const messageCommand: PortsWorkerSendDataCommand = {
      type: WorkerCommand.SEND_DATA,
      deviceId,
      message,
    };

    worker.postMessage(messageCommand);
  }, [worker]);

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
    worker,
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
    worker,
  ]);

  return <portsContext.Provider value={value}>{ children }</portsContext.Provider>;
}
