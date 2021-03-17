import { useEffect } from 'react';

let heartBeatInterval;

const useHeartbeat = (targetWindow) => (
  useEffect(() => {
    heartBeatInterval = window.setInterval(() => {
      targetWindow.postMessage({ remotePrinter: {
        height: document.body.getBoundingClientRect().height,
      } }, '*');
    }, 500);

    return () => window.clearInterval(heartBeatInterval);
  })
);

export default useHeartbeat;
