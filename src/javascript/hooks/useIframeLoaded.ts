import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useSettingsStore from '../app/stores/settingsStore';
import type { State } from '../app/store/State';


export interface UseIframeLoaded {
  failed: boolean,
  loaded: boolean,
  printerUrl?: string,
  printerConnected: boolean,
}

const useIframeLoaded = (timeout: number): UseIframeLoaded => {
  const { printerUrl, printerParams } = useSettingsStore();

  const encodedPrinterParams = printerParams ? `#${encodeURI(printerParams)}` : '';
  const fullPrinterUrl = printerUrl ? `${printerUrl}remote.html${encodedPrinterParams}` : undefined;

  const printerConnected = useSelector((state: State) => (
    state.printerFunctions.length > 0
  ));

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
    printerUrl: fullPrinterUrl,
    printerConnected,
  };
};

export default useIframeLoaded;
