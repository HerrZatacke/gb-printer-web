import { useEffect, useRef } from 'react';

export const useDebugValueChange = <T>(value: T, label: string = 'Value') => {
  const prevRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (prevRef.current !== undefined && prevRef.current !== value) {
      console.log(`---- [${label}] changed`);
      console.log('---- Previous:', prevRef.current);
      console.log('---- Current:', value);
    }
    prevRef.current = value;
  }, [label, value]);
};
