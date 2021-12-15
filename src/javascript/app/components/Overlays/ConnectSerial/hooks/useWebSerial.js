import { useEffect, useRef, useState } from 'react';
import WebSerial from '../../../../../tools/WebSerial';
import useImportPlainText from '../../../../../hooks/useImportPlainText';

const useWebSerial = (passive) => {
  const webSerialEnabled = WebSerial.enabled;

  // useSelector....
  const baudRate = 115200;

  const importPlainText = useImportPlainText();

  const [activePorts, setActivePorts] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);

  const receivedData = useRef('');
  const receiveTimeOut = useRef(null);

  useEffect(() => {
    if (!WebSerial.enabled) {
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
      WebSerial.requestPort(baudRate);
    }
  };

  const setModeGBA = () => {
    WebSerial.changeMode(true);
  };

  const setModeDMG = () => {
    WebSerial.changeMode(false);
  };

  const fwinq = () => {
    WebSerial.fwinq();
  };

  return {
    activePorts,
    webSerialEnabled,
    openWebSerial,
    isReceiving,
    setModeDMG,
    setModeGBA,
    fwinq,
  };
};

export default useWebSerial;
