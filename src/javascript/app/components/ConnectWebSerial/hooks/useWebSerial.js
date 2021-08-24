import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import SerialPort, { baudRates } from '../../../../tools/webSerial/SerialPort';
import useImportPlainText from '../../../../hooks/useImportPlainText';

const useWebserial = () => {
  const webSerialEnabled = !!navigator.serial && !!window.TextDecoderStream;

  const dispatch = useDispatch();
  const importPlainText = useImportPlainText();

  const [isConnected, setIsConnected] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);

  const receivedData = useRef('');
  const receiveTimeOut = useRef(null);

  const openWebSerial = () => {
    navigator.serial.requestPort()
      .then((device) => {

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

        dispatch({
          type: 'CONFIRM_ASK',
          payload: {
            message: 'Nothing found to import',
            questions: () => ([
              {
                label: 'Baudrate',
                key: 'baudRate',
                type: 'select',
                options: baudRates.map((rate) => ({
                  value: rate.toString(10),
                  name: rate.toString(10),
                  selected: rate === 38400,
                })),
              },
            ]),
            confirm: ({ baudRate }) => {
              dispatch({
                type: 'CONFIRM_ANSWERED',
              });

              const port = new SerialPort({ device, baudRate });

              port.addListener('data', handleReceivedData);

              port.addListener('error', (error) => {
                console.warn(error);
                setIsConnected(false);
                setIsReceiving(false);
                receivedData.current = '';
              });

              port.connect()
                .then(() => {
                  receivedData.current = '';
                  setIsConnected(true);
                });

            },
          },
        });

      });

  };

  return {
    webSerialEnabled,
    openWebSerial,
    isConnected,
    isReceiving,
  };
};

export default useWebserial;
