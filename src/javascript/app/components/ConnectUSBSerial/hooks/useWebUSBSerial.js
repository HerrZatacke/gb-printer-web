import { useEffect, useState, useRef } from 'react';
import webUSBSerial from '../../../../tools/webUSBSerial';
import useImportPlainText from '../../../../hooks/useImportPlainText';

window.webUSBSerial = webUSBSerial;

const useWebUSBSerial = () => {
  const webUSBEnabled = webUSBSerial.enabled;

  const importPlainText = useImportPlainText();

  const [activePorts, setActivePorts] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const receivedData = useRef('');
  const receiveTimeOut = useRef(null);

  useEffect(() => {

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

    setActivePorts(webUSBSerial.getActivePorts());
    webUSBSerial.addListener('activePortsChange', setActivePorts);
    webUSBSerial.addListener('data', handleReceivedData);

    return () => {
      webUSBSerial.removeListener('activePortsChange', setActivePorts);
      webUSBSerial.removeListener('data', handleReceivedData);
    };
  }, [importPlainText]);

  const openWebUSBSerial = () => {
    webUSBSerial.requestPort();
  };

  return {
    isReceiving,
    activePorts: activePorts.map(({ productName }) => productName),
    webUSBEnabled,
    openWebUSBSerial,
  };
};

export default useWebUSBSerial;
