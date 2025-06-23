import { proxy, Remote } from 'comlink';
import { useCallback, useEffect, useMemo } from 'react';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useProgressStore from '@/stores/progressStore';
import { GBXCartCommsDevice } from '@/tools/comms/DeviceAPIs/GBXCartCommsDevice';
import getHandleFileImport from '@/tools/getHandleFileImport';

interface UseGBXCart {
  gbxCartAvailable: boolean,
  readRAMImage: () => void,
  readPhotoRom: () => void,
}

export const useGBXCart = (): UseGBXCart => {
  const { connectedDevices } = usePortsContext();

  const { jsonImport } = useImportExportSettings();
  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);
  const { setProgress, startProgress, stopProgress } = useProgressStore();
  const gbxCart: Remote<GBXCartCommsDevice> | null = useMemo(() => {
    const deviceMeta = connectedDevices.find((device) => device.portDeviceType === PortDeviceType.GBXCART);

    if (!deviceMeta) { return null; }

    return deviceMeta.device as Remote<GBXCartCommsDevice>;
  }, [connectedDevices]);

  const gbxCartAvailable = Boolean(gbxCart);

  useEffect(() => {
    const setupCallbacks = async () => {
      if (!gbxCart) { return; }
      await gbxCart.setup(proxy({
        setProgress,
        startProgress: async (label: string): Promise<string> => (
          startProgress(label)
        ),
        stopProgress,
      }));

      await gbxCart.checkFirmware();
    };

    setupCallbacks();
  }, [gbxCart, setProgress, startProgress, stopProgress]);

  const readRAMImage = useCallback(async () => {
    if (!gbxCart) { return; }

    const romName = await gbxCart.readROMName();

    const result = await gbxCart.readRAMImage();

    handleFileImport([
      new File(result, `${romName.trim() || 'dump'}.sav`, {
        type: 'application/octet-stream',
      }),
    ], { fromPrinter: false });
  }, [gbxCart, handleFileImport]);

  const readPhotoRom = useCallback(async () => {
    if (!gbxCart) { return; }

    // await gbxCart.checkFirmware();

    const romName = await gbxCart.readROMName();

    const result = await gbxCart.readPhotoRom();

    handleFileImport([
      new File(result, `${romName.trim() || 'dump'}.gb`, {
        type: 'application/octet-stream',
      }),
    ], { fromPrinter: false });
  }, [gbxCart, handleFileImport]);

  return {
    gbxCartAvailable,
    readRAMImage,
    readPhotoRom,
  };
};
