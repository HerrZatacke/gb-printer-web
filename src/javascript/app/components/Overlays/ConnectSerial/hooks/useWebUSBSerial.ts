import { useEffect, useState, useRef } from 'react';
import WebUSBSerial from '../../../../../tools/WebUSBSerial';
import useImportPlainText from '../../../../../hooks/useImportPlainText';
import type USBSerialPortEE from '../../../../../tools/WebUSBSerial/USBSerialPort';

interface UseWebUSBSerial {
  activePorts: USBSerialPortEE[],
  webUSBEnabled: boolean,
  openWebUSBSerial: () => void,
  isReceiving: boolean,
}

// ToDo: make this a <context> and remove "passive" option
const useWebUSBSerial = (passive: boolean): UseWebUSBSerial => {
  const webUSBEnabled = WebUSBSerial.enabled;

  const importPlainText = useImportPlainText();

  const [activePorts, setActivePorts] = useState<USBSerialPortEE[]>([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const receivedData = useRef<string>('');
  const receiveTimeOut = useRef<number>();

  useEffect(() => {
    if (!WebUSBSerial.enabled) {
      return () => { /* noop */ };
    }

    const handleReceivedData = (data: string) => {
      window.clearTimeout(receiveTimeOut.current);
      receiveTimeOut.current = window.setTimeout(() => {
        setIsReceiving(false);
        importPlainText(receivedData.current);
        receivedData.current = '';
      }, 1000);

      setIsReceiving(true);

      receivedData.current = `${receivedData.current}${data}`;
    };

    setActivePorts(WebUSBSerial.getActivePorts());
    WebUSBSerial.addListener('activePortsChange', setActivePorts);

    if (!passive) {
      WebUSBSerial.addListener('data', handleReceivedData);
    }

    return () => {
      WebUSBSerial.removeListener('activePortsChange', setActivePorts);
      WebUSBSerial.removeListener('data', handleReceivedData);
    };
  }, [importPlainText, passive]);

  const openWebUSBSerial = () => {
    if (WebUSBSerial.enabled) {
      WebUSBSerial.requestPort();
    }
  };

  return {
    activePorts,
    webUSBEnabled,
    openWebUSBSerial,
    isReceiving,
  };
};

export default useWebUSBSerial;
