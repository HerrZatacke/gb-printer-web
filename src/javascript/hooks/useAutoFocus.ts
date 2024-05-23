import { useEffect, useRef } from 'react';
import isTouchDevice from '../tools/isTouchDevice';

interface UseAutoFocus {
  autofocusRef: React.MutableRefObject<HTMLElement | undefined>
}

const useAutoFocus = (): UseAutoFocus => {
  const autofocusRef = useRef<HTMLElement | undefined>();
  useEffect(() => {
    const lastFocussedElement = document.activeElement as HTMLElement | null;

    const focusables = autofocusRef.current ? [
      ...(autofocusRef.current as unknown as Element).querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'),
    ] : [];

    if (focusables.length && !isTouchDevice()) {
      (focusables[0] as HTMLElement).focus();
    }

    return () => {
      lastFocussedElement?.focus();
    };
  }, []);

  return {
    autofocusRef,
  };
};

export default useAutoFocus;
