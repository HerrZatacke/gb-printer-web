import { useEffect, useRef, useState } from 'react';


const useIframeLoaded = (timeout, isLoaded) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (loaded || failed || timer.current) {
      return;
    }

    timer.current = window.setTimeout(() => {
      setFailed(true);
    }, timeout);
  });

  if (!loaded && isLoaded) {
    window.clearTimeout(timer.current);
    setLoaded(true);
  }

  return [
    failed,
    loaded,
  ];
};

export default useIframeLoaded;
