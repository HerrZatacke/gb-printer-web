import { useCallback, useMemo } from 'react';
import { GBXCartCommands, GBXCartDeviceVars, GBXCartPCBVersions } from '@/consts/gbxCart';
import { PortDeviceType } from '@/consts/ports';
import { usePortsContext } from '@/contexts/ports';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import getHandleFileImport from '@/tools/getHandleFileImport';
// import { appendUint8Arrays } from '@/tools/mergeReadResults';
import { WorkerPort } from '@/types/ports';

interface UseGBXCart {
  gbxCartAvailable: boolean,
  testCall: () => void,
}

export const useGBXCart = (): UseGBXCart => {
  const {
    webSerialActivePorts,
    webSerialEnabled,
    sendDeviceMessage,
    worker,
  } = usePortsContext();

  const { jsonImport } = useImportExportSettings();
  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);

  const device = useMemo<WorkerPort | null>(() => (
    webSerialActivePorts.find((workerPort) => (
      workerPort.portDeviceType === PortDeviceType.GBXCART
    )) || null
  ), [webSerialActivePorts]);

  const gbxCartAvailable = webSerialEnabled && Boolean(device);


  const setFwVariable = useCallback(async (varKey: keyof typeof GBXCartDeviceVars, varValue: number) => {
    if (!device) { return; }

    const { size, value } = GBXCartDeviceVars[varKey];
    const commandValue = GBXCartCommands['SET_VARIABLE'];

    const buffer = new ArrayBuffer(13);
    const view = new DataView(buffer);

    view.setUint8(0, commandValue);
    view.setUint8(1, size);
    view.setUint32(2, value, false);
    view.setUint32(6, varValue, false);
    view.setUint8(10, 0);
    view.setUint8(11, 0);
    view.setUint8(12, 0);

    const command = new Uint8Array(buffer);
    await sendDeviceMessage(command, device.id, [], true);
  }, [device, sendDeviceMessage]);

  const readROM = useCallback(async (address: number, size: number): Promise<Uint8Array> => {
    if (size > 64) { throw new Error('read size too big'); }
    if (!device) { return new Uint8Array(); }

    await setFwVariable('TRANSFER_SIZE', size);
    await setFwVariable('ADDRESS', address);
    await setFwVariable('DMG_ACCESS_MODE', 1);

    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    const [cartReadResult] = await sendDeviceMessage(readCommand, device.id, [{ length: size }], true);

    return cartReadResult.bytes;
  }, [device, sendDeviceMessage, setFwVariable]);

  const readRAM = useCallback(async (address: number, size: number): Promise<Uint8Array> => {
    if (size > 64) { throw new Error('read size too big'); }
    if (!device) { return new Uint8Array(); }

    await setFwVariable('TRANSFER_SIZE', size);
    await setFwVariable('ADDRESS', 0xA000 + address);
    await setFwVariable('DMG_ACCESS_MODE', 3);
    await setFwVariable('DMG_READ_CS_PULSE', 1);

    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    const [cartReadResult] = await sendDeviceMessage(readCommand, device.id, [{ length: size }], true);

    return cartReadResult.bytes;
  }, [device, sendDeviceMessage, setFwVariable]);

  const testCall = useCallback(async () => {
    // https://github.com/Mraulio/GBCamera-Android-Manager/blob/main/app/src/main/java/com/mraulio/gbcameramanager/gbxcart/GBxCartCommands.java
    if (!device || !worker) {
      return;
    }

    const textDecoder = new TextDecoder();
    const message = new Uint8Array([GBXCartCommands['QUERY_FW_INFO']]);
    const [firmwareResult] = await sendDeviceMessage(message, device.id, [{ length: 9 }], true);

    const [
      ,
      cfwId,
      ,
      fvVer,
      pcbVer,
      ...dateBytes
    ] = firmwareResult.bytes;

    // eslint-disable-next-line no-bitwise
    const timestamp = (dateBytes[0] << 24) + (dateBytes[1] << 16) + (dateBytes[2] << 8) + dateBytes[3];
    const date = new Date(timestamp * 1000);

    console.log({
      cfwId: String.fromCharCode(cfwId),
      fvVer,
      pcbVer: GBXCartPCBVersions[pcbVer],
      timestamp,
      date: date.toISOString(),
    });

    const setModeVoltageCommand = new Uint8Array([GBXCartCommands['SET_MODE_DMG'], GBXCartCommands['SET_VOLTAGE_5V']]);
    await sendDeviceMessage(setModeVoltageCommand, device.id, [], true);

    const cartReadResult = await readROM(0x134, 0x10);
    const romName = textDecoder.decode(cartReadResult.filter((byte) => (byte !== 0 && byte !== 128)));
    console.log({ romName });

    // const chunks = [];
    // const chunkSize = 0x40;
    // /* eslint-disable no-await-in-loop */
    // for (let offset = 0; offset < 0x20000/chunkSize; offset += 1) {
    //   chunks.push(await readROM(chunkSize * offset, chunkSize));
    //   console.log(`${chunks.length}/${0x20000/chunkSize}`);
    // }
    // /* eslint-enable no-await-in-loop */
    //
    // handleFileImport([
    //   new File(chunks, 'rom.sav', {
    //     type: 'application/octet-stream',
    //   }),
    // ], { fromPrinter: false });

    const chunks = [];
    const chunkSize = 0x40;
    const readSize = 0x20000;
    /* eslint-disable no-await-in-loop */
    for (let offset = 0; offset < readSize / chunkSize; offset += 1) {
      chunks.push(await readRAM(chunkSize * offset, chunkSize));
      console.log(`${chunks.length}/${readSize / chunkSize} -> ${chunks.length / (readSize / chunkSize)}`);
    }
    /* eslint-enable no-await-in-loop */

    handleFileImport([
      new File(chunks, 'ram.sav', {
        type: 'application/octet-stream',
      }),
    ], { fromPrinter: false });

  }, [device, worker, sendDeviceMessage, readROM, handleFileImport, readRAM]);


  return {
    gbxCartAvailable,
    testCall,
  };
};
