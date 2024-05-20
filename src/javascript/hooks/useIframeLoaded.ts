import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../app/store/State';


export interface UseIframeLoaded {
  failed: boolean,
  loaded: boolean,
  printerUrl: string | null,
  printerConnected: boolean,
}

const useIframeLoaded = (timeout: number): UseIframeLoaded => {
  const { printerUrl, printerConnected } = useSelector((state: State) => {
    const printerParams = state.printerParams ? `#${encodeURI(state.printerParams)}` : '';
    return ({
      printerUrl: state.printerUrl ? `${state.printerUrl}remote.html${printerParams}` : null,
      printerConnected: state.printerFunctions.length > 0,
    });
  });

  const [loaded, setLoaded] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const timer = useRef<number>();

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
