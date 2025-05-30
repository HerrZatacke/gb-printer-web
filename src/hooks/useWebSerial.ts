import { useEffect, useRef, useState } from 'react';
import useImportPlainText from '@/hooks/useImportPlainText';
import WebSerial from '@/tools/WebSerial';
import type SerialPortEE from '@/tools/WebSerial/SerialPort';

interface UseWebSerial {
  activePorts: SerialPortEE[]
  webSerialEnabled: boolean,
  openWebSerial: () => void,
  isReceiving: boolean,
}

const useWebSerial = (passive: boolean): UseWebSerial => {
  const webSerialEnabled = WebSerial.enabled;

  const importPlainText = useImportPlainText();

  const [activePorts, setActivePorts] = useState<SerialPortEE[]>([]);
  const [isReceiving, setIsReceiving] = useState<boolean>(false);

  const receivedData = useRef<string>('');
  const receiveTimeOut = useRef<number>(0);

  useEffect(() => {
    if (!WebSerial.enabled) {
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

    setActivePorts(WebSerial.getActivePorts());
    WebSerial.addListener('activePortsChange', setActivePorts);

    if (!passive) {
      WebSerial.addListener('data', handleReceivedData);
    }

    return () => {
      WebSerial.removeListener('activePortsChange', setActivePorts);
      WebSerial.removeListener('data', handleReceivedData);
    };
  }, [importPlainText, passive]);

  const openWebSerial = () => {
    if (WebSerial.enabled) {
      WebSerial.requestPort();
    }
  };

  return {
    activePorts,
    webSerialEnabled,
    openWebSerial,
    isReceiving,
  };
};

export default useWebSerial;
