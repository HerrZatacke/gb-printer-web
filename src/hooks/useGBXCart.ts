import { Remote } from 'comlink';
import { useCallback, useMemo } from 'react';
// import { GBXCartCommands, GBXCartDeviceVars, GBXCartPCBVersions } from '@/consts/gbxCart';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { GBXCartCommsDevice } from '@/tools/comms/DeviceAPIs/GBXCartCommsDevice';
import getHandleFileImport from '@/tools/getHandleFileImport';

interface UseGBXCart {
  gbxCartAvailable: boolean,
  testCall: () => void,
}

export const useGBXCart = (): UseGBXCart => {
  const { connectedDevices } = usePortsContext();

  const { jsonImport } = useImportExportSettings();
  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);

  const gbxCart: Remote<GBXCartCommsDevice> | null = useMemo(() => {
    const deviceMeta = connectedDevices.find((device) => device.portDeviceType === PortDeviceType.GBXCART);

    if (!deviceMeta) { return null; }

    return deviceMeta.device as Remote<GBXCartCommsDevice>;
  }, [connectedDevices]);

  const gbxCartAvailable = Boolean(gbxCart);

  const testCall = useCallback(async () => {
    if (!gbxCart) { return; }

    // await gbxCart.checkFirmware();
    // const result = await gbxCart.testCall();

    const romName = await gbxCart.readROMName();

    const result = await gbxCart.readImageSlot();

    handleFileImport([
      new File(result, `${romName.trim() || 'dump'}.sav`, {
        type: 'application/octet-stream',
      }),
    ], { fromPrinter: false });

    console.log(result);
  }, [gbxCart, handleFileImport]);

  return {
    gbxCartAvailable,
    testCall,
  };
};
