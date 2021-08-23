import { useRef, useState } from 'react';

const useWebserial = () => {
  const webSerialEnabled = !!navigator.serial && !!window.TextDecoderStream;
  const reader = useRef(null);
  const received = useRef('');
  const pollTimeout = useRef(null);
  const completedTimeout = useRef(null);
  const [receivedData, setReceivedData] = useState('');

  const openWebSerial = () => {
    navigator.serial.requestPort()
      .then((port) => (
        port.open({ baudRate: 38400 })
          .then(() => {
            const textDecoder = new window.TextDecoderStream();
            port.readable.pipeTo(textDecoder.writable);
            reader.current = textDecoder.readable.getReader();
          })
      ));

    window.clearTimeout(pollTimeout.current);
    pollTimeout.current = window.setInterval(() => {
      if (reader?.current?.read) {
        reader.current.read()
          .then(({ value, done }) => {
            if (done) {
              reader.releaseLock();
              // setReceivedData(received.current);
              // received.current = '';
              return;
            }

            if (!value.length) {
              return;
            }

            received.current += value;
            // eslint-disable-next-line no-console
            console.log(received.current.length);

            window.clearTimeout(completedTimeout.current);
            completedTimeout.current = window.setTimeout(() => {
              // eslint-disable-next-line no-console
              console.log('complete');
              setReceivedData(received.current);
              received.current = '';
            }, 800);

          });
      }
    }, 5);
  };

  return {
    webSerialEnabled,
    openWebSerial,
    receivedData,
  };
};

export default useWebserial;
