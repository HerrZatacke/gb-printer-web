import { useEffect, useState, useRef } from 'react';
import WebUSBSerial from '../../../../../tools/WebUSBSerial';
import useImportPlainText from '../../../../../hooks/useImportPlainText';

const useWebUSBSerial = (passive) => {
  const webUSBEnabled = WebUSBSerial.enabled;

  const importPlainText = useImportPlainText();

  const [activePorts, setActivePorts] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const receivedData = useRef('');
  const receiveTimeOut = useRef(null);

  useEffect(() => {
    if (!WebUSBSerial.enabled) {
      return () => {};
    }

    const handleReceivedData = (data) => {
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
