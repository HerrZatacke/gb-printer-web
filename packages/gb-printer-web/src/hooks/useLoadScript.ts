import { useCallback } from 'react';

interface UseLoadScript {
  loadScript: (src: string) => Promise<void>;
}

export const useLoadScript = (): UseLoadScript => {
  const loadScript = useCallback((src: string): Promise<void> => (
    new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      s.onload = () => {
        resolve();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    })
  ), []);

  return {
    loadScript,
  };
};
