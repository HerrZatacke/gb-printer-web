import chunk from 'chunk';
import { useCallback, useMemo } from 'react';
import { PortDeviceType, PortsWorkerMessageType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import { loadImageTiles } from '@/tools/loadImageTiles';
import { PortsWorkerMessage, WorkerPort } from '@/types/ports';

interface UseSuperPrinterInterface {
  canPrint: boolean,
  print: (hash: string) => void,
}

enum PrinterExposure {
  LIGHT = 0x00,
  NORMAL = 0x40,
  DARK = 0x7f,
}



const printCommand = (
  brightness: PrinterExposure,
  topMargin: number,
  bottomMargin: number,
): number[]  => {
  // margin calculation see: https://gbdev.io/pandocs/Gameboy_Printer.html
  const margins =
    // eslint-disable-next-line no-bitwise
    (Math.max(0, Math.min(15, topMargin)) << 4) +
    (Math.max(0, Math.min(15, bottomMargin)));

  return [
    0x50, // "P" for "Print"
    margins, // default margins (=0x13 for default / top=1 bottom=3)
    0xe4, // default palette
    brightness,
    0x0d, // new line
  ];
};

export const useSuperPrinterInterface = (): UseSuperPrinterInterface => {
  const { webUSBActivePorts, webSerialActivePorts, sendDeviceMessage, worker } = usePortsContext();
  const { images, frames } = useItemsStore();
  const { setProgress, startProgress, stopProgress } = useInteractionsStore();

  const getTiles = useCallback(async (hash: string) => {
    const tileLoader = loadImageTiles(images, frames);
    const loadedTiles = await tileLoader(hash, true);

    if ((loadedTiles as string[]).length) {
      return loadedTiles as string[];
    }

    return [];
  }, [frames, images]);

  const printer: WorkerPort | null = useMemo(() => (
    [...webUSBActivePorts, ...webSerialActivePorts]
      .find((device) => device.portDeviceType === PortDeviceType.SUPER_PRINTER_INTERFACE) ||
    null
  ), [webSerialActivePorts, webUSBActivePorts]);

  const canPrint = useMemo(() => Boolean(printer), [printer]);

  const sendCommands = useCallback(async (commands: Uint8Array[]) => {
    if (!printer || !worker || !commands.length) {
      return;
    }

    const totalCommands = commands.length;

    // trigger "visibility" of overlay
    const progressId = startProgress('Printing to Super Printer Interface');

    const sendCommand = (): boolean => {
      const command = commands.shift();
      if (command?.byteLength) {
        sendDeviceMessage(command, printer.id);
        setProgress(progressId, (totalCommands - commands.length) / (totalCommands + 0.5));
        return true;
      }

      return false;
    };

    const handler = async (event: MessageEvent<PortsWorkerMessage>) => {
      if (event.data.type !== PortsWorkerMessageType.DATA) { return; }

      const { readResult } = event.data;
      if (readResult && readResult.string.indexOf('Printer ready') === -1) {
        return;
      }

      const sent = sendCommand();
      if (!sent) {
        worker.removeEventListener('message', handler);
        stopProgress(progressId);
      }
    };

    // Add listener and start printing
    worker.addEventListener('message', handler);
    sendCommand();
  }, [printer, sendDeviceMessage, setProgress, startProgress, stopProgress, worker]);

  const print = useCallback(async (hash: string) => {
    if (!canPrint) { return; }

    const tiles = await getTiles(hash);
    const bytes = tiles.reduce((acc: number[], tile: string): number[] => {
      const hexBytes = chunk<string>(tile, 2).flat();
      return [
        ...acc,
        ...hexBytes.map((hexByte) => parseInt(hexByte, 16)),
      ];
    }, []);

    // raw data lines without additional commands
    const lines = chunk(bytes, 640)
      .map((command) => new Uint8Array([
        0x44, // "D" for "Data"
        ...command,
        0x0d, // new line
      ]));

    // add print command every 9 lines (regular image size and maximum printer capacity)
    const commands = chunk(lines, 9)
      .map(((section: Uint8Array[], index: number, arr: Uint8Array[][]) => {
        const topMargin: number = (index === 0) ? 1 : 0;
        const bottomMargin: number = (index === arr.length - 1) ? 3 : 0;
        return [
          ...section,
          new Uint8Array(printCommand(PrinterExposure.DARK, topMargin, bottomMargin)),
        ];
      }))
      .flat();

    sendCommands(commands);
  }, [canPrint, getTiles, sendCommands]) ;

  return {
    canPrint,
    print,
  };
};
