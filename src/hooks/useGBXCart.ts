import { useCallback, useEffect, useMemo, useState } from 'react';
import { PortDeviceType, PortsWorkerMessageType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import { PortsWorkerMessage, ReadResult, WorkerPort } from '@/types/ports';
import { mergeReadResults } from '@/tools/mergeReadResults';

interface UseGBXCart {
  gbxCartAvailable: boolean,
  importRam: () => void,
}

export const useGBXCart = (): UseGBXCart => {
  const {
    webSerialActivePorts,
    webSerialEnabled,
    sendDeviceMessage,
    worker,
  } = usePortsContext();

  const [readResult, setReadResult] = useState<ReadResult | null>(null);

  const device = useMemo<WorkerPort | null>(() => (
    webSerialActivePorts.find((workerPort) => (
      workerPort.portDeviceType === PortDeviceType.GBXCART
    )) || null
  ), [webSerialActivePorts]);

  const gbxCartAvailable = webSerialEnabled && Boolean(device);

  const handler = useCallback(async (event: MessageEvent<PortsWorkerMessage>) => {
    if (event.data.type !== PortsWorkerMessageType.DATA || !device) { return; }

    const deviceId = device.id;

    const { readResult: eventResult } = event.data;

    if (eventResult.deviceId === deviceId) {
      setReadResult((current) => (
        current ? mergeReadResults(current, eventResult) : eventResult
      ));
    }
  }, [device]);


  // Add listener to worker
  useEffect(() => {
    if (!worker) { return; }

    worker.addEventListener('message', handler);

    return () => {
      worker.removeEventListener('message', handler);
    };
  }, [handler, worker]);


  useEffect(() => {
    if (!readResult) { return; }
    console.log(readResult?.bytes);
  }, [readResult]);


  const importRam = useCallback(() => {
    if (!device || !worker) {
      return;
    }

    const message = new Uint8Array([0xa1]);
    sendDeviceMessage(message, device.id);

  }, [device, worker, sendDeviceMessage]);


  return {
    gbxCartAvailable,
    importRam,
  };
};
