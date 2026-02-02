import { proxy, Remote } from 'comlink';
import { useCallback, useMemo } from 'react';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import {
  useInteractionsStore,
  useItemsStore,
  useProgressStore,
} from '@/stores/stores';
import { SuperPrinterCommsDevice } from '@/tools/comms/DeviceAPIs/SuperPrinterCommsDevice';
import { loadImageTiles } from '@/tools/loadImageTiles';

interface UseSuperPrinterInterface {
  canPrint: boolean,
  print: (hash: string) => void,
}

export const useSuperPrinterInterface = (): UseSuperPrinterInterface => {
  const { connectedDevices } = usePortsContext();
  const { images, frames } = useItemsStore();
  const { setError } = useInteractionsStore();
  const { setProgress, startProgress, stopProgress } = useProgressStore();

  const getTiles = useCallback(async (hash: string) => {
    const tileLoader = loadImageTiles(images, frames);
    const loadedTiles = await tileLoader(hash, true);

    if ((loadedTiles as string[]).length) {
      return loadedTiles as string[];
    }

    return [];
  }, [frames, images]);

  const printer: Remote<SuperPrinterCommsDevice> | null = useMemo(() => {
    const deviceMeta = connectedDevices.find((device) => device.portDeviceType === PortDeviceType.SUPER_PRINTER_INTERFACE);

    if (!deviceMeta) { return null; }

    return deviceMeta.device as Remote<SuperPrinterCommsDevice>;
  }, [connectedDevices]);

  const canPrint = useMemo(() => Boolean(printer), [printer]);

  const print = useCallback(async (hash: string) => {
    if (!canPrint || !printer) { return; }

    const tiles = await getTiles(hash);

    await printer.setup(proxy({
      setProgress,
      startProgress: async (label: string): Promise<string> => (
        startProgress(label)
      ),
      stopProgress,
      setError: (error: string) => {
        setError(new Error(error));
      },
    }));

    await printer.printImage(tiles);
  }, [canPrint, getTiles, printer, setError, setProgress, startProgress, stopProgress]) ;

  return {
    canPrint,
    print,
  };
};
