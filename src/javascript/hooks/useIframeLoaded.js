import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


const useIframeLoaded = (timeout) => {
  const { printerUrl, printerConnected } = useSelector((state) => {
    const printerParams = state.printerParams ? `#${encodeURI(state.printerParams)}` : '';
    return ({
      printerUrl: state.printerUrl ? `${state.printerUrl}remote.html${printerParams}` : null,
      printerConnected: state.printerFunctions.length > 0,
    });
  });

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!loaded && !failed && !timer.current) {
      timer.current = window.setTimeout(() => {
        setFailed(true);
      }, timeout);
    }

    return () => {
      window.clearTimeout(timer.current);
    };
  }, [failed, loaded, timeout]);

  if (!loaded && printerConnected) {
    window.clearTimeout(timer.current);
    setLoaded(true);
  }

  return {
    failed,
    loaded,
    printerUrl,
    printerConnected,
  };
};

export default useIframeLoaded;
