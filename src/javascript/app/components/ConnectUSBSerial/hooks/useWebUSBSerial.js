import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import webUSBSerial from '../../../../tools/webUSBSerial';

window.webUSBSerial = webUSBSerial;

const useWebUSBSerial = () => {
  const webUSBEnabled = webUSBSerial.enabled;

  const dispatch = useDispatch();

  const [activePorts, setActivePorts] = useState([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const receivedData = useRef('');
  const receiveTimeOut = useRef(null);

  useEffect(() => {
    const importPlainText = (textDump) => {
      let file;
      try {
        file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
      } catch (error) {
        file = new Blob([...textDump], { type: 'text/plain' });
      }

      dispatch({
        type: 'IMPORT_FILES',
        payload: { files: [file] },
      });
    };

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
  }, [dispatch]);

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
