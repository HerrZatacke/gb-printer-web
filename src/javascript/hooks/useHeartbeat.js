import { useEffect } from 'react';

let heartBeatInterval;

const useHeartbeat = (targetWindow) => (
  useEffect(() => {
    heartBeatInterval = window.setInterval(() => {
      targetWindow.postMessage({ remotePrinter: { heartbeat: true } }, '*');
    }, 500);

    return () => window.clearInterval(heartBeatInterval);
  })
);

export default useHeartbeat;
