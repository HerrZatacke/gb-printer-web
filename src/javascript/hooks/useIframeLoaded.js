import { useEffect, useRef, useState } from 'react';


const useIframeLoaded = (timeout) => {
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

  return [
    failed,
    loaded,
    () => {
      window.clearTimeout(timer.current);
      setLoaded(true);
    },
  ];
};

export default useIframeLoaded;
