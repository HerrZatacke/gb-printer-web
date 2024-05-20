import { useEffect, useRef } from 'react';
import isTouchDevice from '../tools/isTouchDevice';

const useAutoFocus = () => {
  const ref = useRef<Element>();
  useEffect(() => {
    const lastFocussedElement = document.activeElement as HTMLElement | null;

    const focusables = ref.current ? [
      ...ref.current.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'),
    ] : [];

    if (focusables.length && !isTouchDevice()) {
      (focusables[0] as HTMLElement).focus();
    }

    return () => {
      lastFocussedElement?.focus();
    };
  }, []);

  return ref;
};

export default useAutoFocus;
