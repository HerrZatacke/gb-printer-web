import { useEffect, useRef, useState } from 'react';
import useInteractionsStore from '@/stores/interactionsStore';
import useSettingsStore from '@/stores/settingsStore';


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

  const { printerFunctions } = useInteractionsStore();
  const printerConnected = printerFunctions.length > 0;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!loaded && !failed && !timer.current) {
      timer.current = window.setTimeout(() => {
        setFailed(true);
      }, timeout);
    }

    return () => {
      window.clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [failed, loaded, timeout]);

  if (!loaded && printerConnected) {
    window.clearTimeout(timer.current);
    timer.current = undefined;
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
