import { proxy, Remote } from 'comlink';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import useTracking from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useInteractionsStore from '@/stores/interactionsStore';
import useProgressStore from '@/stores/progressStore';
import { GBXCartCommsDevice } from '@/tools/comms/DeviceAPIs/GBXCartCommsDevice';
import { concatImportResults } from '@/tools/concatImportResults';
import getHandleFileImport from '@/tools/getHandleFileImport';

interface UseGBXCart {
  gbxCartAvailable: boolean,
  readRAMImage: () => void,
  readPhotoRom: () => void,
  readRomName: () => void,
  canReadPhotoRom: boolean,
  busy: boolean,
}

export const useGBXCart = (): UseGBXCart => {
  const { connectedDevices } = usePortsContext();
  const { setProgress, startProgress, stopProgress } = useProgressStore();
  const { sendEvent } = useTracking();
  const { setError } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();
  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);
  const [canReadPhotoRom, setCanReadPhotoAlbums] = useState(false);
  const [busy, setBusy] = useState(false);

  const gbxCart: Remote<GBXCartCommsDevice> | null = useMemo(() => {
    const deviceMeta = connectedDevices.find((device) => device.portDeviceType === PortDeviceType.GBXCART);

    if (!deviceMeta) { return null; }

    return deviceMeta.device as Remote<GBXCartCommsDevice>;
  }, [connectedDevices]);

  const gbxCartAvailable = Boolean(gbxCart);

  useEffect(() => {
    if (gbxCart) {
      setBusy(true);
      gbxCart.readROMName().then((romName) => {
        setCanReadPhotoAlbums(romName.trim() === 'PHOTO');
        setBusy(false);
      });
    }
  }, [gbxCart]);

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

      // await gbxCart.checkFirmware();
    };

    setupCallbacks();
  }, [gbxCart, setProgress, startProgress, stopProgress]);

  const readRAMImage = useCallback(async () => {
    if (!gbxCart) { return; }
    setBusy(true);

    const romName = await gbxCart.readROMName();
    setCanReadPhotoAlbums(romName.trim() === 'PHOTO');

    let savFrameSet: string | undefined;

    switch (romName) {
      case 'GAMEBOYCAMERA': // International edition
      case 'GAMEBOYCAMERA G': // Golden/Zelda edition
        savFrameSet = 'int';
        break;

      case 'POCKETCAMERA': // Japanese edition
        savFrameSet = 'jp';
        break;

      case 'POCKETCAMERA_SN': // HK/SN edition
        savFrameSet = 'hk';
        break;

      case 'PHOTO':
        savFrameSet = 'photo';
        break;

      case 'PXLR':
      case 'PXLR_SLSC':
        savFrameSet = 'pxlr';
        break;

      default:
    }

    const result = await gbxCart.readRAMImage();

    setBusy(false);

    const importResults = await handleFileImport([
      new File(result, `${romName.trim() || 'dump'}.sav`, {
        type: 'application/octet-stream',
      }),
    ], {
      fromPrinter: false,
      savFrameSet,
    });

    sendEvent('importQueue', concatImportResults(importResults, 'gbxCart'));
  }, [gbxCart, handleFileImport, sendEvent]);

  const readPhotoRom = useCallback(async () => {
    if (!gbxCart) { return; }
    setBusy(true);

    const romName = await gbxCart.readROMName();
    setCanReadPhotoAlbums(romName.trim() === 'PHOTO');

    if (romName !== 'PHOTO') {
      setError(new Error('ROM is not PHOTO!'));
      return;
    }

    const result = await gbxCart.readPhotoAlbums();

    setBusy(false);

    handleFileImport([
      new File(result, `${romName.trim() || 'dump'}.sav`, {
        type: 'application/octet-stream',
      }),
    ], { fromPrinter: false });
  }, [gbxCart, handleFileImport, setError]);

  const readRomName = useCallback(async () => {
    if (!gbxCart) { return; }
    const romName = await gbxCart.readROMName();
    console.log('ROM name', romName);
  }, [gbxCart]);

  return {
    gbxCartAvailable,
    canReadPhotoRom,
    readRAMImage,
    readPhotoRom,
    readRomName,
    busy,
  };
};
