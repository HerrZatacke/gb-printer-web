import { useEffect, useState } from 'react';

export function useIdle(): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(() => setIsIdle(true));
      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    const timeout = window.setTimeout(() => setIsIdle(true), 1000);
    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return isIdle;
}
