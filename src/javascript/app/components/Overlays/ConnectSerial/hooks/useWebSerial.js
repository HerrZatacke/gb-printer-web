import { useEffect, useRef, useState } from 'react';
import WebSerial from '../../../../../tools/WebSerial';
import useImportPlainText from '../../../../../hooks/useImportPlainText';

const useWebSerial = () => {
  const webSerialEnabled = WebSerial.enabled;

  // useSelector....
  const baudRate = 115200;

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

    setActivePorts(WebSerial.getActivePorts());
    WebSerial.addListener('activePortsChange', setActivePorts);
    WebSerial.addListener('data', handleReceivedData);

    return () => {
      WebSerial.removeListener('activePortsChange', setActivePorts);
      WebSerial.removeListener('data', handleReceivedData);
    };
  }, [importPlainText]);

  const openWebSerial = () => {
    WebSerial.requestPort(baudRate);
  };

  return {
    activePorts,
    webSerialEnabled,
    openWebSerial,
    isReceiving,
  };
};

export default useWebSerial;
